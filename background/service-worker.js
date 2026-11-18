// background/service-worker.js - MV3 Service Worker for IT English Split-View Extension

export const DEFAULT_STATE = {
  schedule: {
    enabled: true,
    time: '19:00',
    autoSplitScreen: true,
    splitRatio: 0.70 // 70% left work window, 30% right study window
  },
  progress: {
    learnedIds: [],
    todayLearnedIds: [],
    todayDate: '',
    dailyGoal: 5,
    streakDays: 0,
    lastStudyDate: null
  },
  alarmState: {
    nextAlarmTime: null,
    lastTriggeredAt: null,
    snoozedUntil: null,
    lastSplitWindowId: null,
    activeBanner: false
  },
  selectedSentenceId: 'standup-01',
  selectedCategory: 'all'
};

export const ALARM_NAMES = {
  DAILY: 'DAILY_ENGLISH_1900',
  SNOOZE: 'SNOOZE_ENGLISH_ALARM'
};

export function getLocalToday(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getLocalYesterday(date = new Date()) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return getLocalToday(d);
}

/**
 * Computes next epoch timestamp (ms) for the given "HH:mm" time.
 * If target today has passed (target <= nowMs), schedules for tomorrow.
 */
export function computeNextAlarmTimestamp(timeStr = '19:00', nowMs = Date.now()) {
  const [hoursStr, minutesStr] = String(timeStr || '19:00').split(':');
  const hours = Number.isFinite(Number(hoursStr)) ? Number(hoursStr) : 19;
  const minutes = Number.isFinite(Number(minutesStr)) ? Number(minutesStr) : 0;

  const target = new Date(nowMs);
  target.setHours(hours, minutes, 0, 0);

  if (target.getTime() <= nowMs) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime();
}

/**
 * Retrieves the current extension state from storage.local,
 * merging with DEFAULT_STATE and handling daily rollover.
 */
export async function getState() {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  const result = await chrome.storage.local.get('itEnglishState');
  const saved = result?.itEnglishState || {};

  const state = {
    schedule: { ...DEFAULT_STATE.schedule, ...(saved.schedule || {}) },
    progress: { ...DEFAULT_STATE.progress, ...(saved.progress || {}) },
    alarmState: { ...DEFAULT_STATE.alarmState, ...(saved.alarmState || {}) },
    selectedSentenceId: saved.selectedSentenceId || DEFAULT_STATE.selectedSentenceId,
    selectedCategory: saved.selectedCategory || DEFAULT_STATE.selectedCategory
  };

  const today = getLocalToday();
  if (!state.progress.todayDate) {
    state.progress.todayDate = today;
  } else if (state.progress.todayDate !== today) {
    // New day rollover
    state.progress.todayLearnedIds = [];
    state.progress.todayDate = today;
    state.alarmState.activeBanner = false;
  }

  return state;
}

/**
 * Saves extension state to chrome.storage.local
 */
export async function saveState(state) {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    return state;
  }
  await chrome.storage.local.set({ itEnglishState: state });
  return state;
}

/**
 * Resolves active display workArea bounds { left, top, width, height }
 */
export async function resolveDisplayWorkArea(targetWindow) {
  try {
    if (typeof chrome !== 'undefined' && chrome.system?.display?.getInfo) {
      const displays = await chrome.system.display.getInfo();
      if (Array.isArray(displays) && displays.length > 0) {
        const winLeft = targetWindow?.left ?? 0;
        const winTop = targetWindow?.top ?? 0;
        const matched =
          displays.find((d) => {
            const wa = d.workArea || d.bounds;
            return (
              winLeft >= wa.left &&
              winLeft < wa.left + wa.width &&
              winTop >= wa.top &&
              winTop < wa.top + wa.height
            );
          }) ||
          displays.find((d) => d.isPrimary) ||
          displays[0];

        if (matched?.workArea?.width >= 800) {
          return {
            left: matched.workArea.left,
            top: matched.workArea.top,
            width: matched.workArea.width,
            height: matched.workArea.height
          };
        }
      }
    }
  } catch {
    // Fall back to target window geometry
  }

  return {
    left: Math.max(0, targetWindow?.left ?? 0),
    top: Math.max(0, targetWindow?.top ?? 0),
    width: Math.max(targetWindow?.width ?? 1440, 1280),
    height: Math.max(targetWindow?.height ?? 900, 768)
  };
}

/**
 * Auto Split-Screen Window Algorithm:
 * Co cửa sổ chính 70% bên trái (chrome.windows.update)
 * và mở popup 30% bên phải (chrome.windows.create with focused: true)
 */
export async function openAutoSplitViewWindow(customState) {
  const state = customState || (await getState());
  const splitRatio = Math.min(
    Math.max(Number(state?.schedule?.splitRatio) || 0.70, 0.4),
    0.8
  );

  let mainWin = null;
  try {
    if (typeof chrome !== 'undefined' && chrome.windows?.getLastFocused) {
      mainWin = await chrome.windows.getLastFocused({
        populate: true,
        windowTypes: ['normal']
      });
    }
  } catch {
    mainWin = null;
  }

  if (!mainWin || typeof mainWin.id !== 'number') {
    try {
      const allNormal = await chrome.windows.getAll({
        populate: true,
        windowTypes: ['normal']
      });
      mainWin = allNormal?.[0] || null;
    } catch {
      mainWin = null;
    }
  }

  if (!mainWin || typeof mainWin.id !== 'number') {
    mainWin = await chrome.windows.create({
      url: 'chrome://newtab',
      type: 'normal',
      state: 'normal',
      focused: true
    });
  }

  const workArea = await resolveDisplayWorkArea(mainWin);
  const leftWidth = Math.round(workArea.width * splitRatio);
  const rightWidth = workArea.width - leftWidth;

  const leftBounds = {
    left: workArea.left,
    top: workArea.top,
    width: leftWidth,
    height: workArea.height,
    state: 'normal'
  };

  const rightBounds = {
    left: workArea.left + leftWidth,
    top: workArea.top,
    width: rightWidth,
    height: workArea.height
  };

  // 1. Normalize main window if it was maximized or fullscreen
  if (mainWin.state && mainWin.state !== 'normal') {
    await chrome.windows.update(mainWin.id, { state: 'normal' });
  }

  // 2. Resize and move main work window to the left (70%)
  await chrome.windows.update(mainWin.id, leftBounds);

  // 3. Create or reuse right study window (30%)
  const studyUrl = chrome.runtime?.getURL
    ? chrome.runtime.getURL('sidepanel/sidepanel.html?mode=split&alarm=1900')
    : 'sidepanel/sidepanel.html?mode=split&alarm=1900';

  let studyWindowId = state?.alarmState?.lastSplitWindowId ?? null;
  let reusedExisting = false;

  if (typeof studyWindowId === 'number' && studyWindowId !== mainWin.id) {
    try {
      const existingWin = await chrome.windows.get(studyWindowId);
      if (existingWin && existingWin.id) {
        await chrome.windows.update(studyWindowId, {
          ...rightBounds,
          state: 'normal',
          focused: true
        });
        reusedExisting = true;
      }
    } catch {
      reusedExisting = false;
    }
  }

  if (!reusedExisting) {
    const createdWin = await chrome.windows.create({
      url: studyUrl,
      type: 'popup',
      left: rightBounds.left,
      top: rightBounds.top,
      width: rightBounds.width,
      height: rightBounds.height,
      focused: true
    });
    studyWindowId = createdWin?.id ?? null;
  }

  state.alarmState.lastSplitWindowId = studyWindowId;
  await saveState(state);

  return {
    mainWindowId: mainWin.id,
    studyWindowId,
    reusedExisting,
    leftBounds,
    rightBounds
  };
}

export const performAutoSplitScreen = openAutoSplitViewWindow;

/**
 * Creates and shows Chrome desktop notification with Snooze 15m option
 */
export async function showReminderNotification() {
  if (typeof chrome === 'undefined' || !chrome.notifications?.create) {
    return 'notification-mock-id';
  }

  const iconUrl = chrome.runtime?.getURL
    ? chrome.runtime.getURL('icons/icon-128.png')
    : 'icons/icon-128.png';

  const notificationOptions = {
    type: 'basic',
    iconUrl,
    title: '⏰ Đã đến 19:00 - Giờ luyện IT English Split-View!',
    message: 'Màn hình đã được chia đôi 70/30. Dành 10 phút luyện phát âm và phản xạ IT English ngay!',
    priority: 2,
    requireInteraction: true,
    buttons: [
      { title: 'Snooze 15 phút' },
      { title: 'Bắt đầu học ngay' }
    ]
  };

  return await chrome.notifications.create('DAILY_REMINDER_1900', notificationOptions);
}

/**
 * Schedules daily alarm at configured time (default 19:00)
 */
export async function scheduleDailyAlarm(state) {
  if (typeof chrome === 'undefined' || !chrome.alarms) return;

  await chrome.alarms.clear(ALARM_NAMES.DAILY);
  await chrome.alarms.clear(ALARM_NAMES.SNOOZE);

  if (!state.schedule.enabled) {
    state.alarmState.nextAlarmTime = null;
    await saveState(state);
    return;
  }

  const nextTimestamp = computeNextAlarmTimestamp(state.schedule.time);
  await chrome.alarms.create(ALARM_NAMES.DAILY, {
    when: nextTimestamp,
    periodInMinutes: 1440 // Daily
  });

  state.alarmState.nextAlarmTime = nextTimestamp;
  await saveState(state);
}

/**
 * Handles incoming runtime messages across 6 core action types:
 * 1. GET_STATE
 * 2. TRIGGER_ALARM_NOW
 * 3. SNOOZE_ALARM
 * 4. UPDATE_SCHEDULE
 * 5. MARK_LEARNED
 * 6. SELECT_SENTENCE
 */
export async function handleRuntimeMessage(message, sender) {
  const type = message?.type;
  const payload = message?.payload || {};
  let state = await getState();

  switch (type) {
    case 'GET_STATE': {
      try {
        if (typeof chrome !== 'undefined' && chrome.alarms?.get) {
          const alarm = await chrome.alarms.get(ALARM_NAMES.DAILY);
          if (alarm?.scheduledTime) {
            state.alarmState.nextAlarmTime = alarm.scheduledTime;
          }
        }
      } catch {
        // Use stored nextAlarmTime
      }
      return { ok: true, state };
    }

    case 'TRIGGER_ALARM_NOW': {
      let splitResult = null;
      if (state.schedule.autoSplitScreen || payload.forceSplit) {
        splitResult = await openAutoSplitViewWindow(state);
      }
      await showReminderNotification();

      state.alarmState.lastTriggeredAt = Date.now();
      state.alarmState.activeBanner = true;
      state.alarmState.snoozedUntil = null;

      if (typeof chrome !== 'undefined' && chrome.action?.setBadgeText) {
        chrome.action.setBadgeText({ text: '19h' }).catch(() => {});
        chrome.action.setBadgeBackgroundColor({ color: '#EF4444' }).catch(() => {});
      }

      await saveState(state);
      return { ok: true, state, data: { splitResult } };
    }

    case 'SNOOZE_ALARM': {
      const minutes = Math.min(Math.max(Number(payload?.minutes) || 15, 1), 120);
      if (typeof chrome !== 'undefined' && chrome.alarms?.create) {
        await chrome.alarms.create(ALARM_NAMES.SNOOZE, { delayInMinutes: minutes });
      }

      state.alarmState.snoozedUntil = Date.now() + minutes * 60_000;
      state.alarmState.activeBanner = false;

      if (typeof chrome !== 'undefined' && chrome.action?.setBadgeText) {
        chrome.action.setBadgeText({ text: 'ZZZ' }).catch(() => {});
        chrome.action.setBadgeBackgroundColor({ color: '#F59E0B' }).catch(() => {});
      }

      await saveState(state);
      return { ok: true, state, data: { snoozedUntil: state.alarmState.snoozedUntil } };
    }

    case 'UPDATE_SCHEDULE': {
      if (payload.time && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(payload.time)) {
        return { ok: false, error: 'Invalid time format (expected HH:mm)', state };
      }

      if (payload.time) state.schedule.time = payload.time;
      if (typeof payload.enabled === 'boolean') state.schedule.enabled = payload.enabled;
      if (typeof payload.autoSplitScreen === 'boolean') {
        state.schedule.autoSplitScreen = payload.autoSplitScreen;
      }
      if (typeof payload.splitRatio === 'number') {
        state.schedule.splitRatio = Math.min(Math.max(payload.splitRatio, 0.4), 0.8);
      }

      await scheduleDailyAlarm(state);
      await saveState(state);
      return { ok: true, state };
    }

    case 'MARK_LEARNED': {
      const sentenceId = payload.sentenceId;
      if (!sentenceId || typeof sentenceId !== 'string') {
        return { ok: false, error: 'Missing sentenceId', state };
      }

      const learned = payload.learned !== false;
      const learnedSet = new Set(state.progress.learnedIds || []);
      const todaySet = new Set(state.progress.todayLearnedIds || []);

      if (learned) {
        learnedSet.add(sentenceId);
        todaySet.add(sentenceId);

        const today = getLocalToday();
        const yesterday = getLocalYesterday();
        if (state.progress.lastStudyDate !== today) {
          state.progress.streakDays =
            state.progress.lastStudyDate === yesterday ? (state.progress.streakDays || 0) + 1 : 1;
          state.progress.lastStudyDate = today;
        }
      } else {
        learnedSet.delete(sentenceId);
        todaySet.delete(sentenceId);
      }

      state.progress.learnedIds = Array.from(learnedSet);
      state.progress.todayLearnedIds = Array.from(todaySet);

      if (state.progress.todayLearnedIds.length >= (state.progress.dailyGoal || 5)) {
        state.alarmState.activeBanner = false;
        if (typeof chrome !== 'undefined' && chrome.action?.setBadgeText) {
          chrome.action.setBadgeText({ text: '✓' }).catch(() => {});
          chrome.action.setBadgeBackgroundColor({ color: '#10B981' }).catch(() => {});
        }
      }

      await saveState(state);
      return { ok: true, state };
    }

    case 'SELECT_SENTENCE': {
      const sentenceId = payload.sentenceId;
      if (!sentenceId || typeof sentenceId !== 'string') {
        return { ok: false, error: 'Missing sentenceId', state };
      }

      state.selectedSentenceId = sentenceId;
      await saveState(state);
      return { ok: true, state, data: { sentenceId } };
    }

    case 'SELECT_CATEGORY': {
      const categoryId = payload?.categoryId;
      if (!categoryId || typeof categoryId !== 'string') {
        return { ok: false, error: 'Missing categoryId', state };
      }
      state.selectedCategory = categoryId;
      await saveState(state);
      return { ok: true, state, data: { categoryId } };
    }

    default:
      return { ok: false, error: `Unknown message type: ${type}`, state };
  }
}

// -----------------------------------------------------------------------------
// Top-Level Chrome Extension Listeners Registration
// -----------------------------------------------------------------------------
if (typeof chrome !== 'undefined' && chrome.runtime?.onInstalled) {
  // 1. Extension Installed / Updated
  chrome.runtime.onInstalled.addListener(async () => {
    const state = await getState();
    await scheduleDailyAlarm(state);
    if (chrome.sidePanel?.setPanelBehavior) {
      chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
    }
  });

  // 2. Alarm Trigger Listener
  if (chrome.alarms?.onAlarm) {
    chrome.alarms.onAlarm.addListener(async (alarm) => {
      const state = await getState();
      if (alarm.name === ALARM_NAMES.DAILY || alarm.name === ALARM_NAMES.SNOOZE) {
        if (state.schedule.autoSplitScreen) {
          await openAutoSplitViewWindow(state);
        }
        await showReminderNotification();

        state.alarmState.lastTriggeredAt = Date.now();
        state.alarmState.activeBanner = true;
        state.alarmState.snoozedUntil = null;
        await saveState(state);

        if (chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({
            type: 'STATE_UPDATED',
            state,
            reason: 'ALARM_FIRED'
          }).catch(() => {});
        }
      }
    });
  }

  // 3. Notification Button Click Listener (Snooze 15m or Start)
  if (chrome.notifications?.onButtonClicked) {
    chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
      if (notificationId === 'DAILY_REMINDER_1900') {
        if (buttonIndex === 0) {
          // Button 0: Snooze 15 minutes
          await handleRuntimeMessage({ type: 'SNOOZE_ALARM', payload: { minutes: 15 } });
        } else if (buttonIndex === 1) {
          // Button 1: Start studying
          await openAutoSplitViewWindow();
        }
        chrome.notifications.clear(notificationId).catch(() => {});
      }
    });
  }

  // 4. Runtime Message Listener
  if (chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      (async () => {
        try {
          const res = await handleRuntimeMessage(message, sender);
          sendResponse(res);
        } catch (err) {
          sendResponse({ ok: false, error: err?.message || String(err) });
        }
      })();
      return true; // Keep message channel open for async response
    });
  }
}
