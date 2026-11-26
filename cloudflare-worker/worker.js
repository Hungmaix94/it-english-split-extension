/**
 * Cloudflare Worker: it-english-weekly-ai
 * - Runs automatically every Monday at 00:00 UTC (07:00 AM Vietnam time) via Cloudflare Cron Trigger ("0 0 * * 1")
 * - Calls Google Gemini API (using GEMINI_API_KEY secret from slackbot) to generate 10 personalized Senior Full-Stack Q&A dialogues
 * - Stores the output directly into Cloudflare R2 bucket 'storage' at:
 *     it-english/weekly-sentences.json
 *     it-english/weeks/week-YYYY-Www.json
 * - Exposes HTTP endpoints:
 *     GET  /          -> returns current weekly-sentences.json from R2
 *     POST /generate  -> triggers an immediate AI regeneration & updates R2
 */

const R2_LIVE_KEY = 'it-english/weekly-sentences.json';
const PUBLIC_CDN_BASE = 'https://pub-dd118e9f58254711a5ec2f75e6bf0530.r2.dev';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function getIsoWeekLabel(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function buildPrompt(weekLabel) {
  return `You are an elite Executive IT English Coach designing Week ${weekLabel}'s personalized Q&A dialogue pack for a Senior Full-Stack Engineer & Tech Lead.
Their real tech stack and daily workflow:
- Backend: Python, Django 5.2, Django REST Framework (DRF), Wagtail Headless CMS (StreamField), PostgreSQL (N+1 optimization, select_related, prefetch_related, select_for_update, composite indexes), Redis, Celery, Channels.
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, OpenAPI schema contract type generation (components['schemas']), Three.js / WebGL2 3D real-estate masterplan (InstancedMesh, Multi-LOD 60fps).
- Mobile: Flutter 3.x, Dart 3.x, GetX MVC, GetIt DI, multi-backend separation (ERP, AppSale, Chat).
- AI & DevOps: Multi-Agent Agile Squad (BMAD, Two-phase TDD RED->GREEN, Gate reviews), automated headless browser E2E video recording uploaded to Cloudflare R2, Plane.so issue tracking (in-review -> dev passed -> clean cherry-pick release branch off main -> semantic tag v* deploy PROD), Sentry stack traces.

Generate EXACTLY 10 brand-new, natural, high-impact Q&A dialogue cards for Week ${weekLabel} (4 in 'interview', 2 in 'standup', 2 in 'codereview', 1 in 'architecture', 1 in 'incident').
Return ONLY a raw JSON array (no markdown fences) where each item has these exact keys:
- "id": string like "ai-${weekLabel.toLowerCase()}-01" .. "ai-${weekLabel.toLowerCase()}-10"
- "category": one of "interview" | "standup" | "codereview" | "architecture" | "incident"
- "categoryLabel": string ("IT Technical Interview [AI Tuần ${weekLabel}]", "Daily Standup [AI]", "Code Review & PR [AI]", "System & Architecture [AI]", or "Incident & Debugging [AI]")
- "scenePhoto": "../assets/photo-interview.jpg" for interview, "../assets/photo-architecture.jpg" for architecture, "../assets/photo-teamwork.jpg" for standup/codereview/incident
- "sentence": string (Your strong, concise 1-sentence answer in English, 18-32 words)
- "english": same as "sentence"
- "ipa": string (IPA phonetic transcription of "sentence")
- "stressGuide": string in Vietnamese ("Nhấn mạnh: ...")
- "meaningVi": string (natural Vietnamese translation of your answer)
- "vietnamese": same as "meaningVi"
- "nuanceVi": string in Vietnamese explaining why this phrasing sounds senior and persuasive
- "insteadOf": string (a weak/junior English phrasing to avoid)
- "contextTitle": string in Vietnamese describing the scenario
- "context": same as "contextTitle"
- "dialogue": string formatted strictly as "Interviewer: '<question>' - Candidate: '<your answer>'"
- "presets": object with 4 keys where EACH value is a complete 1-sentence English answer (20-30 words, NEVER "N/A" or short tags): {"backend": "<full 1-sentence answer from a Django/DRF/PostgreSQL perspective>", "frontend": "<full 1-sentence answer from a Next.js/TypeScript/Three.js perspective>", "mobile": "<full 1-sentence answer from a Flutter/Dart/GetX perspective>", "fullstack": "<full 1-sentence answer from a Tech Lead/AI Squad perspective>"}
- "keyChunks": array of 3 objects [{"chunk": "<English phrase>", "meaning": "<Vietnamese meaning>"}]
- "intonation": string (the English sentence annotated with ↗ and ↘ intonation arrows)
- "alternatives": array of 2 English alternative sentences
- "interviewTip": string in Vietnamese with a practical interview or workplace tip
- "difficulty": "B2" or "C1"`;
}

async function generateWithGemini(apiKey, weekLabel) {
  const models = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'];
  const prompt = buildPrompt(weekLabel);
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.45,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!resp.ok) {
        lastError = new Error(`Model ${model} returned HTTP ${resp.status}`);
        continue;
      }

      const body = await resp.json();
      let text = body?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      text = text.trim();
      if (text.startsWith('```')) {
        text = text.split('\n').slice(1).join('\n').replace(/```$/, '').trim();
      }
      let parsed = JSON.parse(text);
      if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.sentences)) {
        parsed = parsed.sentences;
      }
      if (Array.isArray(parsed) && parsed.length >= 5) {
        return { model, sentences: parsed };
      }
      lastError = new Error(`Model ${model} returned invalid array`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('All Gemini models failed');
}

async function runWeeklyGeneration(env) {
  if (!env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY secret in Cloudflare Worker');
  }
  const now = new Date();
  const weekLabel = getIsoWeekLabel(now);
  const { model, sentences } = await generateWithGemini(env.GEMINI_API_KEY, weekLabel);

  const payload = {
    version: '1.1.0',
    weekLabel,
    generatedAt: now.toISOString(),
    source: `cloudflare-worker:${model}`,
    count: sentences.length,
    sentences
  };

  const jsonBytes = JSON.stringify(payload, null, 2);
  const archiveKey = `it-english/weeks/week-${weekLabel}.json`;

  if (env.STORAGE) {
    await env.STORAGE.put(R2_LIVE_KEY, jsonBytes, {
      httpMetadata: {
        contentType: 'application/json; charset=utf-8',
        cacheControl: 'public, max-age=300'
      }
    });
    await env.STORAGE.put(archiveKey, jsonBytes, {
      httpMetadata: {
        contentType: 'application/json; charset=utf-8',
        cacheControl: 'public, max-age=86400'
      }
    });
  }

  return {
    ok: true,
    weekLabel,
    model,
    count: sentences.length,
    liveUrl: `${PUBLIC_CDN_BASE}/${R2_LIVE_KEY}`,
    archiveUrl: `${PUBLIC_CDN_BASE}/${archiveKey}`,
    payload
  };
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runWeeklyGeneration(env));
  },

  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/generate' || request.method === 'POST') {
      try {
        const result = await runWeeklyGeneration(env);
        return new Response(JSON.stringify(result.payload, null, 2), {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
    }

    // Default GET /: serve latest weekly-sentences.json from R2 bucket
    if (env.STORAGE) {
      const obj = await env.STORAGE.get(R2_LIVE_KEY);
      if (obj) {
        return new Response(obj.body, {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, max-age=300'
          }
        });
      }
    }

    return Response.redirect(`${PUBLIC_CDN_BASE}/${R2_LIVE_KEY}`, 302);
  }
};
