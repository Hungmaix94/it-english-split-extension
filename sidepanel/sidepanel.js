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
    return [...sentences];
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
    default:
      return { ok: true, state };
  }
}

// ============================================================================
// Sidepanel UI Controller Class
// ============================================================================

export class SidepanelController {
  constructor() {
    this.state = createInitialState();
    this.activeCategory = 'all';
    this.currentIndex = 0;
    this.currentList = [...IT_SENTENCES];
    this.isPlayingAudio = false;
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
  }

  updateFilteredList() {
    this.currentList = filterSentences(IT_SENTENCES, this.activeCategory);
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

      const count = cat.id === 'all'
        ? IT_SENTENCES.length
        : filterSentences(IT_SENTENCES, cat.id).length;

      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(cat.id === this.activeCategory));
      [['tab-icon', cat.icon || '📌'], ['tab-label', cat.label], ['tab-count', String(count)]].forEach(([cls, text]) => {
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

    // 4. Schedule Drawer inputs
    const timeInput = document.getElementById('schedule-time-input');
    const toggleInput = document.getElementById('schedule-enabled-toggle');
    const nextAlarmDisplay = document.getElementById('next-alarm-display');
    const modeInput = document.getElementById('schedule-display-mode');
    if (modeInput) {
      modeInput.value = this.state.schedule?.displayMode === 'sidePanel' ? 'sidePanel' : 'split';
    }

    if (timeInput && this.state.schedule?.time) {
      timeInput.value = this.state.schedule.time;
    }
    if (toggleInput && this.state.schedule) {
      toggleInput.checked = Boolean(this.state.schedule.enabled);
    }
    if (nextAlarmDisplay) {
      const isEnabled = this.state.schedule?.enabled;
      const scheduledTime = this.state.schedule?.time || '19:00';
      nextAlarmDisplay.textContent = isEnabled
        ? `Hẹn giờ: ${scheduledTime} hàng ngày`
        : 'Đã tạm tắt hẹn giờ';
    }
  }

  renderCurrentSentence() {
    if (!this.currentList || this.currentList.length === 0) return;

    const sentence = this.currentList[this.currentIndex];
    if (!sentence) return;

    // Badges
    const topicBadge = document.getElementById('sentence-topic-badge');
    const levelBadge = document.getElementById('sentence-level-badge');
    const masteredPill = document.getElementById('sentence-mastered-indicator');

    if (topicBadge) topicBadge.textContent = sentence.categoryLabel || 'IT English';
    if (levelBadge) levelBadge.textContent = sentence.difficulty || sentence.level || 'Professional';

    const isMastered = this.state.progress.learnedIds?.includes(sentence.id);
    if (masteredPill) {
      if (isMastered) {
        masteredPill.classList.remove('hidden');
      } else {
        masteredPill.classList.add('hidden');
      }
    }

    // Hero English & IPA
    const englishEl = document.getElementById('sentence-english');
    const ipaEl = document.getElementById('sentence-ipa');
    if (englishEl) englishEl.textContent = sentence.english || sentence.sentence;
    if (ipaEl) ipaEl.textContent = sentence.ipa;

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
    if (viEl) viEl.textContent = sentence.vietnamese || sentence.meaningVi;
    if (nuanceEl) nuanceEl.textContent = sentence.nuanceVi || sentence.nuance || 'Tự tin, chuyên nghiệp';

    // Dialogue (Supports both object { speakerA, speakerB } and formatted string)
    const scenarioEl = document.getElementById('dialogue-scenario');
    const speakerALabel = document.getElementById('speaker-a-label');
    const speakerALine = document.getElementById('dialogue-speaker-a');
    const speakerBLabel = document.getElementById('speaker-b-label');
    const speakerBLine = document.getElementById('dialogue-speaker-b');

    if (scenarioEl) scenarioEl.textContent = `Scenario: ${sentence.context || sentence.contextTitle || 'Hội thoại IT'}`;

    if (sentence.dialogue && typeof sentence.dialogue === 'object' && sentence.dialogue.speakerA) {
      if (speakerALabel) speakerALabel.textContent = sentence.dialogue.speakerA.role || 'Speaker A';
      if (speakerALine) speakerALine.textContent = `"${sentence.dialogue.speakerA.line || ''}"`;
      if (speakerBLabel) speakerBLabel.textContent = sentence.dialogue.speakerB.role || 'Speaker B';
      if (speakerBLine) speakerBLine.textContent = `"${sentence.dialogue.speakerB.line || ''}"`;
    } else if (typeof sentence.dialogue === 'string') {
      const parts = sentence.dialogue.split(' - ');
      if (speakerALabel) speakerALabel.textContent = 'Colleague / Lead';
      if (speakerALine) speakerALine.textContent = parts[0] || sentence.dialogue;
      if (speakerBLabel) speakerBLabel.textContent = 'You (Engineer)';
      if (speakerBLine) speakerBLine.textContent = parts[1] || `"${sentence.english || sentence.sentence}"`;
    }

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
        text.textContent = `🎯 ${isObj ? item.chunk : item}`;
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
        markLabel.textContent = '✅ Đã thuộc';
      } else {
        markBtn.classList.remove('is-mastered');
        markLabel.textContent = 'Đã thuộc';
      }
    }
  }

  setupEventListeners() {
    // 1. TTS Controls
    const btnTtsNormal = document.getElementById('btn-tts-normal');
    const btnTtsSlow = document.getElementById('btn-tts-slow');
    const audioWave = document.getElementById('audio-wave');

    const handleSpeech = (rate) => {
      const sentence = this.currentList[this.currentIndex];
      if (!sentence) return;

      const sentenceText = sentence.english || sentence.sentence;
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

    if (btnTtsNormal) {
      btnTtsNormal.addEventListener('click', () => handleSpeech(1.0));
    }
    if (btnTtsSlow) {
      btnTtsSlow.addEventListener('click', () => handleSpeech(0.8));
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
        const timeInput = document.getElementById('schedule-time-input');
        const toggleInput = document.getElementById('schedule-enabled-toggle');
        const modeSelect = document.getElementById('schedule-display-mode');
        const statusMsg = document.getElementById('schedule-status-msg');

        const timeVal = timeInput ? timeInput.value : '19:00';
        const enabledVal = toggleInput ? toggleInput.checked : true;

        const res = await requestServiceWorker({
          type: 'UPDATE_SCHEDULE',
          payload: {
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
