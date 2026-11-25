import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => fs.readFileSync(path.join(rootDir, ...p), 'utf8');

describe('Addendum A rev2 (4): schedule.displayMode control', () => {
  test('settings UI has a displayMode control with split + sidePanel options', () => {
    const html = read('sidepanel', 'sidepanel.html');
    assert.match(html, /id="schedule-display-mode"/);
    assert.match(html, /value="split"/);
    assert.match(html, /value="sidePanel"/);
    assert.match(html, /<label for="schedule-display-mode"/);
  });

  test('FE default matches SW default (split)', async () => {
    const { createInitialState } = await import(`file://${path.join(rootDir, 'sidepanel', 'sidepanel.js')}`);
    assert.strictEqual(createInitialState().schedule.displayMode, 'split');
  });

  test('panel reflects state and sends displayMode via UPDATE_SCHEDULE', () => {
    const js = read('sidepanel', 'sidepanel.js');
    assert.match(js, /schedule-display-mode/);
    assert.match(js, /displayMode:\s*modeSelect/);
    assert.match(js, /schedule\?*\.displayMode/);
  });

  test('dual daily reminders: morningTime (09:00) and late-afternoon/evening time (19:00) exist in UI and SW', async () => {
    const html = read('sidepanel', 'sidepanel.html');
    assert.match(html, /id="schedule-morning-time-input"/);
    assert.match(html, /id="schedule-time-input"/);

    const { createInitialState } = await import(`file://${path.join(rootDir, 'sidepanel', 'sidepanel.js')}`);
    const init = createInitialState();
    assert.strictEqual(init.schedule.morningTime, '09:00');
    assert.strictEqual(init.schedule.time, '19:00');

    const { DEFAULT_STATE, ALARM_NAMES } = await import(`file://${path.join(rootDir, 'background', 'service-worker.js')}`);
    assert.strictEqual(DEFAULT_STATE.schedule.morningTime, '09:00');
    assert.strictEqual(DEFAULT_STATE.schedule.time, '19:00');
    assert.strictEqual(ALARM_NAMES.MORNING, 'DAILY_ENGLISH_MORNING');
    assert.strictEqual(ALARM_NAMES.DAILY, 'DAILY_ENGLISH_1900');
    assert.strictEqual(ALARM_NAMES.WEEKLY_SYNC, 'WEEKLY_AI_SYNC');
  });

  test('weekly AI sync: #btn-sync-ai exists in UI and WEEKLY_AI_FEED_URL points to Cloudflare R2', async () => {
    const html = read('sidepanel', 'sidepanel.html');
    assert.match(html, /id="btn-sync-ai"/);

    const { WEEKLY_AI_FEED_URL, syncWeeklyAiSentences } = await import(
      `file://${path.join(rootDir, 'background', 'service-worker.js')}`
    );
    assert.match(WEEKLY_AI_FEED_URL, /r2\.dev\/it-english\/weekly-sentences\.json$/);
    assert.strictEqual(typeof syncWeeklyAiSentences, 'function');
  });
});
