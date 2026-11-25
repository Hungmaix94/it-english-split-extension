#!/usr/bin/env python3
"""
scripts/generate_weekly_ai_sentences.py

Uses GEMINI_API_KEY & model configuration from /Users/phamhung/D/Work/MVL/slackbot
to generate a fresh weekly pack of personalized IT Interview & Workplace English Q&A dialogues
and uploads it to Cloudflare R2 CDN:
  https://pub-dd118e9f58254711a5ec2f75e6bf0530.r2.dev/it-english/weekly-sentences.json
"""

import os
import sys
import json
import datetime
import urllib.request
import urllib.error
from pathlib import Path

SLACKBOT_DIR = Path("/Users/phamhung/D/Work/MVL/slackbot")
SLACKBOT_ENV = SLACKBOT_DIR / ".env"
MCP_CONFIG_PATH = Path.home() / ".gemini" / "config" / "mcp.json"

DEFAULT_CF_ACCOUNT_ID = "a748ab44d638f1522c992914b7dfe802"
DEFAULT_CF_BUCKET = "storage"
DEFAULT_PUBLIC_DOMAIN = "pub-dd118e9f58254711a5ec2f75e6bf0530.r2.dev"
R2_LIVE_KEY = "it-english/weekly-sentences.json"


def load_env_file(env_path: Path):
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.strip()
        v = v.strip().strip('"').strip("'")
        if k and k not in os.environ:
            os.environ[k] = v


def load_r2_credentials():
    cf_token = os.environ.get("CLOUDFLARE_API_TOKEN")
    cf_account_id = os.environ.get("CLOUDFLARE_ACCOUNT_ID", DEFAULT_CF_ACCOUNT_ID)
    if not cf_token and MCP_CONFIG_PATH.exists():
        data = json.loads(MCP_CONFIG_PATH.read_text(encoding="utf-8"))
        cf_token = (
            data.get("mcpServers", {})
            .get("cloudflare", {})
            .get("env", {})
            .get("CLOUDFLARE_API_TOKEN")
        )
    return cf_token, cf_account_id


def call_gemini_weekly_sentences(api_key: str, week_label: str) -> list:
    models = [
        "gemini-4-hydrogen",
        "gemini-3.5-flash-lite",
        "gemini-2.5-flash-lite",
        "gemini-3.5-flash",
        "gemini-3.6-flash",
        os.environ.get("GEMINI_MODEL", "gemini-2.5-flash-lite"),
    ]
    seen = []
    model_candidates = [m for m in models if m and not (m in seen or seen.append(m))]

    prompt = f"""You are an elite Executive IT English Coach designing Week {week_label}'s personalized Q&A dialogue pack for a Senior Full-Stack Engineer & Tech Lead.
Their real tech stack and daily workflow:
- Backend: Python, Django 5.2, Django REST Framework (DRF), Wagtail Headless CMS (StreamField), PostgreSQL (N+1 optimization, select_related, prefetch_related, select_for_update, composite indexes), Redis, Celery, Channels.
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, OpenAPI schema contract type generation (components['schemas']), Three.js / WebGL2 3D real-estate masterplan (InstancedMesh, Multi-LOD 60fps).
- Mobile: Flutter 3.x, Dart 3.x, GetX MVC, GetIt DI, multi-backend separation (ERP, AppSale, Chat).
- AI & DevOps: Multi-Agent Agile Squad (BMAD, Two-phase TDD RED->GREEN, Gate reviews), automated headless browser E2E video recording uploaded to Cloudflare R2, Plane.so issue tracking (in-review -> dev passed -> clean cherry-pick release branch off main -> semantic tag v* deploy PROD), Sentry stack traces.

Generate EXACTLY 10 brand-new, natural, high-impact Q&A dialogue cards for Week {week_label} (4 in 'interview', 2 in 'standup', 2 in 'codereview', 1 in 'architecture', 1 in 'incident').
Return ONLY a raw JSON array (no markdown fences) where each item has these exact keys:
- "id": string like "ai-{week_label.lower()}-01" .. "ai-{week_label.lower()}-10"
- "category": one of "interview" | "standup" | "codereview" | "architecture" | "incident"
- "categoryLabel": string ("IT Technical Interview [AI Tuần {week_label}]", "Daily Standup [AI]", "Code Review & PR [AI]", "System & Architecture [AI]", or "Incident & Debugging [AI]")
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
- "presets": object with 4 keys where EACH value is a complete 1-sentence English answer (20-30 words, NEVER "N/A" or short tags): {{"backend": "<full 1-sentence answer from a Django/DRF/PostgreSQL perspective>", "frontend": "<full 1-sentence answer from a Next.js/TypeScript/Three.js perspective>", "mobile": "<full 1-sentence answer from a Flutter/Dart/GetX perspective>", "fullstack": "<full 1-sentence answer from a Tech Lead/AI Squad perspective>"}}
- "keyChunks": array of 3 objects [{{"chunk": "<English phrase>", "meaning": "<Vietnamese meaning>"}}]
- "intonation": string (the English sentence annotated with ↗ and ↘ intonation arrows)
- "alternatives": array of 2 English alternative sentences
- "interviewTip": string in Vietnamese with a practical interview or workplace tip
- "difficulty": "B2" or "C1"
"""

    last_err = None
    for model_name in model_candidates:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.45,
                "responseMimeType": "application/json",
            },
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            print(f"[*] Calling Gemini API model '{model_name}' (from slackbot config)...")
            with urllib.request.urlopen(req, timeout=60) as resp:
                body = json.loads(resp.read().decode("utf-8"))
                text = (
                    body.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
                )
                if not text:
                    raise ValueError("Empty text from Gemini")
                cleaned = text.strip()
                if cleaned.startswith("```"):
                    cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0].strip()
                items = json.loads(cleaned)
                if isinstance(items, dict) and "sentences" in items:
                    items = items["sentences"]
                if not isinstance(items, list) or len(items) < 5:
                    raise ValueError(f"Expected list of >=5 sentences, got {type(items)}")
                print(f"[+] Gemini '{model_name}' generated {len(items)} personalized Q&A dialogues!")
                return items
        except Exception as e:
            print(f"[WARN] Model '{model_name}' error: {e}")
            last_err = e

    raise RuntimeError(f"All Gemini models failed: {last_err}")


def upload_json_to_r2(data_obj: dict, key: str, cf_token: str, cf_account_id: str) -> str:
    url = f"https://api.cloudflare.com/client/v4/accounts/{cf_account_id}/r2/buckets/{DEFAULT_CF_BUCKET}/objects/{key}"
    raw_bytes = json.dumps(data_obj, ensure_ascii=False, indent=2).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=raw_bytes,
        headers={
            "Authorization": f"Bearer {cf_token}",
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=300",
        },
        method="PUT",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        if resp.status not in (200, 201):
            raise RuntimeError(f"R2 upload failed with HTTP {resp.status}")
    return f"https://{DEFAULT_PUBLIC_DOMAIN}/{key}"


def main():
    load_env_file(SLACKBOT_ENV)
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        raise RuntimeError(f"GEMINI_API_KEY not found in {SLACKBOT_ENV}")

    cf_token, cf_account_id = load_r2_credentials()
    if not cf_token:
        raise RuntimeError("CLOUDFLARE_API_TOKEN not found in env or ~/.gemini/config/mcp.json")

    now = datetime.datetime.now(datetime.timezone.utc)
    iso_year, iso_week, _ = now.isocalendar()
    week_label = f"{iso_year}-W{iso_week:02d}"

    sentences = call_gemini_weekly_sentences(api_key, week_label)

    payload = {
        "version": "1.1.0",
        "weekLabel": week_label,
        "generatedAt": now.isoformat(),
        "source": "slackbot-gemini-ai",
        "count": len(sentences),
        "sentences": sentences,
    }

    # Save local copy in data/weekly-ai-sentences.json
    local_out = Path(__file__).resolve().parent.parent / "data" / "weekly-ai-sentences.json"
    local_out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[+] Saved local backup: {local_out}")

    # Upload live weekly feed + archive feed to Cloudflare R2
    live_url = upload_json_to_r2(payload, R2_LIVE_KEY, cf_token, cf_account_id)
    archive_key = f"it-english/weeks/week-{week_label}.json"
    archive_url = upload_json_to_r2(payload, archive_key, cf_token, cf_account_id)

    print("============================================================")
    print(f"[✓] Weekly AI Pack ({week_label}) Published to Cloudflare R2!")
    print(f"    Live Feed URL:    {live_url}")
    print(f"    Archive Feed URL: {archive_url}")
    print("============================================================")


if __name__ == "__main__":
    main()
