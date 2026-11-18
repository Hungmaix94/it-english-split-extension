import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---- Shared chrome mock (module is imported once; env is reset per test) ----
const env = {};
const listeners = {};
function resetEnv() {
  env.storage = {};
  env.notifications = [];
  env.updates = [];
  env.created = [];
  env.badges = [];
  env.updateFails = false;
  env.alarms = [];
  env.calls = [];
  env.sidePanelFails = false;
  env.cleared = [];
  env.main = { id: 101, left: 10, top: 20, width: 1200, height: 800, state: 'normal' };
}
resetEnv();

globalThis.chrome = {
  runtime: {
    getURL: (p) => `chrome-extension://x/${p}`,
    sendMessage: async () => ({ ok: true }),
    onInstalled: { addListener: () => {} },
    onMessage: { addListener: () => {} }
  },
  storage: {
    local: {
      get: async (k) => (env.calls.push('storage.get'), { [k]: env.storage[k] }),
      set: async (o) => Object.assign(env.storage, o)
    }
  },
  alarms: {
    create: async (name, info) => (env.calls.push('alarms.create'), env.alarms.push({ name, info })),
    clear: async (name) => env.cleared.push(name),
    get: async () => null,
    onAlarm: { addListener: (fn) => (listeners.onAlarm = fn) }
  },
  notifications: {
    create: async (id, options) => {
      env.notifications.push({ id, options });
      return id;
    },
    clear: async () => {},
    onButtonClicked: { addListener: (fn) => (listeners.onButtonClicked = fn) },
    onClicked: { addListener: (fn) => (listeners.onClicked = fn) }
  },
  sidePanel: {
    open: (opts) => {
      env.calls.push('sidePanel.open');
      env.sidePanelOpened = opts;
      return env.sidePanelFails ? Promise.reject(new Error('no gesture')) : Promise.resolve();
    },
    setPanelBehavior: async () => {}
  },
  windows: {
    getLastFocused: async () => ({ ...env.main }),
    getAll: async () => [{ ...env.main }],
    get: async (id) => {
      if (id === 999) return { id: 999 };
      throw new Error('no window');
    },
    update: async (id, info) => {
      env.calls.push('windows.update');
      env.updates.push({ id, info });
      if (env.updateFails) throw new Error('update failed');
      return { id, ...info };
    },
    create: async (data) => {
      env.created.push(data);
      return { id: 999, ...data };
    },
    onRemoved: { addListener: (fn) => (listeners.onRemoved = fn) }
  },
  action: {
    setBadgeText: async (d) => env.badges.push(d),
    setBadgeBackgroundColor: async () => {}
  },
  system: {
    display: {
      getInfo: async () => [{ isPrimary: true, workArea: { left: 0, top: 0, width: 1440, height: 900 } }]
    }
  }
};

const sw = await import(`file://${ROOT_DIR}/background/service-worker.js`);

const savedState = () => env.storage.itEnglishState;

test('B1: fullscreen main window is not resized; study window still opens', async () => {
  resetEnv();
  env.main.state = 'fullscreen';
  const res = await sw.openAutoSplitViewWindow();
  assert.equal(env.updates.filter((u) => u.id === 101).length, 0, 'no windows.update on fullscreen main window');
  assert.equal(env.created.length, 1, 'study window must still be created');
  assert.ok(res.studyWindowId);
});

test('B2: executeReminderFlow(forceSplit) notifies and persists even if split throws', async () => {
  resetEnv();
  env.updateFails = true;
  assert.equal(typeof sw.executeReminderFlow, 'function');
  const res = await sw.executeReminderFlow({ source: 'manual', forceSplit: true });
  assert.equal(env.notifications.length, 1, 'notification created despite windows.update rejecting');
  assert.ok(savedState().alarmState.lastTriggeredAt, 'lastTriggeredAt saved');
  assert.equal(savedState().alarmState.activeBanner, true);
  assert.ok(res, 'flow resolves instead of throwing');
});

test('AC3/AC1: 19:00 alarm only notifies and creates AUTO_SPLIT_FALLBACK {delayInMinutes:1}; no window changes', async () => {
  resetEnv();
  await listeners.onAlarm({ name: sw.ALARM_NAMES.DAILY });
  assert.equal(env.notifications.length, 1, 'onAlarm shows notification');
  assert.equal(env.created.length, 0, 'no study window at 19:00');
  assert.equal(env.updates.length, 0, 'main window untouched at 19:00');
  assert.equal(env.sidePanelOpened, undefined, 'side panel never opened at 19:00');
  const fb = env.alarms.find((a) => a.name === sw.ALARM_NAMES.AUTO_SPLIT_FALLBACK);
  assert.ok(fb, 'fallback alarm created');
  assert.equal(fb.info.delayInMinutes, 1);
});

test('AC3: notification buttons are [0] Hoc ngay, [1] Snooze', async () => {
  resetEnv();
  await listeners.onAlarm({ name: sw.ALARM_NAMES.DAILY });
  const btn = env.notifications[0].options.buttons;
  assert.match(btn[0].title, /Học ngay/);
  assert.match(btn[1].title, /Snooze/);
  assert.doesNotMatch(env.notifications[0].options.message, /đã được chia đôi/);
});

test('displayMode defaults to split; sidePanel mode schedules no fallback alarm', async () => {
  resetEnv();
  const r = await sw.handleRuntimeMessage({ type: 'GET_STATE' });
  assert.equal(r.state.schedule.displayMode, 'split');
  await sw.handleRuntimeMessage({ type: 'UPDATE_SCHEDULE', payload: { displayMode: 'sidePanel' } });
  env.alarms.length = 0;
  await listeners.onAlarm({ name: sw.ALARM_NAMES.DAILY });
  assert.equal(env.alarms.some((a) => a.name === sw.ALARM_NAMES.AUTO_SPLIT_FALLBACK), false);
  await sw.handleRuntimeMessage({ type: 'UPDATE_SCHEDULE', payload: { displayMode: 'split' } });
});

test('AC2: fallback alarm splits when not snoozed; skipped when autoSplitScreen=false', async () => {
  resetEnv();
  await listeners.onAlarm({ name: sw.ALARM_NAMES.DAILY });
  await listeners.onAlarm({ name: sw.ALARM_NAMES.AUTO_SPLIT_FALLBACK });
  assert.equal(env.created.length, 1, 'fallback opens study window');
  assert.equal(env.sidePanelOpened, undefined, 'side panel is never opened automatically');

  resetEnv();
  await sw.handleRuntimeMessage({ type: 'UPDATE_SCHEDULE', payload: { autoSplitScreen: false } });
  await listeners.onAlarm({ name: sw.ALARM_NAMES.DAILY });
  assert.equal(env.alarms.some((a) => a.name === sw.ALARM_NAMES.AUTO_SPLIT_FALLBACK), false);
  await listeners.onAlarm({ name: sw.ALARM_NAMES.AUTO_SPLIT_FALLBACK });
  assert.equal(env.created.length, 0);
  await sw.handleRuntimeMessage({ type: 'UPDATE_SCHEDULE', payload: { autoSplitScreen: true } });
});

test('AC2: Snooze clears fallback, never resizes main window; stale fallback ignored', async () => {
  resetEnv();
  await listeners.onAlarm({ name: sw.ALARM_NAMES.DAILY });
  await listeners.onButtonClicked('DAILY_REMINDER_1900', 1);
  assert.ok(env.cleared.includes(sw.ALARM_NAMES.AUTO_SPLIT_FALLBACK), 'fallback cleared');
  assert.ok(env.alarms.some((a) => a.name === sw.ALARM_NAMES.SNOOZE), 'snooze alarm created');
  assert.equal(env.updates.length, 0, '0 window updates on snooze');
  await listeners.onAlarm({ name: sw.ALARM_NAMES.AUTO_SPLIT_FALLBACK });
  assert.equal(env.created.length, 0, 'no split after snooze');
});

test('startStudy (Hoc ngay button) clears fallback and splits in split mode', async () => {
  resetEnv();
  await listeners.onButtonClicked('DAILY_REMINDER_1900', 0);
  assert.ok(env.cleared.includes(sw.ALARM_NAMES.AUTO_SPLIT_FALLBACK));
  assert.equal(env.created.length, 1);
  resetEnv();
  await listeners.onClicked('DAILY_REMINDER_1900');
  assert.equal(env.created.length, 1, 'notification body click also starts study');
});

test('startStudy in sidePanel mode: sidePanel.open is the first chrome call (user gesture)', async () => {
  resetEnv();
  await sw.handleRuntimeMessage({ type: 'UPDATE_SCHEDULE', payload: { displayMode: 'sidePanel' } });
  env.calls.length = 0;
  const p = sw.startStudy({ windowId: 101 });
  assert.equal(env.calls[0], 'sidePanel.open', 'first call, synchronously, before any await');
  assert.equal(env.sidePanelOpened.windowId, 101);
  await p;
  assert.equal(env.created.length, 0, 'no split window when side panel opened');
  assert.ok(env.cleared.includes(sw.ALARM_NAMES.AUTO_SPLIT_FALLBACK));
});

test('startStudy in sidePanel mode falls back to split if sidePanel.open rejects', async () => {
  resetEnv();
  await sw.handleRuntimeMessage({ type: 'UPDATE_SCHEDULE', payload: { displayMode: 'sidePanel' } });
  env.sidePanelFails = true;
  await sw.startStudy({ windowId: 101 });
  assert.equal(env.created.length, 1, 'falls back to split view');
  await sw.handleRuntimeMessage({ type: 'UPDATE_SCHEDULE', payload: { displayMode: 'split' } });
});

test('B2: TRIGGER_ALARM_NOW notifies; with forceSplit a failing split never blocks notification/state', async () => {
  resetEnv();
  env.updateFails = true;
  const r = await sw.handleRuntimeMessage({ type: 'TRIGGER_ALARM_NOW', payload: { forceSplit: true } });
  assert.equal(r.ok, true);
  assert.equal(env.notifications.length, 1);
  assert.ok(savedState().alarmState.lastTriggeredAt);
});

test('B3: original bounds saved before split; onRemoved restores them and clears ids', async () => {
  resetEnv();
  await sw.openAutoSplitViewWindow();
  const a = savedState().alarmState;
  assert.equal(a.mainWindowId, 101);
  assert.deepEqual(
    { l: a.originalMainBounds.left, t: a.originalMainBounds.top, w: a.originalMainBounds.width, h: a.originalMainBounds.height },
    { l: 10, t: 20, w: 1200, h: 800 }
  );
  assert.equal(a.lastSplitWindowId, 999);

  assert.equal(typeof listeners.onRemoved, 'function', 'chrome.windows.onRemoved listener registered');
  env.updates.length = 0;
  await listeners.onRemoved(555); // unrelated window
  assert.equal(env.updates.length, 0, 'unrelated window close ignored');

  await listeners.onRemoved(999);
  const restore = env.updates.find((u) => u.id === 101);
  assert.ok(restore, 'main window restored');
  assert.equal(restore.info.left, 10);
  assert.equal(restore.info.width, 1200);
  assert.equal(restore.info.height, 800);
  const after = savedState().alarmState;
  assert.equal(after.lastSplitWindowId, null);
  assert.equal(after.originalMainBounds, null);
});

test('B3: onRemoved swallows restore errors and still clears state', async () => {
  resetEnv();
  await sw.openAutoSplitViewWindow();
  env.updateFails = true;
  await assert.doesNotReject(() => listeners.onRemoved(999));
  assert.equal(savedState().alarmState.lastSplitWindowId, null);
});

test('B7b: MARK_LEARNED sets badge to streak value like "1d"', async () => {
  resetEnv();
  await sw.handleRuntimeMessage({ type: 'MARK_LEARNED', payload: { sentenceId: 'standup-01' } });
  const last = env.badges[env.badges.length - 1];
  assert.equal(last.text, `${savedState().progress.streakDays}d`);
  assert.match(last.text, /^\d+d$/);
});

test('B8-data: keyChunks are {chunk, meaning} and every item has intonation with arrows', async () => {
  const { IT_SENTENCES } = await import(`file://${ROOT_DIR}/data/sentences.js`);
  assert.equal(IT_SENTENCES.length, 17);
  for (const s of IT_SENTENCES) {
    assert.ok(s.keyChunks.length >= 2, `${s.id} keyChunks`);
    for (const k of s.keyChunks) {
      assert.equal(typeof k.chunk, 'string', `${s.id} chunk`);
      assert.ok(k.chunk.length > 0);
      assert.equal(typeof k.meaning, 'string', `${s.id} meaning`);
      assert.ok(k.meaning.length >= 3, `${s.id} meaning non-empty`);
      assert.notEqual(k.meaning, k.chunk);
    }
    assert.equal(typeof s.intonation, 'string', `${s.id} intonation`);
    assert.match(s.intonation, /[↗↘]/, `${s.id} intonation has an arrow`);
  }
});
