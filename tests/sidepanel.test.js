import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('1. Native Split View DOM Structure & CSP MV3 Compliance', () => {
  const htmlPath = path.join(rootDir, 'sidepanel', 'sidepanel.html');

  test('sidepanel.html exists and enforces strict CSP MV3 compliance', () => {
    assert.ok(fs.existsSync(htmlPath), 'sidepanel.html must exist');
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Rule 1: Zero inline scripts
    const inlineScriptMatch = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi);
    assert.strictEqual(inlineScriptMatch, null, 'Must NOT contain inline <script> tags without src');

    // Rule 2: Zero inline event handlers (onclick, onchange, onload, etc.)
    const inlineEventMatches = html.match(/\son[a-z]+\s*=\s*["'][^"']*["']/gi);
    assert.strictEqual(inlineEventMatches, null, 'Must NOT contain inline on* event attributes');

    // Rule 3: Valid module script linking
    assert.match(html, /<script\s+type="module"\s+src="sidepanel\.js">/i);
    // Rule 4: Valid stylesheet linking
    assert.match(html, /<link\s+rel="stylesheet"\s+href="sidepanel\.css">/i);
  });

  test('sidepanel.html exposes all required interactive DOM elements', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');

    const expectedElements = [
      // Banner & Alarm controls
      'alarm-banner',
      'btn-snooze-15',
      'btn-dismiss-banner',
      // Header & Progress
      'streak-count',
      'daily-progress-text',
      'daily-progress-bar',
      // Schedule Settings & Test Trigger
      'schedule-details',
      'schedule-time-input',
      'schedule-enabled-toggle',
      'btn-save-schedule',
      'btn-trigger-split',
      'btn-snooze-header',
      'next-alarm-display',
      // Category filter tabs
      'category-tabs',
      // Hero Sentence Card
      'hero-sentence-card',
      'sentence-topic-badge',
      'sentence-level-badge',
      'sentence-mastered-indicator',
      'sentence-english',
      'sentence-ipa',
      'sentence-stress',
      'sentence-instead-of',
      'btn-tts-normal',
      'btn-tts-slow',
      'audio-wave',
      // Explanation & Nuance
      'card-vietnamese',
      'card-nuance',
      // Real Dialogue A-B
      'card-dialogue',
      'dialogue-scenario',
      'dialogue-speaker-a',
      'dialogue-speaker-b',
      // Key Chunks & Alternatives
      'card-key-chunks',
      'card-alternatives',
      'alt-casual-text',
      'alt-formal-text',
      // Pro Tip
      'card-pro-tip',
      'pro-tip-text',
      // Navigation
      'btn-prev',
      'btn-mark-mastered',
      'btn-next',
      'current-index-display',
      // Confetti celebration
      'confetti-canvas'
    ];

    for (const id of expectedElements) {
      assert.ok(
        html.includes(`id="${id}"`),
        `Missing DOM element with id="${id}" in sidepanel.html`
      );
    }
  });
});

describe('2. CSS Responsive Split-View (360px-480px, No Horizontal Overflow)', () => {
  const cssPath = path.join(rootDir, 'sidepanel', 'sidepanel.css');
  const htmlPath = path.join(rootDir, 'sidepanel', 'sidepanel.html');

  test('sidepanel.css enforces zero horizontal overflow rules and mobile-safe width', () => {
    assert.ok(fs.existsSync(cssPath), 'sidepanel.css must exist');
    const css = fs.readFileSync(cssPath, 'utf8');

    // Rule 1: Box-sizing border-box reset on all elements
    assert.match(css, /\*,\s*\*::before,\s*\*::after\s*\{[\s\S]*box-sizing:\s*border-box;/i);

    // Rule 2: Overflow-x hidden on root and containers
    assert.match(css, /overflow-x:\s*hidden/i);

    // Rule 3: Max width 480px for Split View
    assert.match(css, /max-width:\s*480px/i);

    // Rule 4: Word break break-word on long technical terms and sentences
    assert.match(css, /word-break:\s*break-word/i);

    // Rule 5: Flex text containers have min-width: 0 to prevent flex expansion overflow
    assert.match(css, /min-width:\s*0/i);

    // Rule 6: Action icons and buttons have flex-shrink: 0
    assert.match(css, /flex-shrink:\s*0/i);
  });

  test('sidepanel.html contains zero hardcoded wide inline dimensions', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');
    // Ensure no inline style with width > 480px
    const wideWidthMatch = html.match(/style=["'][^"']*width:\s*([5-9]\d{2}|\d{4,})px/i);
    assert.strictEqual(wideWidthMatch, null, 'No element may have hardcoded width > 480px');
  });

  test('sidepanel.css includes TTS audio wave visualizer animations', () => {
    const css = fs.readFileSync(cssPath, 'utf8');
    assert.match(css, /\.audio-wave/i);
    assert.match(css, /@keyframes\s+soundBars/i);
    assert.match(css, /\.is-playing/i);
  });
});

describe('3. Curated IT Sentences Dataset (`data/sentences.js`) Compatibility', () => {
  const dataPath = path.join(rootDir, 'data', 'sentences.js');

  test('sentences dataset exports CATEGORIES and IT_SENTENCES with minimum 15 items across 5 core topics', async () => {
    assert.ok(fs.existsSync(dataPath), 'data/sentences.js must exist');
    const { CATEGORIES, IT_SENTENCES } = await import(`file://${dataPath}`);

    assert.ok(Array.isArray(CATEGORIES), 'CATEGORIES must be an array');
    assert.ok(CATEGORIES.length >= 6, 'Must have at least 6 category definitions (all + 5 topics)');

    assert.ok(Array.isArray(IT_SENTENCES), 'IT_SENTENCES must be an array');
    assert.ok(IT_SENTENCES.length >= 15, `Expected >= 15 sentences, got ${IT_SENTENCES.length}`);

    // Every item must conform strictly to the required schema
    for (const s of IT_SENTENCES) {
      assert.ok(typeof s.id === 'string' && s.id.length > 0, 'Sentence id must be non-empty string');
      assert.ok(typeof s.category === 'string', `Sentence ${s.id} category must be string`);
      assert.ok(typeof (s.english || s.sentence) === 'string', `Sentence ${s.id} must have english/sentence text`);
      assert.ok(typeof s.ipa === 'string' && s.ipa.startsWith('/'), `Sentence ${s.id} ipa must be phonetic transcription`);
      assert.ok(typeof (s.vietnamese || s.meaningVi) === 'string', `Sentence ${s.id} must have vietnamese text`);
      assert.ok(typeof s.stressGuide === 'string', `Sentence ${s.id} must have stressGuide`);
      assert.ok(typeof s.insteadOf === 'string', `Sentence ${s.id} must have insteadOf`);
      assert.ok(typeof (s.nuanceVi || s.nuance) === 'string', `Sentence ${s.id} must have nuance`);
      assert.ok(s.dialogue, `Sentence ${s.id} must have dialogue`);
      assert.ok(Array.isArray(s.keyChunks || s.keyPhrases), `Sentence ${s.id} must have keyChunks/keyPhrases`);
      assert.ok(s.alternatives, `Sentence ${s.id} must have alternatives`);
      assert.ok(typeof (s.interviewTip || s.proTip) === 'string', `Sentence ${s.id} must have proTip/interviewTip`);
    }
  });
});

describe('4. Sidepanel Controller Logic & State Persistence', () => {
  const jsPath = path.join(rootDir, 'sidepanel', 'sidepanel.js');

  test('createInitialState initializes standard schedule and progress defaults', async () => {
    const { createInitialState } = await import(`file://${jsPath}`);
    const state = createInitialState();

    assert.strictEqual(state.schedule.enabled, true);
    assert.strictEqual(state.schedule.time, '19:00');
    assert.strictEqual(state.schedule.autoSplitScreen, true);
    assert.strictEqual(state.progress.dailyGoal, 5);
    assert.strictEqual(state.progress.streakDays, 0);
    assert.deepStrictEqual(state.progress.learnedIds, []);
    assert.deepStrictEqual(state.progress.todayLearnedIds, []);
  });

  test('filterSentences filters accurately by category or alias', async () => {
    const { filterSentences } = await import(`file://${jsPath}`);
    const { IT_SENTENCES } = await import(`file://${path.join(rootDir, 'data', 'sentences.js')}`);

    const all = filterSentences(IT_SENTENCES, 'all');
    assert.strictEqual(all.length, IT_SENTENCES.length);

    const arch = filterSentences(IT_SENTENCES, 'architecture');
    assert.ok(arch.length >= 2);
    assert.ok(arch.every(s => s.category === 'architecture'));

    // Alias checking
    const standup = filterSentences(IT_SENTENCES, 'standup');
    assert.ok(standup.length >= 2);

    const standupAlias = filterSentences(IT_SENTENCES, 'daily-standup');
    assert.strictEqual(standupAlias.length, standup.length);
  });

  test('markSentenceLearned handles streak progression correctly', async () => {
    const { markSentenceLearned, createInitialState } = await import(`file://${jsPath}`);
    let state = createInitialState();

    state = markSentenceLearned(state, 'standup-01', '2026-11-08');
    assert.strictEqual(state.progress.streakDays, 1);
    assert.strictEqual(state.progress.lastStudyDate, '2026-11-08');

    state = markSentenceLearned(state, 'standup-02', '2026-11-08');
    assert.strictEqual(state.progress.streakDays, 1);
    assert.strictEqual(state.progress.todayLearnedIds.length, 2);
  });

  test('speakSentence handles 1.0x and 0.8x speech rates without crashing in non-browser environment', async () => {
    const { speakSentence } = await import(`file://${jsPath}`);
    const result = speakSentence('I am currently blocked on Stripe webhook.', 0.8);
    assert.strictEqual(typeof result, 'boolean');
  });

  test('requestServiceWorker handles fallback when chrome.runtime is not available', async () => {
    const { requestServiceWorker } = await import(`file://${jsPath}`);

    const res = await requestServiceWorker({ type: 'GET_STATE' });
    assert.ok(res.ok);
    assert.ok(res.state);
    assert.strictEqual(res.state.schedule.time, '19:00');

    const updateRes = await requestServiceWorker({
      type: 'UPDATE_SCHEDULE',
      payload: { time: '20:30', enabled: false }
    });
    assert.ok(updateRes.ok);
    assert.strictEqual(updateRes.state.schedule.time, '20:30');
    assert.strictEqual(updateRes.state.schedule.enabled, false);

    const alarmRes = await requestServiceWorker({
      type: 'TRIGGER_ALARM_NOW',
      payload: { forceSplit: true }
    });
    assert.ok(alarmRes.ok);
    assert.strictEqual(alarmRes.state.alarmState.activeBanner, true);

    const snoozeRes = await requestServiceWorker({
      type: 'SNOOZE_ALARM',
      payload: { minutes: 15 }
    });
    assert.ok(snoozeRes.ok);
    assert.strictEqual(snoozeRes.state.alarmState.activeBanner, false);
    assert.ok(typeof snoozeRes.state.alarmState.snoozedUntil === 'number');
  });
});
