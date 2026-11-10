import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to extract PNG dimensions from the IHDR chunk
function getPngDimensions(filePath) {
  assert.ok(fs.existsSync(filePath), `File does not exist: ${filePath}`);
  const buf = fs.readFileSync(filePath);
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    buf.length >= 24 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a;
  assert.ok(isPng, `File is not a valid PNG: ${filePath}`);

  // IHDR chunk starts at byte 12 ('IHDR' at 12-15)
  const ihdrType = buf.toString('ascii', 12, 16);
  assert.equal(ihdrType, 'IHDR', 'Missing IHDR chunk in PNG');

  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

// -----------------------------------------------------------------------------
// 1. MANIFEST.JSON TESTS (Manifest V3, permissions, background, sidePanel)
// -----------------------------------------------------------------------------
test('manifest.json validation (MV3, sidePanel, alarms, notifications, storage, tabs)', () => {
  const manifestPath = path.join(ROOT_DIR, 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');

  const raw = fs.readFileSync(manifestPath, 'utf8');
  let manifest;
  assert.doesNotThrow(() => {
    manifest = JSON.parse(raw);
  }, 'manifest.json must be valid JSON');

  assert.equal(manifest.manifest_version, 3, 'manifest_version must be 3');
  assert.ok(manifest.name, 'manifest.name must be defined');
  assert.ok(manifest.version, 'manifest.version must be defined');

  // Permissions validation
  const requiredPermissions = ['alarms', 'notifications', 'storage', 'tabs', 'sidePanel'];
  for (const perm of requiredPermissions) {
    assert.ok(
      manifest.permissions?.includes(perm),
      `manifest.permissions must include '${perm}'`
    );
  }

  // Background service worker
  assert.ok(manifest.background, 'manifest.background must be configured');
  assert.equal(
    manifest.background.service_worker,
    'background/service-worker.js',
    'background.service_worker must point to background/service-worker.js'
  );
  assert.equal(
    manifest.background.type,
    'module',
    'background.type must be "module"'
  );

  // Side panel configuration
  assert.ok(manifest.side_panel, 'manifest.side_panel must be configured');
  assert.equal(
    manifest.side_panel.default_path,
    'sidepanel/sidepanel.html',
    'side_panel.default_path must point to sidepanel/sidepanel.html'
  );

  // Action configuration
  assert.ok(manifest.action, 'manifest.action must be defined');

  // Icons configuration
  assert.ok(manifest.icons, 'manifest.icons must be defined');
  assert.equal(manifest.icons['16'], 'icons/icon-16.png');
  assert.equal(manifest.icons['48'], 'icons/icon-48.png');
  assert.equal(manifest.icons['128'], 'icons/icon-128.png');
});

// -----------------------------------------------------------------------------
// 2. ICONS TESTS (16x16, 48x48, 128x128 PNG files)
// -----------------------------------------------------------------------------
test('icons exist and have exact PNG dimensions', () => {
  const iconSizes = [
    { file: 'icons/icon-16.png', size: 16 },
    { file: 'icons/icon-48.png', size: 48 },
    { file: 'icons/icon-128.png', size: 128 }
  ];

  for (const { file, size } of iconSizes) {
    const fullPath = path.join(ROOT_DIR, file);
    const { width, height } = getPngDimensions(fullPath);
    assert.equal(width, size, `${file} width must be ${size}px`);
    assert.equal(height, size, `${file} height must be ${size}px`);
  }
});

// -----------------------------------------------------------------------------
// 3. DATA/SENTENCES.JS TESTS (>=15 sentences across 5 IT topics with 14 fields)
// -----------------------------------------------------------------------------
test('data/sentences.js dataset validation', async () => {
  const sentencesFilePath = path.join(ROOT_DIR, 'data/sentences.js');
  assert.ok(fs.existsSync(sentencesFilePath), 'data/sentences.js must exist');

  const { IT_SENTENCES, CATEGORIES } = await import(`file://${sentencesFilePath}`);

  assert.ok(Array.isArray(CATEGORIES), 'CATEGORIES must be an array');
  assert.ok(Array.isArray(IT_SENTENCES), 'IT_SENTENCES must be an array');
  assert.ok(
    IT_SENTENCES.length >= 15,
    `IT_SENTENCES length must be >= 15, received ${IT_SENTENCES.length}`
  );

  const requiredCategories = ['standup', 'codereview', 'architecture', 'incident', 'interview'];
  const presentCategories = new Set(IT_SENTENCES.map((s) => s.category));

  for (const cat of requiredCategories) {
    assert.ok(
      presentCategories.has(cat),
      `IT_SENTENCES must contain sentences for category '${cat}'`
    );
  }

  const requiredFields = [
    'id',
    'category',
    'categoryLabel',
    'sentence',
    'ipa',
    'stressGuide',
    'meaningVi',
    'nuanceVi',
    'insteadOf',
    'contextTitle',
    'dialogue',
    'keyChunks',
    'alternatives',
    'interviewTip'
  ];

  const seenIds = new Set();
  for (const item of IT_SENTENCES) {
    assert.ok(item.id, 'Every sentence item must have an id');
    assert.ok(!seenIds.has(item.id), `Duplicate sentence id: ${item.id}`);
    seenIds.add(item.id);

    for (const field of requiredFields) {
      assert.ok(
        item[field] !== undefined && item[field] !== null && item[field] !== '',
        `Sentence [${item.id}] is missing or has empty required field: ${field}`
      );
    }

    // Additional data structure checks
    assert.ok(Array.isArray(item.keyChunks), `[${item.id}].keyChunks must be an array`);
    assert.ok(item.keyChunks.length >= 2, `[${item.id}].keyChunks must have >= 2 items`);

    assert.ok(Array.isArray(item.alternatives), `[${item.id}].alternatives must be an array`);
    assert.ok(item.alternatives.length >= 2, `[${item.id}].alternatives must have >= 2 items`);

    // Ensure aliases exist for backward compatibility with SA architecture
    assert.ok(item.english || item.sentence, `[${item.id}] must support sentence/english`);
    assert.ok(item.vietnamese || item.meaningVi, `[${item.id}] must support meaningVi/vietnamese`);
  }
});

// -----------------------------------------------------------------------------
// 4. BACKGROUND/SERVICE-WORKER.JS TESTS
// -----------------------------------------------------------------------------
test('background/service-worker.js module logic, alarms, split-view, notifications, and message handlers', async () => {
  const swFilePath = path.join(ROOT_DIR, 'background/service-worker.js');
  assert.ok(fs.existsSync(swFilePath), 'background/service-worker.js must exist');

  // In-memory mock storage and call trackers
  const storageState = {};
  const alarmsCreated = [];
  const alarmsCleared = [];
  const notificationsCreated = [];
  const windowsUpdated = [];
  const windowsCreated = [];
  const badgeUpdates = [];

  let lastFocusedWindow = {
    id: 101,
    left: 0,
    top: 0,
    width: 1440,
    height: 900,
    state: 'normal',
    focused: true
  };

  // Setup global mock for Chrome APIs before importing service worker
  globalThis.chrome = {
    runtime: {
      getURL: (subpath) => `chrome-extension://test-extension-id/${subpath}`,
      sendMessage: async () => ({ ok: true }),
      onInstalled: { addListener: () => {} },
      onMessage: { addListener: () => {} }
    },
    storage: {
      local: {
        get: async (keys) => {
          if (typeof keys === 'string') {
            return { [keys]: storageState[keys] };
          }
          if (Array.isArray(keys)) {
            const res = {};
            for (const k of keys) res[k] = storageState[k];
            return res;
          }
          return { ...storageState };
        },
        set: async (obj) => {
          Object.assign(storageState, obj);
        }
      }
    },
    alarms: {
      create: async (name, alarmInfo) => {
        alarmsCreated.push({ name, alarmInfo });
      },
      clear: async (name) => {
        alarmsCleared.push(name);
      },
      get: async (name) => {
        const found = alarmsCreated.find((a) => a.name === name);
        return found ? { name, scheduledTime: found.alarmInfo.when || Date.now() + 1000 } : null;
      },
      onAlarm: { addListener: () => {} }
    },
    notifications: {
      create: async (id, options) => {
        notificationsCreated.push({ id, options });
        return id || 'notification-id';
      },
      clear: async () => {},
      onButtonClicked: { addListener: () => {} },
      onClicked: { addListener: () => {} }
    },
    windows: {
      getLastFocused: async () => ({ ...lastFocusedWindow }),
      getAll: async () => [{ ...lastFocusedWindow }],
      get: async (id) => (id === lastFocusedWindow.id ? { ...lastFocusedWindow } : null),
      update: async (id, updateInfo) => {
        windowsUpdated.push({ id, updateInfo });
        if (id === lastFocusedWindow.id) {
          Object.assign(lastFocusedWindow, updateInfo);
        }
        return { id, ...updateInfo };
      },
      create: async (createData) => {
        const createdWin = { id: 999, ...createData };
        windowsCreated.push(createdWin);
        return createdWin;
      }
    },
    action: {
      setBadgeText: async (details) => {
        badgeUpdates.push(details);
      },
      setBadgeBackgroundColor: async () => {}
    },
    system: {
      display: {
        getInfo: async () => [
          {
            isPrimary: true,
            workArea: { left: 0, top: 0, width: 1440, height: 900 }
          }
        ]
      }
    }
  };

  const swModule = await import(`file://${swFilePath}`);

  // Test computeNextAlarmTimestamp
  assert.equal(
    typeof swModule.computeNextAlarmTimestamp,
    'function',
    'computeNextAlarmTimestamp must be exported'
  );

  // When now is 10:00 AM on 2026-11-10
  const morningMs = new Date('2026-11-10T10:00:00+07:00').getTime();
  const next1900Morning = swModule.computeNextAlarmTimestamp('19:00', morningMs);
  const morningTarget = new Date(next1900Morning);
  assert.equal(morningTarget.getDate(), 10, 'Target should be today (10th)');
  assert.equal(morningTarget.getHours(), 19, 'Target hours should be 19');
  assert.equal(morningTarget.getMinutes(), 0, 'Target minutes should be 0');

  // When now is 20:30 PM on 2026-11-10
  const eveningMs = new Date('2026-11-10T20:30:00+07:00').getTime();
  const next1900Evening = swModule.computeNextAlarmTimestamp('19:00', eveningMs);
  const eveningTarget = new Date(next1900Evening);
  assert.equal(eveningTarget.getDate(), 11, 'Target should be tomorrow (11th)');
  assert.equal(eveningTarget.getHours(), 19, 'Target hours should be 19');

  // Test openAutoSplitViewWindow (co cửa sổ chính 70% bên trái + mở popup 30% bên phải focused: true)
  assert.equal(
    typeof swModule.openAutoSplitViewWindow,
    'function',
    'openAutoSplitViewWindow must be exported'
  );

  windowsUpdated.length = 0;
  windowsCreated.length = 0;

  const splitResult = await swModule.openAutoSplitViewWindow();
  assert.ok(splitResult, 'openAutoSplitViewWindow should return split window info');

  // Check main window updated to 70% left
  assert.ok(windowsUpdated.length >= 1, 'chrome.windows.update should be called');
  const mainUpdate = windowsUpdated.find((u) => u.id === 101);
  assert.ok(mainUpdate, 'Main window must be updated');
  const expectedLeftWidth = Math.round(1440 * 0.7); // 1008
  assert.equal(mainUpdate.updateInfo.left, 0, 'Left window left must be 0');
  assert.equal(mainUpdate.updateInfo.width, expectedLeftWidth, 'Left window width must be ~70% (1008px)');

  // Check right window created at 30% right with focused: true
  assert.equal(windowsCreated.length, 1, 'chrome.windows.create should be called once');
  const rightCreate = windowsCreated[0];
  const expectedRightWidth = 1440 - expectedLeftWidth; // 432
  assert.equal(rightCreate.left, expectedLeftWidth, 'Right window left must be left + leftWidth');
  assert.equal(rightCreate.width, expectedRightWidth, 'Right window width must be ~30% (432px)');
  assert.equal(rightCreate.focused, true, 'Right window must have focused: true');
  assert.equal(rightCreate.type, 'popup', 'Right window type must be popup');
  assert.ok(
    rightCreate.url.includes('sidepanel/sidepanel.html'),
    'Right window url must point to sidepanel/sidepanel.html'
  );

  // Test Notification with Snooze button
  assert.equal(
    typeof swModule.showReminderNotification,
    'function',
    'showReminderNotification must be exported'
  );
  notificationsCreated.length = 0;
  await swModule.showReminderNotification();
  assert.equal(notificationsCreated.length, 1, 'chrome.notifications.create should be called');
  const notif = notificationsCreated[0].options;
  assert.ok(notif.buttons && notif.buttons.length >= 1, 'Notification must contain buttons');
  const hasSnoozeButton = notif.buttons.some((b) => /snooze/i.test(b.title));
  assert.ok(hasSnoozeButton, 'Notification must contain a Snooze button');

  // Test handleRuntimeMessage for 6 message types:
  // 1. GET_STATE
  const resGetState = await swModule.handleRuntimeMessage({ type: 'GET_STATE' });
  assert.equal(resGetState.ok, true, 'GET_STATE must return ok: true');
  assert.ok(resGetState.state, 'GET_STATE must return state');
  assert.ok(resGetState.state.schedule, 'state must have schedule');
  assert.ok(resGetState.state.progress, 'state must have progress');
  assert.ok(resGetState.state.alarmState, 'state must have alarmState');

  // 2. TRIGGER_ALARM_NOW
  const resTrigger = await swModule.handleRuntimeMessage({ type: 'TRIGGER_ALARM_NOW' });
  assert.equal(resTrigger.ok, true, 'TRIGGER_ALARM_NOW must return ok: true');
  assert.equal(resTrigger.state.alarmState.activeBanner, true, 'activeBanner should be set to true');

  // 3. SNOOZE_ALARM (15 minutes default or custom)
  alarmsCreated.length = 0;
  const resSnooze = await swModule.handleRuntimeMessage({
    type: 'SNOOZE_ALARM',
    payload: { minutes: 15 }
  });
  assert.equal(resSnooze.ok, true, 'SNOOZE_ALARM must return ok: true');
  assert.ok(
    resSnooze.state.alarmState.snoozedUntil > Date.now(),
    'snoozedUntil must be set to future timestamp'
  );
  assert.ok(
    alarmsCreated.some((a) => a.name.includes('SNOOZE')),
    'Snooze alarm must be scheduled in chrome.alarms'
  );

  // 4. UPDATE_SCHEDULE
  const resUpdateSchedule = await swModule.handleRuntimeMessage({
    type: 'UPDATE_SCHEDULE',
    payload: { time: '19:00', enabled: true }
  });
  assert.equal(resUpdateSchedule.ok, true, 'UPDATE_SCHEDULE must return ok: true');
  assert.equal(resUpdateSchedule.state.schedule.time, '19:00');

  // 5. MARK_LEARNED
  const resMarkLearned = await swModule.handleRuntimeMessage({
    type: 'MARK_LEARNED',
    payload: { sentenceId: 'standup-01', learned: true }
  });
  assert.equal(resMarkLearned.ok, true, 'MARK_LEARNED must return ok: true');
  assert.ok(
    resMarkLearned.state.progress.learnedIds.includes('standup-01'),
    'learnedIds must include standup-01'
  );
  assert.ok(
    resMarkLearned.state.progress.todayLearnedIds.includes('standup-01'),
    'todayLearnedIds must include standup-01'
  );

  // 6. SELECT_SENTENCE
  const resSelectSentence = await swModule.handleRuntimeMessage({
    type: 'SELECT_SENTENCE',
    payload: { sentenceId: 'interview-01' }
  });
  assert.equal(resSelectSentence.ok, true, 'SELECT_SENTENCE must return ok: true');
  assert.equal(
    resSelectSentence.state.selectedSentenceId,
    'interview-01',
    'selectedSentenceId must match payload'
  );
});
