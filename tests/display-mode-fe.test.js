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
});
