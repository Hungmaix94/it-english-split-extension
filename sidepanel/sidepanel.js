/**
 * IT English Daily Split-View - Sidepanel Controller
 * Manifest V3 strictly compliant (ES Module, zero inline scripts).
 * Features standalone fallback for Playwright / independent browser testing.
 */

import { CATEGORIES, IT_SENTENCES } from '../data/sentences.js';

// ============================================================================
// State Utilities & Helpers (Pure Functions for Testability)
// ============================================================================

export function getLocalToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLocalYesterday() {
  const yesterday = new Date(Date.now() - 86400000);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createInitialState() {
  return {
    schedule: {
      enabled: true,
      morningTime: '09:00',
      time: '19:00',
      autoSplitScreen: true,
      displayMode: 'split',
      splitRatio: 0.55
    },
    progress: {
      learnedIds: [],
      todayLearnedIds: [],
      todayDate: getLocalToday(),
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
    }
  };
}

const CATEGORY_ALIASES = {
  'daily-standup': 'standup',
  'dailystandup': 'standup',
  'standup': 'standup',
  'code-review': 'codereview',
  'code-review-pr': 'codereview',
  'codereview': 'codereview',
  'tech-architecture': 'architecture',
  'architecture': 'architecture',
  'incident-debugging': 'incident',
  'incident': 'incident',
  'it-job-interview': 'interview',
  'interview': 'interview'
};

/**
 * Filter sentences supporting both standard category ids and legacy/slug aliases
 */
export function filterSentences(sentences = IT_SENTENCES, categoryId = 'all') {
  if (!categoryId || categoryId === 'all') {
    // Prioritize IT Interview dialogues first when viewing 'all'
    return [...sentences].sort((a, b) => {
      const aInt = a.category === 'interview' ? 0 : 1;
      const bInt = b.category === 'interview' ? 0 : 1;
      return aInt - bInt;
    });
  }
  const targetCategory = CATEGORY_ALIASES[categoryId] || categoryId;
  const normalizedTarget = String(targetCategory).toLowerCase().replace(/[^a-z]/g, '');

  return sentences.filter((s) => {
    const sCat = s.category || '';
    const mappedSCat = CATEGORY_ALIASES[sCat] || sCat;
    const normalizedSCat = String(mappedSCat).toLowerCase().replace(/[^a-z]/g, '');

    return (
      sCat === categoryId ||
      sCat === targetCategory ||
      mappedSCat === targetCategory ||
      normalizedSCat === normalizedTarget
    );
  });
}

export function markSentenceLearned(state, sentenceId, customToday = null) {
  if (!sentenceId) return state;

  const today = customToday || getLocalToday();
  const yesterday = getLocalYesterday();

  const currentLearned = new Set(state.progress.learnedIds || []);
  const currentTodayLearned = new Set(state.progress.todayLearnedIds || []);

  currentLearned.add(sentenceId);
  currentTodayLearned.add(sentenceId);

  let newStreak = state.progress.streakDays || 0;
  const lastStudy = state.progress.lastStudyDate;

  if (lastStudy !== today) {
    if (lastStudy === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  const updatedProgress = {
    ...state.progress,
    learnedIds: Array.from(currentLearned),
    todayLearnedIds: Array.from(currentTodayLearned),
    todayDate: today,
    streakDays: newStreak,
    lastStudyDate: today
  };

  const shouldDismissBanner = updatedProgress.todayLearnedIds.length >= (state.progress.dailyGoal || 5);

  return {
    ...state,
    progress: updatedProgress,
    alarmState: {
      ...state.alarmState,
      activeBanner: shouldDismissBanner ? false : state.alarmState.activeBanner
    }
  };
}

// ============================================================================
// Web Speech API Pronunciation (TTS)
// ============================================================================

export function speakSentence(text, rate = 1.0, onStart = null, onEnd = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterances

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = Number(rate) || 1.0;
    utterance.pitch = 1.0;

    // Pick a natural US or UK voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const naturalVoice = voices.find(
        (v) => (v.lang === 'en-US' || v.lang.startsWith('en')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri'))
      ) || voices.find((v) => v.lang === 'en-US' || v.lang.startsWith('en'));

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }
    }

    if (typeof onStart === 'function') {
      utterance.onstart = onStart;
    }
    if (typeof onEnd === 'function') {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('[TTS] Failed to play utterance:', err);
    if (typeof onEnd === 'function') onEnd();
    return false;
  }
}

// ============================================================================
// Runtime & Storage Bridge (with Standalone Fallback)
// ============================================================================

function getStorageItem(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // fallback
  }
  return null;
}

function setStorageItem(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // fallback
  }
}

export async function requestServiceWorker(message) {
  if (
    typeof chrome !== 'undefined' &&
    chrome.runtime?.id &&
    typeof chrome.runtime.sendMessage === 'function'
  ) {
    // Inside the extension the SW is the single source of truth: no local fallback.
    try {
      const response = await chrome.runtime.sendMessage(message);
      return response || { ok: false, error: 'No response from service worker' };
    } catch (err) {
      return { ok: false, error: err?.message || 'Service worker unavailable' };
    }
  }

  // Standalone / Playwright Fallback
  return handleStandaloneMessage(message);
}

function handleStandaloneMessage(message) {
  const raw = getStorageItem('itEnglishState');
  let state = raw ? JSON.parse(raw) : createInitialState();

  const { type, payload } = message || {};

  switch (type) {
    case 'GET_STATE': {
      return { ok: true, state };
    }
    case 'TRIGGER_ALARM_NOW': {
      state.alarmState.lastTriggeredAt = Date.now();
      state.alarmState.activeBanner = true;
      setStorageItem('itEnglishState', JSON.stringify(state));
      return { ok: true, state, data: { manualTriggered: true } };
    }
    case 'SNOOZE_ALARM': {
      const mins = payload?.minutes || 15;
      state.alarmState.snoozedUntil = Date.now() + mins * 60000;
      state.alarmState.activeBanner = false;
      setStorageItem('itEnglishState', JSON.stringify(state));
      return { ok: true, state, data: { snoozedUntil: state.alarmState.snoozedUntil } };
    }
    case 'UPDATE_SCHEDULE': {
      state.schedule = { ...state.schedule, ...payload };
      setStorageItem('itEnglishState', JSON.stringify(state));
      return { ok: true, state };
    }
    case 'MARK_LEARNED': {
      state = markSentenceLearned(state, payload?.sentenceId);
      setStorageItem('itEnglishState', JSON.stringify(state));
      return { ok: true, state };
    }
    case 'SYNC_AI_SENTENCES': {
      return syncStandaloneAiSentences(state);
    }
    default:
      return { ok: true, state };
  }
}

export const WEEKLY_AI_FEED_URL =
  'https://pub-dd118e9f58254711a5ec2f75e6bf0530.r2.dev/it-english/weekly-sentences.json';

async function syncStandaloneAiSentences(state) {
  if (typeof fetch !== 'function') {
    return { ok: false, error: 'fetch unavailable', state };
  }
  try {
    const resp = await fetch(`${WEEKLY_AI_FEED_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!resp.ok) {
      return { ok: false, error: `HTTP ${resp.status}`, state };
    }
    const data = await resp.json();
    const list = Array.isArray(data?.sentences) ? data.sentences : [];
    if (list.length === 0) {
      return { ok: false, error: 'Empty AI sentence pack', state };
    }
    state.aiSync = {
      weekLabel: data.weekLabel || 'AI-Weekly',
      lastSyncedAt: Date.now(),
      sentences: list
    };
    setStorageItem('itEnglishState', JSON.stringify(state));
    return { ok: true, state, data: state.aiSync };
  } catch (err) {
    return { ok: false, error: err?.message || 'Failed to fetch weekly AI feed', state };
  }
}

// ============================================================================
// Sidepanel UI Controller Class
// ============================================================================

function preventOrphanWord(str) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().replace(/\s+(\S+)\s+(\S+)$/, '\u00A0$1\u00A0$2');
}

function parseDialogueTurns(sentence) {
  if (sentence.dialogue && typeof sentence.dialogue === 'object' && sentence.dialogue.speakerA) {
    return {
      roleA: sentence.dialogue.speakerA.role || 'Interviewer',
      lineA: sentence.dialogue.speakerA.line || '',
      roleB: sentence.dialogue.speakerB?.role || 'You (Candidate)',
      lineB: sentence.dialogue.speakerB?.line || sentence.english || sentence.sentence || ''
    };
  }
  const raw = String(sentence.dialogue || '');
  const parts = raw.split(/\s+-\s+/);
  const parseTurn = (seg, fallbackRole, fallbackLine) => {
    if (!seg) return { role: fallbackRole, line: fallbackLine };
    const m = seg.match(/^([^:]+):\s*['"]?([\s\S]*?)['"]?$/);
    if (m) {
      return { role: m[1].trim(), line: m[2].replace(/^['"]|['"]$/g, '').trim() };
    }
    return { role: fallbackRole, line: seg.replace(/^['"]|['"]$/g, '').trim() };
  };
  const first = parseTurn(parts[0], 'Interviewer', 'Can you walk me through your approach?');
  const second = parseTurn(parts[1], 'You (Candidate)', sentence.english || sentence.sentence || '');
  // If first speaker is Dev/Author, swap or keep natural Q -> A flow
  if (/^dev|^candidate/i.test(first.role) && parts[1]) {
    return {
      roleA: second.role,
      lineA: second.line,
      roleB: first.role,
      lineB: first.line
    };
  }
  return {
    roleA: first.role,
    lineA: first.line,
    roleB: second.role,
    lineB: second.line
  };
}

function buildSceneIllustrationSvg(sentence) {
  const id = sentence.id || '';
  const cat = sentence.category || 'interview';

  // 1. Interview 01: Database Sharding & p99 Latency (-40%)
  if (id === 'interview-01') {
    return `<svg viewBox="0 0 380 116" fill="none" xmlns="http://www.w3.org/2000/svg" class="scene-svg">
      <rect width="380" height="116" rx="14" fill="url(#bg1)"/>
      <!-- Interviewer & Candidate Avatars -->
      <g transform="translate(16, 18)">
        <circle cx="22" cy="22" r="18" fill="#1E293B" stroke="#67E8F9" stroke-width="1.5"/>
        <circle cx="22" cy="17" r="6" fill="#67E8F9"/>
        <path d="M12 32c2-5 18-5 20 0" stroke="#67E8F9" stroke-width="2" stroke-linecap="round"/>
        <text x="22" y="54" fill="#94A3B8" font-size="9" font-weight="600" text-anchor="middle">INTERVIEWER</text>
        <path d="M46 20h18" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3 3"/>
      </g>
      <!-- System Design Board: DB Shards + p99 Latency Drop -->
      <g transform="translate(88, 12)">
        <rect width="198" height="92" rx="10" fill="#0B1325" fill-opacity="0.85" stroke="#334155"/>
        <text x="12" y="18" fill="#7DD3FC" font-size="9.5" font-weight="700" font-family="monospace">DB SHARDING · BLACK FRIDAY</text>
        <rect x="12" y="28" width="52" height="24" rx="5" fill="#1E293B" stroke="#38BDF8" stroke-width="1.2"/>
        <text x="38" y="43" fill="#E2E8F0" font-size="8.5" font-weight="700" text-anchor="middle">Shard 01</text>
        <rect x="72" y="28" width="52" height="24" rx="5" fill="#1E293B" stroke="#38BDF8" stroke-width="1.2"/>
        <text x="98" y="43" fill="#E2E8F0" font-size="8.5" font-weight="700" text-anchor="middle">Shard 02</text>
        <rect x="132" y="28" width="52" height="24" rx="5" fill="#1E293B" stroke="#38BDF8" stroke-width="1.2"/>
        <text x="158" y="43" fill="#E2E8F0" font-size="8.5" font-weight="700" text-anchor="middle">Shard 03</text>
        <!-- Latency Trend Line -->
        <path d="M14 78 L55 76 L95 62 L145 60" stroke="#34D399" stroke-width="2.2" stroke-linecap="round"/>
        <rect x="122" y="62" width="64" height="20" rx="10" fill="#064E3B" stroke="#34D399"/>
        <text x="154" y="75" fill="#6EE7B7" font-size="9" font-weight="700" text-anchor="middle">p99 -40% ↓</text>
      </g>
      <!-- Candidate Avatar -->
      <g transform="translate(306, 18)">
        <circle cx="28" cy="22" r="18" fill="#1E293B" stroke="#FBBF24" stroke-width="1.5"/>
        <circle cx="28" cy="17" r="6" fill="#FBBF24"/>
        <path d="M18 32c2-5 18-5 20 0" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/>
        <text x="28" y="54" fill="#FDE68A" font-size="9" font-weight="700" text-anchor="middle">YOU (STAR)</text>
      </g>
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="380" y2="116" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0F172A" stop-opacity="0.9"/>
          <stop offset="1" stop-color="#1E1B4B" stop-opacity="0.6"/>
        </linearGradient>
      </defs>
    </svg>`;
  }

  // 2. Interview 02: High Availability & Circuit Breaker
  if (id === 'interview-02') {
    return `<svg viewBox="0 0 380 116" fill="none" xmlns="http://www.w3.org/2000/svg" class="scene-svg">
      <rect width="380" height="116" rx="14" fill="#0D1527"/>
      <text x="18" y="22" fill="#7DD3FC" font-size="9.5" font-weight="700" font-family="monospace">HIGH AVAILABILITY · CIRCUIT BREAKER FAILOVER</text>
      <!-- Node 1: Gateway -->
      <rect x="18" y="36" width="84" height="44" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.4"/>
      <text x="60" y="55" fill="#F8FAFC" font-size="9.5" font-weight="700" text-anchor="middle">API Gateway</text>
      <text x="60" y="69" fill="#94A3B8" font-size="8" text-anchor="middle">Zero SPOF</text>
      <path d="M104 58h30" stroke="#38BDF8" stroke-width="2"/>
      <!-- Node 2: Circuit Breaker -->
      <rect x="136" y="34" width="106" height="48" rx="9" fill="#1E1B4B" stroke="#FBBF24" stroke-width="1.5"/>
      <text x="189" y="54" fill="#FDE68A" font-size="9.5" font-weight="700" text-anchor="middle">Circuit Breaker</text>
      <text x="189" y="69" fill="#FBBF24" font-size="8" font-family="monospace" text-anchor="middle">Auto-Failover ⚡</text>
      <path d="M244 58h28" stroke="#34D399" stroke-width="2"/>
      <!-- Node 3: Healthy Replica -->
      <rect x="274" y="36" width="88" height="44" rx="8" fill="#064E3B" stroke="#34D399" stroke-width="1.4"/>
      <text x="318" y="55" fill="#ECFDF5" font-size="9.5" font-weight="700" text-anchor="middle">Replica Node</text>
      <text x="318" y="69" fill="#6EE7B7" font-size="8.5" font-weight="700" text-anchor="middle">99.99% UP ✓</text>
      <text x="190" y="102" fill="#94A3B8" font-size="9" text-anchor="middle">Preventing cascading failures across distributed services</text>
    </svg>`;
  }

  // 3. Interview 03: Conflict Resolution via Empirical PoC Benchmark
  if (id === 'interview-03') {
    return `<svg viewBox="0 0 380 116" fill="none" xmlns="http://www.w3.org/2000/svg" class="scene-svg">
      <rect width="380" height="116" rx="14" fill="#0D1527"/>
      <text x="18" y="22" fill="#A5B4FC" font-size="9.5" font-weight="700" font-family="monospace">TECH CONFLICT RESOLUTION · POC BENCHMARK</text>
      <!-- Bar A -->
      <text x="20" y="48" fill="#E2E8F0" font-size="9.5" font-weight="600">Option A (PoC)</text>
      <rect x="110" y="36" width="110" height="16" rx="4" fill="#34D399"/>
      <text x="228" y="48" fill="#6EE7B7" font-size="9.5" font-weight="700" font-family="monospace">12ms · Winner ✓</text>
      <!-- Bar B -->
      <text x="20" y="74" fill="#94A3B8" font-size="9.5" font-weight="600">Option B (PoC)</text>
      <rect x="110" y="62" width="195" height="16" rx="4" fill="#475569"/>
      <text x="312" y="74" fill="#94A3B8" font-size="9.5" font-family="monospace">48ms</text>
      <!-- Footer badge -->
      <rect x="18" y="88" width="344" height="18" rx="5" fill="#1E293B"/>
      <text x="190" y="100" fill="#7DD3FC" font-size="8.8" font-weight="600" text-anchor="middle">Empirical data &amp; objective metrics guide team decisions</text>
    </svg>`;
  }

  // 4. Interview 04 / Architecture: Read-to-Write Ratio & SLA
  if (id === 'interview-04' || cat === 'architecture') {
    return `<svg viewBox="0 0 380 116" fill="none" xmlns="http://www.w3.org/2000/svg" class="scene-svg">
      <rect width="380" height="116" rx="14" fill="#0D1527"/>
      <text x="18" y="22" fill="#7DD3FC" font-size="9.5" font-weight="700" font-family="monospace">SYSTEM DESIGN · CLARIFYING SLA &amp; WORKLOAD</text>
      <rect x="18" y="34" width="106" height="64" rx="8" fill="#1E293B" stroke="#38BDF8"/>
      <text x="71" y="54" fill="#94A3B8" font-size="8.5" text-anchor="middle">READ : WRITE</text>
      <text x="71" y="76" fill="#38BDF8" font-size="16" font-weight="800" font-family="monospace" text-anchor="middle">100 : 1</text>
      <rect x="136" y="34" width="108" height="64" rx="8" fill="#1E293B" stroke="#34D399"/>
      <text x="190" y="54" fill="#94A3B8" font-size="8.5" text-anchor="middle">LATENCY SLA</text>
      <text x="190" y="76" fill="#34D399" font-size="15" font-weight="800" font-family="monospace" text-anchor="middle">p99 &lt; 10ms</text>
      <rect x="256" y="34" width="106" height="64" rx="8" fill="#1E293B" stroke="#FBBF24"/>
      <text x="309" y="54" fill="#94A3B8" font-size="8.5" text-anchor="middle">STORAGE ENGINE</text>
      <text x="309" y="75" fill="#FDE68A" font-size="11.5" font-weight="700" text-anchor="middle">Redis + Read</text>
      <text x="309" y="89" fill="#FDE68A" font-size="10" font-weight="600" text-anchor="middle">Replicas</text>
    </svg>`;
  }

  // 5. Code Review & PR
  if (cat === 'codereview') {
    return `<svg viewBox="0 0 380 116" fill="none" xmlns="http://www.w3.org/2000/svg" class="scene-svg">
      <rect width="380" height="116" rx="14" fill="#0D1527"/>
      <text x="18" y="22" fill="#A5B4FC" font-size="9.5" font-weight="700" font-family="monospace">PULL REQUEST REVIEW · CLEAN ARCHITECTURE</text>
      <rect x="18" y="34" width="154" height="66" rx="8" fill="#1E293B" stroke="#FB7185"/>
      <text x="30" y="52" fill="#FDA4AF" font-size="9" font-family="monospace">- Fat Controller</text>
      <text x="30" y="68" fill="#94A3B8" font-size="8.5" font-family="monospace">- Duplicated checks</text>
      <text x="30" y="84" fill="#94A3B8" font-size="8.5" font-family="monospace">- N+1 / Race risk</text>
      <path d="M180 67h22" stroke="#38BDF8" stroke-width="2"/>
      <rect x="208" y="34" width="154" height="66" rx="8" fill="#064E3B" stroke="#34D399"/>
      <text x="220" y="52" fill="#6EE7B7" font-size="9" font-family="monospace">+ Reusable Middleware</text>
      <text x="220" y="68" fill="#ECFDF5" font-size="8.5" font-family="monospace">+ Thin Controller ✓</text>
      <text x="220" y="84" fill="#6EE7B7" font-size="8.5" font-family="monospace">+ Constructive PR Review</text>
    </svg>`;
  }

  // 6. Standup & Incident Default Scene
  return `<svg viewBox="0 0 380 116" fill="none" xmlns="http://www.w3.org/2000/svg" class="scene-svg">
    <rect width="380" height="116" rx="14" fill="#0D1527"/>
    <text x="18" y="22" fill="#7DD3FC" font-size="9.5" font-weight="700" font-family="monospace">AGILE ENGINEERING SYNC · PROACTIVE OWNERSHIP</text>
    <rect x="18" y="34" width="150" height="66" rx="8" fill="#1E293B" stroke="#FB7185"/>
    <text x="93" y="56" fill="#FDA4AF" font-size="9.5" font-weight="700" text-anchor="middle">⚠️ Upstream Blocker</text>
    <text x="93" y="74" fill="#CBD5E1" font-size="8.5" text-anchor="middle">Auth API / Production Issue</text>
    <path d="M176 67h26" stroke="#FBBF24" stroke-width="2"/>
    <rect x="210" y="34" width="152" height="66" rx="8" fill="#064E3B" stroke="#34D399"/>
    <text x="286" y="56" fill="#6EE7B7" font-size="9.5" font-weight="700" text-anchor="middle">✓ Proactive Pivot</text>
    <text x="286" y="74" fill="#ECFDF5" font-size="8.5" text-anchor="middle">Unblocked &amp; Delivering Value</text>
  </svg>`;
}

function buildRolePresetAnswer(sentence, preset) {
  const base = sentence.english || sentence.sentence || '';
  const candidate = sentence.presets && sentence.presets[preset];
  if (typeof candidate === 'string' && candidate.length > 25 && !/^n\/a$/i.test(candidate.trim())) {
    return candidate;
  }
  const alts = Array.isArray(sentence.alternatives) ? sentence.alternatives : [];
  if ((preset === 'backend' || preset === 'mobile') && alts[0]) return alts[0];
  if ((preset === 'frontend' || preset === 'fullstack') && alts[1]) return alts[1];
  return base;
}

function getScenePhotoForSentence(sentence) {
  if (sentence && sentence.scenePhoto) return sentence.scenePhoto;
  const cat = (sentence && sentence.category) || 'interview';
  if (cat === 'architecture') return '../assets/photo-architecture.jpg';
  if (cat === 'codereview' || cat === 'standup' || cat === 'incident') {
    return '../assets/photo-teamwork.jpg';
  }
  return '../assets/photo-interview.jpg';
}

export class SidepanelController {
  constructor() {
    this.state = createInitialState();
    this.activeCategory = 'all';
    this.currentIndex = 0;
    this.customAnswers = this.loadCustomAnswers();
    this.customQuestions = this.loadCustomQuestions();
    this.customCards = this.loadCustomCards();
    this.currentList = [...this.customCards, ...IT_SENTENCES];
    this.isPlayingAudio = false;
  }

  loadCustomAnswers() {
    try {
      const raw = getStorageItem('itEnglishCustomAnswers');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  saveCustomAnswers() {
    setStorageItem('itEnglishCustomAnswers', JSON.stringify(this.customAnswers || {}));
  }

  loadCustomQuestions() {
    try {
      const raw = getStorageItem('itEnglishCustomQuestions');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  saveCustomQuestions() {
    setStorageItem('itEnglishCustomQuestions', JSON.stringify(this.customQuestions || {}));
  }

  loadCustomCards() {
    try {
      const raw = getStorageItem('itEnglishCustomCards');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveCustomCards() {
    setStorageItem('itEnglishCustomCards', JSON.stringify(this.customCards || []));
  }

  getAllSentences() {
    const aiList = Array.isArray(this.state?.aiSync?.sentences) ? this.state.aiSync.sentences : [];
    const merged = [...(this.customCards || []), ...aiList, ...IT_SENTENCES];
    const seen = new Set();
    return merged.filter((item) => {
      if (!item || !item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  getEffectiveQuestion(sentence, defaultLineA = '') {
    if (!sentence) return defaultLineA;
    return (this.customQuestions && this.customQuestions[sentence.id]) || defaultLineA;
  }

  getEffectiveAnswer(sentence) {
    if (!sentence) return '';
    return (this.customAnswers && this.customAnswers[sentence.id]) || sentence.english || sentence.sentence || '';
  }

  async init() {
    // 1. Load initial state
    const res = await requestServiceWorker({ type: 'GET_STATE' });
    if (res && res.state) {
      this.state = res.state;
    }

    // Check URL parameters (e.g. ?mode=split&alarm=1900)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('alarm') === '1900') {
        this.state.alarmState.activeBanner = true;
      }
    }

    if (this.state.selectedCategory) {
      this.activeCategory = this.state.selectedCategory;
    }

    // 2. Render Categories
    this.renderCategories();

    // 3. Setup Listeners
    this.setupEventListeners();

    // 4. Listen for Service Worker Broadcasts
    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener((message) => {
        if (message?.type === 'STATE_UPDATED' && message.state) {
          this.state = message.state;
          this.renderHeader();
          this.renderCurrentSentence();
        }
      });
    }

    // 5. Initial Render
    this.updateFilteredList();
    this.renderHeader();
    this.renderCurrentSentence();

    // 6. Auto-sync weekly AI sentences from Cloudflare R2 if stale (>7 days) or empty
    const lastSync = Number(this.state?.aiSync?.lastSyncedAt) || 0;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (!lastSync || Date.now() - lastSync > sevenDaysMs) {
      this.syncAiSentences({ silent: true });
    }
  }

  async syncAiSentences({ silent = false } = {}) {
    const btnSyncAi = document.getElementById('btn-sync-ai');
    if (btnSyncAi) btnSyncAi.classList.add('is-syncing');
    try {
      const res = await requestServiceWorker({ type: 'SYNC_AI_SENTENCES' });
      if (res && res.ok && res.state) {
        this.state = res.state;
        this.updateFilteredList();
        if (!silent) {
          this.currentIndex = 0;
        }
        this.renderCategories();
        this.renderHeader();
        this.renderCurrentSentence();
      }
      return res;
    } catch {
      return { ok: false };
    } finally {
      if (btnSyncAi) btnSyncAi.classList.remove('is-syncing');
    }
  }

  updateFilteredList() {
    this.currentList = filterSentences(this.getAllSentences(), this.activeCategory);
    if (this.currentIndex >= this.currentList.length) {
      this.currentIndex = 0;
    }
  }

  renderCategories() {
    const tabsContainer = document.getElementById('category-tabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';

    CATEGORIES.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `tab-btn ${cat.id === this.activeCategory ? 'active' : ''}`;
      btn.dataset.category = cat.id;

      const allItems = this.getAllSentences();
      const count = cat.id === 'all'
        ? allItems.length
        : filterSentences(allItems, cat.id).length;

      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(cat.id === this.activeCategory));
      [['tab-label', cat.label], ['tab-count', String(count)]].forEach(([cls, text]) => {
        const span = document.createElement('span');
        span.className = cls;
        span.textContent = text;
        btn.appendChild(span);
      });

      btn.addEventListener('click', () => {
        this.activeCategory = cat.id;
        this.currentIndex = 0;
        requestServiceWorker({ type: 'SELECT_CATEGORY', payload: { categoryId: cat.id } });
        this.updateCategoryTabsUI();
        this.updateFilteredList();
        this.renderCurrentSentence();
      });

      tabsContainer.appendChild(btn);
    });
  }

  updateCategoryTabsUI() {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach((btn) => {
      const isActive = btn.dataset.category === this.activeCategory;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });
  }

  renderHeader() {
    // 1. Streak count
    const streakEl = document.getElementById('streak-count');
    if (streakEl) {
      const days = this.state.progress.streakDays || 0;
      streakEl.textContent = `${days} ngày`;
    }

    // 2. Daily progress
    const progressTextEl = document.getElementById('daily-progress-text');
    const progressBarEl = document.getElementById('daily-progress-bar');
    const learnedToday = this.state.progress.todayLearnedIds || [];
    const dailyGoal = this.state.progress.dailyGoal || 5;

    if (progressTextEl) {
      progressTextEl.textContent = `${learnedToday.length} / ${dailyGoal} câu`;
    }
    if (progressBarEl) {
      const pct = Math.min(Math.round((learnedToday.length / dailyGoal) * 100), 100);
      progressBarEl.style.transform = `scaleX(${pct / 100})`;
      const track = progressBarEl.parentElement;
      if (track) track.setAttribute('aria-valuenow', String(Math.min(learnedToday.length, dailyGoal)));
    }

    // 3. Alarm banner visibility
    const bannerEl = document.getElementById('alarm-banner');
    if (bannerEl) {
      if (this.state.alarmState.activeBanner) {
        bannerEl.classList.remove('hidden');
      } else {
        bannerEl.classList.add('hidden');
      }
    }

    // 4. Schedule Drawer inputs (Morning 09:00 + Late Afternoon/Evening 19:00)
    const morningTimeInput = document.getElementById('schedule-morning-time-input');
    const timeInput = document.getElementById('schedule-time-input');
    const toggleInput = document.getElementById('schedule-enabled-toggle');
    const nextAlarmDisplay = document.getElementById('next-alarm-display');
    const modeInput = document.getElementById('schedule-display-mode');
    if (modeInput) {
      modeInput.value = this.state.schedule?.displayMode === 'sidePanel' ? 'sidePanel' : 'split';
    }

    if (morningTimeInput) {
      morningTimeInput.value = this.state.schedule?.morningTime || '09:00';
    }
    if (timeInput && this.state.schedule?.time) {
      timeInput.value = this.state.schedule.time;
    }
    if (toggleInput && this.state.schedule) {
      toggleInput.checked = Boolean(this.state.schedule.enabled);
    }
    if (nextAlarmDisplay) {
      const isEnabled = this.state.schedule?.enabled;
      const morningTime = this.state.schedule?.morningTime || '09:00';
      const scheduledTime = this.state.schedule?.time || '19:00';
      nextAlarmDisplay.textContent = isEnabled
        ? `Hẹn giờ: ${morningTime} & ${scheduledTime} hàng ngày`
        : 'Đã tạm tắt hẹn giờ';
    }
  }

  renderCurrentSentence() {
    if (!this.currentList || this.currentList.length === 0) return;

    const sentence = this.currentList[this.currentIndex];
    if (!sentence) return;

    // Badges & Scene Illustration
    const topicBadge = document.getElementById('sentence-topic-badge');
    const levelBadge = document.getElementById('sentence-level-badge');
    const masteredPill = document.getElementById('sentence-mastered-indicator');
    const illustrationEl = document.getElementById('scene-illustration');
    const illustrationImgEl = document.getElementById('scene-illustration-img');

    if (topicBadge) topicBadge.textContent = sentence.categoryLabel || 'IT Interview';
    if (levelBadge) levelBadge.textContent = sentence.difficulty || sentence.level || 'B2';
    if (illustrationImgEl) {
      illustrationImgEl.src = getScenePhotoForSentence(sentence);
      illustrationImgEl.alt = sentence.contextTitle || sentence.categoryLabel || 'Bối cảnh phỏng vấn IT thực tế';
    }
    if (illustrationEl) {
      illustrationEl.innerHTML = buildSceneIllustrationSvg(sentence);
    }

    const isMastered = this.state.progress.learnedIds?.includes(sentence.id);
    if (masteredPill) {
      if (isMastered) {
        masteredPill.classList.remove('hidden');
      } else {
        masteredPill.classList.add('hidden');
      }
    }

    // Parse 2-turn Interview / Workplace Dialogue & Apply Personalized Question + Answer
    const turns = parseDialogueTurns(sentence);
    const effectiveQuestion = this.getEffectiveQuestion(sentence, turns.lineA);
    const effectiveAnswer = this.getEffectiveAnswer(sentence);
    const hasCustom = Boolean(
      (this.customAnswers && this.customAnswers[sentence.id]) ||
      (this.customQuestions && this.customQuestions[sentence.id]) ||
      sentence.isCustomCard
    );

    const englishEl = document.getElementById('sentence-english');
    const ipaEl = document.getElementById('sentence-ipa');
    const personalizedBadge = document.getElementById('personalized-badge');
    const questionInputEl = document.getElementById('personalize-question-input');
    const textareaEl = document.getElementById('personalize-textarea');

    if (englishEl) englishEl.textContent = effectiveAnswer;
    if (ipaEl) ipaEl.textContent = sentence.ipa;
    if (personalizedBadge) personalizedBadge.hidden = !hasCustom;
    if (questionInputEl) questionInputEl.value = effectiveQuestion;
    if (textareaEl) textareaEl.value = effectiveAnswer;

    // Stress Guide & Instead Of
    const stressEl = document.getElementById('sentence-stress');
    const insteadEl = document.getElementById('sentence-instead-of');
    if (stressEl) stressEl.textContent = sentence.stressGuide || 'Nhấn trọng âm từ khóa';
    const intonationEl = document.getElementById('sentence-intonation');
    if (intonationEl) {
      intonationEl.textContent = sentence.intonation || '';
      intonationEl.hidden = !sentence.intonation;
    }
    if (insteadEl) insteadEl.textContent = sentence.insteadOf;

    // Meaning & Nuance
    const viEl = document.getElementById('card-vietnamese');
    const nuanceEl = document.getElementById('card-nuance');
    if (viEl) viEl.textContent = preventOrphanWord(sentence.vietnamese || sentence.meaningVi);
    if (nuanceEl) nuanceEl.textContent = preventOrphanWord(sentence.nuanceVi || sentence.nuance || 'Tự tin, chuyên nghiệp');

    // Dialogue Q & A rendered directly on the Main Hero Card
    const scenarioEl = document.getElementById('dialogue-scenario');
    const speakerALabel = document.getElementById('speaker-a-label');
    const speakerALine = document.getElementById('dialogue-speaker-a');
    const speakerBLabel = document.getElementById('speaker-b-label');
    const speakerBLine = document.getElementById('dialogue-speaker-b');

    if (scenarioEl) scenarioEl.textContent = preventOrphanWord(sentence.context || sentence.contextTitle || 'Tình huống Phỏng vấn IT');
    if (speakerALabel) speakerALabel.textContent = turns.roleA;
    if (speakerALine) speakerALine.textContent = `"${effectiveQuestion}"`;
    if (speakerBLabel) speakerBLabel.textContent = 'You';
    if (speakerBLine) speakerBLine.textContent = `"${effectiveAnswer}"`;

    // Key Chunks (Supports array of strings or array of objects)
    const chunksList = document.getElementById('card-key-chunks');
    if (chunksList) {
      chunksList.innerHTML = '';
      const rawChunks = sentence.keyChunks || sentence.keyPhrases || [];
      rawChunks.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'chunk-item';
        const isObj = typeof item === 'object' && item.chunk;
        const text = document.createElement('span');
        text.className = 'chunk-text';
        text.textContent = isObj ? item.chunk : item;
        const meaning = document.createElement('span');
        meaning.className = 'chunk-meaning';
        meaning.textContent = isObj ? (item.meaning || '') : '';
        li.append(text, meaning);
        chunksList.appendChild(li);
      });
    }

    // Alternatives (Supports array or object)
    const altCasualEl = document.getElementById('alt-casual-text');
    const altFormalEl = document.getElementById('alt-formal-text');
    let casualText = '';
    let formalText = '';

    if (Array.isArray(sentence.alternatives)) {
      casualText = sentence.alternatives[0] || '';
      formalText = sentence.alternatives[1] || '';
    } else if (sentence.alternatives && typeof sentence.alternatives === 'object') {
      casualText = sentence.alternatives.casual || '';
      formalText = sentence.alternatives.formal || '';
    }

    if (altCasualEl) altCasualEl.textContent = casualText ? `"${casualText}"` : 'Đang cập nhật...';
    if (altFormalEl) altFormalEl.textContent = formalText ? `"${formalText}"` : 'Đang cập nhật...';

    // Pro Tip / Interview Tip
    const tipEl = document.getElementById('pro-tip-text');
    if (tipEl) {
      tipEl.textContent = sentence.interviewTip || sentence.proTip || 'Luyện nghe và nhại theo (Shadowing) để tạo phản xạ giao tiếp tự nhiên!';
    }

    // Index & Mastered Button in Footer
    const indexEl = document.getElementById('current-index-display');
    if (indexEl) {
      indexEl.textContent = `Câu ${this.currentIndex + 1} / ${this.currentList.length}`;
    }

    const markBtn = document.getElementById('btn-mark-mastered');
    const markLabel = document.getElementById('mark-mastered-label');

    if (markBtn && markLabel) {
      if (isMastered) {
        markBtn.classList.add('is-mastered');
        markLabel.textContent = 'Đã thuộc';
      } else {
        markBtn.classList.remove('is-mastered');
        markLabel.textContent = 'Đánh dấu thuộc';
      }
    }
  }

  setupEventListeners() {
    // 1. TTS Controls (Full Dialogue Q&A, Question only, Answer 1.0x & 0.8x)
    const btnTtsDialogue = document.getElementById('btn-tts-dialogue');
    const btnTtsQuestion = document.getElementById('btn-tts-question');
    const btnTtsNormal = document.getElementById('btn-tts-normal');
    const btnTtsSlow = document.getElementById('btn-tts-slow');
    const audioWave = document.getElementById('audio-wave');

    const handleSpeech = (rate, customText = null) => {
      const sentence = this.currentList[this.currentIndex];
      if (!sentence) return;

      const sentenceText = customText || this.getEffectiveAnswer(sentence);
      if (audioWave) audioWave.classList.add('is-playing');
      this.isPlayingAudio = true;

      speakSentence(
        sentenceText,
        rate,
        () => {
          if (audioWave) audioWave.classList.add('is-playing');
        },
        () => {
          if (audioWave) audioWave.classList.remove('is-playing');
          this.isPlayingAudio = false;
        }
      );
    };

    if (btnTtsDialogue) {
      btnTtsDialogue.addEventListener('click', () => {
        const sentence = this.currentList[this.currentIndex];
        if (!sentence) return;
        const turns = parseDialogueTurns(sentence);
        const qText = this.getEffectiveQuestion(sentence, turns.lineA);
        const fullText = `${qText} ... ${this.getEffectiveAnswer(sentence)}`;
        handleSpeech(1.0, fullText);
      });
    }
    if (btnTtsQuestion) {
      btnTtsQuestion.addEventListener('click', () => {
        const sentence = this.currentList[this.currentIndex];
        if (!sentence) return;
        const turns = parseDialogueTurns(sentence);
        handleSpeech(1.0, this.getEffectiveQuestion(sentence, turns.lineA));
      });
    }
    if (btnTtsNormal) {
      btnTtsNormal.addEventListener('click', () => handleSpeech(1.0));
    }
    if (btnTtsSlow) {
      btnTtsSlow.addEventListener('click', () => handleSpeech(0.8));
    }

    // 1b. Personalize Question & Answer + Add Custom Q&A Card
    const btnPersonalize = document.getElementById('btn-personalize-answer');
    const englishHeading = document.getElementById('sentence-english');
    const editorPanel = document.getElementById('personalize-editor');
    const questionInputEl = document.getElementById('personalize-question-input');
    const textareaEl = document.getElementById('personalize-textarea');
    const btnSaveAnswer = document.getElementById('btn-save-answer');
    const btnResetAnswer = document.getElementById('btn-reset-answer');
    const btnAddCustomCard = document.getElementById('btn-add-custom-card');
    const presetContainer = document.getElementById('preset-chips');

    const togglePersonalize = () => {
      if (!editorPanel) return;
      editorPanel.hidden = !editorPanel.hidden;
      if (!editorPanel.hidden && textareaEl) {
        const sentence = this.currentList[this.currentIndex];
        const turns = parseDialogueTurns(sentence);
        if (questionInputEl) questionInputEl.value = this.getEffectiveQuestion(sentence, turns.lineA);
        textareaEl.value = this.getEffectiveAnswer(sentence);
        textareaEl.focus();
      }
    };

    if (btnPersonalize) btnPersonalize.addEventListener('click', togglePersonalize);
    if (englishHeading) englishHeading.addEventListener('click', togglePersonalize);

    if (presetContainer) {
      presetContainer.querySelectorAll('[data-preset]').forEach((chip) => {
        chip.addEventListener('click', () => {
          const sentence = this.currentList[this.currentIndex];
          if (!sentence || !textareaEl) return;
          textareaEl.value = buildRolePresetAnswer(sentence, chip.dataset.preset);
        });
      });
    }

    if (btnSaveAnswer) {
      btnSaveAnswer.addEventListener('click', () => {
        const sentence = this.currentList[this.currentIndex];
        if (!sentence || !textareaEl) return;
        const val = textareaEl.value.trim();
        if (val) {
          this.customAnswers[sentence.id] = val;
        } else {
          delete this.customAnswers[sentence.id];
        }
        if (questionInputEl) {
          const qVal = questionInputEl.value.trim();
          const turns = parseDialogueTurns(sentence);
          if (qVal && qVal !== turns.lineA) {
            this.customQuestions[sentence.id] = qVal;
          } else {
            delete this.customQuestions[sentence.id];
          }
          this.saveCustomQuestions();
        }
        this.saveCustomAnswers();
        if (editorPanel) editorPanel.hidden = true;
        this.renderCurrentSentence();
      });
    }

    if (btnAddCustomCard) {
      btnAddCustomCard.addEventListener('click', () => {
        const qVal = (questionInputEl && questionInputEl.value.trim()) || 'Can you walk me through a challenge you solved recently?';
        const aVal = (textareaEl && textareaEl.value.trim()) || '';
        if (!aVal) return;
        const newCard = {
          id: `custom-${Date.now()}`,
          isCustomCard: true,
          category: 'interview',
          categoryLabel: 'Cá nhân hóa',
          scenePhoto: '../assets/photo-interview.jpg',
          sentence: aVal,
          english: aVal,
          ipa: '/Personal Interview Q&A Card/',
          stressGuide: 'Nhấn mạnh động từ hành động và số liệu kết quả thực tế của bạn.',
          meaningVi: 'Thẻ câu hỏi & câu trả lời phỏng vấn do bạn tự cá nhân hóa.',
          vietnamese: 'Thẻ câu hỏi & câu trả lời phỏng vấn do bạn tự cá nhân hóa.',
          nuanceVi: 'Câu chuyện thực tế từ dự án của riêng bạn.',
          insteadOf: '',
          contextTitle: 'Câu hỏi phỏng vấn cá nhân hóa',
          context: 'Câu hỏi phỏng vấn cá nhân hóa',
          dialogue: `Interviewer: '${qVal.replace(/'/g, '')}' - Candidate: '${aVal.replace(/'/g, '')}'`,
          keyChunks: [{ chunk: 'Personal Story', meaning: 'Kinh nghiệm dự án thực tế' }],
          intonation: `${aVal} ↘`,
          alternatives: [aVal, aVal],
          interviewTip: 'Luyện đọc to 3 lần với tốc độ 1.0x để phản xạ tự nhiên khi phỏng vấn.',
          difficulty: 'Custom'
        };
        this.customCards = [newCard, ...(this.customCards || [])];
        this.saveCustomCards();
        this.updateFilteredList();
        this.currentIndex = 0;
        this.renderCategories();
        if (editorPanel) editorPanel.hidden = true;
        this.renderCurrentSentence();
      });
    }

    if (btnResetAnswer) {
      btnResetAnswer.addEventListener('click', () => {
        const sentence = this.currentList[this.currentIndex];
        if (!sentence) return;
        delete this.customAnswers[sentence.id];
        delete this.customQuestions[sentence.id];
        this.saveCustomAnswers();
        this.saveCustomQuestions();
        if (editorPanel) editorPanel.hidden = true;
        this.renderCurrentSentence();
      });
    }

    const btnToggleDetails = document.getElementById('btn-toggle-details');
    const extraInfoPanel = document.getElementById('extra-info-panel');
    if (btnToggleDetails && extraInfoPanel) {
      btnToggleDetails.addEventListener('click', () => {
        extraInfoPanel.hidden = !extraInfoPanel.hidden;
      });
    }

    const btnToggleSettings = document.getElementById('btn-toggle-settings');
    const scheduleDetails = document.getElementById('schedule-details');
    if (btnToggleSettings && scheduleDetails) {
      btnToggleSettings.addEventListener('click', () => {
        scheduleDetails.open = !scheduleDetails.open;
      });
    }

    const btnSyncAi = document.getElementById('btn-sync-ai');
    if (btnSyncAi) {
      btnSyncAi.addEventListener('click', () => {
        this.syncAiSentences({ silent: false });
      });
    }

    // 2. Navigation
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        this.currentIndex = (this.currentIndex - 1 + this.currentList.length) % this.currentList.length;
        this.renderCurrentSentence();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.currentIndex = (this.currentIndex + 1) % this.currentList.length;
        this.renderCurrentSentence();
      });
    }

    // Keyboard navigation (ArrowLeft / ArrowRight)
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
          return;
        }
        if (e.key === 'ArrowLeft') {
          if (btnPrev) btnPrev.click();
        } else if (e.key === 'ArrowRight') {
          if (btnNext) btnNext.click();
        } else if (e.key === ' ') {
          e.preventDefault();
          if (btnTtsNormal) btnTtsNormal.click();
        }
      });
    }

    // 3. Mark Mastered Toggle
    const btnMark = document.getElementById('btn-mark-mastered');
    if (btnMark) {
      btnMark.addEventListener('click', async () => {
        const sentence = this.currentList[this.currentIndex];
        if (!sentence) return;

        // Optimistic UI update
        this.state = markSentenceLearned(this.state, sentence.id);
        this.renderHeader();
        this.renderCurrentSentence();
        this.launchConfetti();

        // Send to SW / local persistence
        const res = await requestServiceWorker({
          type: 'MARK_LEARNED',
          payload: { sentenceId: sentence.id, learned: true }
        });
        if (res && res.state) {
          this.state = res.state;
          this.renderHeader();
          this.renderCurrentSentence();
        }
      });
    }

    // 4. Test Alarm 19:00 Button
    const btnTriggerSplit = document.getElementById('btn-trigger-split');
    // Dev-only control: visible only with ?debug=1 in the sidepanel URL
    if (btnTriggerSplit && typeof location !== 'undefined' && /[?&]debug=1\b/.test(location.search)) {
      btnTriggerSplit.hidden = false;
    }
    if (btnTriggerSplit) {
      btnTriggerSplit.addEventListener('click', async () => {
        const originalText = btnTriggerSplit.textContent;
        btnTriggerSplit.textContent = '⚡ Đang kích hoạt...';

        const res = await requestServiceWorker({
          type: 'TRIGGER_ALARM_NOW',
          payload: { forceSplit: true }
        });

        if (res && res.state) {
          this.state = res.state;
        } else {
          this.state.alarmState.activeBanner = true;
        }

        this.renderHeader();

        setTimeout(() => {
          btnTriggerSplit.textContent = '⚡ Đã test 19:00!';
          setTimeout(() => {
            btnTriggerSplit.textContent = originalText;
          }, 1500);
        }, 300);
      });
    }

    // 5. Snooze Buttons (Banner + Header)
    const handleSnooze = async () => {
      const res = await requestServiceWorker({
        type: 'SNOOZE_ALARM',
        payload: { minutes: 15 }
      });
      if (res && res.state) {
        this.state = res.state;
      } else {
        this.state.alarmState.activeBanner = false;
      }
      this.renderHeader();

      const statusMsg = document.getElementById('schedule-status-msg');
      if (statusMsg) {
        statusMsg.textContent = '⏰ Đã hoãn 15 phút!';
        setTimeout(() => { statusMsg.textContent = ''; }, 3000);
      }
    };

    const btnSnooze15 = document.getElementById('btn-snooze-15');
    const btnSnoozeHeader = document.getElementById('btn-snooze-header');
    if (btnSnooze15) btnSnooze15.addEventListener('click', handleSnooze);
    if (btnSnoozeHeader) btnSnoozeHeader.addEventListener('click', handleSnooze);

    // 6. Dismiss Banner Button
    const btnDismissBanner = document.getElementById('btn-dismiss-banner');
    if (btnDismissBanner) {
      btnDismissBanner.addEventListener('click', () => {
        this.state.alarmState.activeBanner = false;
        this.renderHeader();
      });
    }

    // 7. Save Schedule Settings Button
    const btnSaveSchedule = document.getElementById('btn-save-schedule');
    if (btnSaveSchedule) {
      btnSaveSchedule.addEventListener('click', async () => {
        const morningTimeInput = document.getElementById('schedule-morning-time-input');
        const timeInput = document.getElementById('schedule-time-input');
        const toggleInput = document.getElementById('schedule-enabled-toggle');
        const modeSelect = document.getElementById('schedule-display-mode');
        const statusMsg = document.getElementById('schedule-status-msg');

        const morningTimeVal = morningTimeInput ? morningTimeInput.value : '09:00';
        const timeVal = timeInput ? timeInput.value : '19:00';
        const enabledVal = toggleInput ? toggleInput.checked : true;

        const res = await requestServiceWorker({
          type: 'UPDATE_SCHEDULE',
          payload: {
            morningTime: morningTimeVal,
            time: timeVal,
            enabled: enabledVal,
            autoSplitScreen: true,
            displayMode: modeSelect && modeSelect.value === 'sidePanel' ? 'sidePanel' : 'split'
          }
        });

        if (!res || res.ok === false) {
          if (statusMsg) {
            statusMsg.textContent = `⚠ ${(res && res.error) || 'Không thể lưu cài đặt'}`;
            setTimeout(() => { statusMsg.textContent = ''; }, 4000);
          }
          return;
        }

        if (res.state) this.state = res.state;
        this.renderHeader();

        if (statusMsg) {
          statusMsg.textContent = '✓ Đã lưu cài đặt!';
          setTimeout(() => { statusMsg.textContent = ''; }, 2500);
        }
      });
    }
  }

  launchConfetti() {
    if (typeof document === 'undefined') return;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#06b6d4', '#f59e0b', '#10b981', '#f43f5e', '#6366f1'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 150,
        y: canvas.height * 0.75 + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 8 - 4,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        alpha: 1
      });
    }

    let animationFrame;
    const startTime = Date.now();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.alpha = Math.max(0, 1 - elapsed / 1200);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (elapsed < 1200) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    };

    animate();
  }
}

// Auto-boot if running inside browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const controller = new SidepanelController();
    controller.init();
    window.__sidepanelController = controller; // Accessible for tests/Playwright
  });
}
