import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const spJs = path.join(rootDir, 'sidepanel', 'sidepanel.js');
const read = (...p) => fs.readFileSync(path.join(rootDir, ...p), 'utf8');

function mockChrome(sendMessage, store = {}) {
  globalThis.chrome = {
    runtime: { id: 'test-ext-id', sendMessage },
    storage: {
      local: {
        get: async (k) => ({ [k]: store[k] }),
        set: async (o) => { Object.assign(store, o); }
      }
    }
  };
}

describe('B4: SW error handling inside the extension', () => {
  test('returns ok:false from SW as-is, no standalone fallback, no state update', async () => {
    const { requestServiceWorker } = await import(`file://${spJs}`);
    const calls = [];
    mockChrome(async (m) => { calls.push(m); return { ok: false, error: 'Invalid time' }; });
    globalThis.window = { localStorage: { setItem() { throw new Error('fallback used'); }, getItem: () => null } };
    const res = await requestServiceWorker({ type: 'UPDATE_SCHEDULE', payload: { time: 'bad' } });
    assert.strictEqual(res.ok, false);
    assert.strictEqual(res.error, 'Invalid time');
    delete globalThis.window;
    delete globalThis.chrome;
  });

  test('schedule-save handler surfaces error in #schedule-status-msg', () => {
    const js = read('sidepanel', 'sidepanel.js');
    assert.match(js, /res\.ok\s*===\s*false|!res\.ok/);
    assert.match(js, /res\.error/);
  });
});

describe('B5: dev server hardening', () => {
  const src = read('scripts', 'serve.js');
  test('binds to 127.0.0.1, no CORS *, path containment', () => {
    assert.match(src, /listen\(PORT,\s*'127\.0\.0\.1'/);
    assert.doesNotMatch(src, /Access-Control-Allow-Origin/);
    assert.match(src, /rootDir \+ path\.sep/);
    assert.match(src, /decodeURIComponent/);
  });

  test('traversal returns 403', async () => {
    const child = spawn(process.execPath, [path.join(rootDir, 'scripts', 'serve.js')], { stdio: 'ignore' });
    try {
      for (let i = 0; i < 30; i++) {
        const ok = await new Promise((r) => { const s = net.connect(8765, '127.0.0.1', () => { s.destroy(); r(true); }); s.on('error', () => r(false)); });
        if (ok) break;
        await new Promise((r) => setTimeout(r, 100));
      }
      const status = await new Promise((resolve) => {
        const req = http.request({ host: '127.0.0.1', port: 8765, path: '/%2e%2e/%2e%2e/etc/hosts', method: 'GET' }, (r) => { r.resume(); resolve(r.statusCode); });
        req.end();
      });
      assert.strictEqual(status, 403);
    } finally {
      child.kill();
    }
  });
});

describe('B6: npm test runs all tests', () => {
  test('package.json test script is node --test tests/', () => {
    assert.strictEqual(JSON.parse(read('package.json')).scripts.test, 'node --test tests/');
  });
});

describe('B7a: selectedCategory persisted via SW (AC6)', () => {
  test('SW SELECT_CATEGORY saves and getState returns it', async () => {
    const store = {};
    mockChrome(async () => ({ ok: true }), store);
    const sw = await import(`file://${path.join(rootDir, 'background', 'service-worker.js')}`);
    const res = await sw.handleRuntimeMessage({ type: 'SELECT_CATEGORY', payload: { categoryId: 'architecture' } });
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.state.selectedCategory, 'architecture');
    assert.strictEqual(store.itEnglishState.selectedCategory, 'architecture');
    assert.strictEqual((await sw.getState()).selectedCategory, 'architecture');
    const bad = await sw.handleRuntimeMessage({ type: 'SELECT_CATEGORY', payload: {} });
    assert.strictEqual(bad.ok, false);
    delete globalThis.chrome;
  });

  test('panel sends SELECT_CATEGORY on tab click and restores on init', () => {
    const js = read('sidepanel', 'sidepanel.js');
    assert.match(js, /type:\s*'SELECT_CATEGORY'/);
    assert.match(js, /this\.activeCategory\s*=\s*this\.state\.selectedCategory/);
  });
});

describe('B8: key chunks + intonation rendering', () => {
  test('placeholder removed; chunk/meaning and intonation rendered', () => {
    const js = read('sidepanel', 'sidepanel.js');
    assert.doesNotMatch(js, /Cụm từ then chốt thường dùng/);
    assert.match(js, /item\.chunk/);
    assert.match(js, /item\.meaning/);
    assert.match(js, /sentence-intonation/);
    assert.match(read('sidepanel', 'sidepanel.html'), /id="sentence-intonation"/);
  });
});
