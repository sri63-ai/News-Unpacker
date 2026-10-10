from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import hashlib
import sqlite3
import time
from datetime import datetime, timezone
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# 1. API Keys Configuration
GEMINI_API_KEY = "AQ.Ab8RN6LDzT_b1l3kRNcGJai5v23Hp9SPIvD7gEkqv5yBYsMbvQ"
OPENAI_API_KEY = "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"

DAILY_FREE_LIMIT = 5  # లాగిన్ లేకుండా రోజుకు 5 ఉచిత సమ్మరీలు

# 2. OpenAI Client Initialization
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# --- SQLite Database Tracker Setup (No Login Needed) ---
def get_db():
    conn = sqlite3.connect("usage_tracker.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS daily_usage (
                client_hash TEXT,
                usage_date TEXT,
                count INTEGER,
                PRIMARY KEY (client_hash, usage_date)
            )
        """)
        conn.commit()

init_db()

def get_client_fingerprint(req):
    """యూజర్ లాగిన్ కాకపోయినా IP + Browser Agent తో యూనిక్ కీ తయారు చేయడం"""
    ip = req.headers.get("X-Forwarded-For", req.remote_addr)
    if ip and "," in ip:
        ip = ip.split(",")[0].strip()
    
    user_agent = req.headers.get("User-Agent", "Unknown-Agent")
    raw_id = f"{ip}_{user_agent}"
    return hashlib.sha256(raw_id.encode("utf-8")).hexdigest()

def check_and_increment_quota(client_hash):
    """కోటా తనిఖీ మరియు కౌంటర్ పెంపు"""
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT count FROM daily_usage WHERE client_hash = ? AND usage_date = ?",
            (client_hash, today_str)
        )
        row = cursor.fetchone()
        
        current_count = row["count"] if row else 0
        
        # 5 ఆర్టికల్స్ అయిపోతే బ్లాక్ చేస్తుంది
        if current_count >= DAILY_FREE_LIMIT:
            return False, current_count
            
        new_count = current_count + 1
        cursor.execute("""
            INSERT INTO daily_usage (client_hash, usage_date, count)
            VALUES (?, ?, ?)
            ON CONFLICT(client_hash, usage_date) DO UPDATE SET count = ?
        """, (client_hash, today_str, new_count, new_count))
        conn.commit()
        
        return True, new_count

# --- AI Engines ---
def generate_with_gemini(prompt_text):
    """Google Gemini 3.8 Flash REST API with Auto-Retry and Robust Extraction"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt_text}]}],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 4096
        }
    }
    
    max_retries = 3
    for attempt in range(max_retries):
        response = requests.post(url, headers=headers, json=payload, timeout=90)
        data = response.json()
        
        # విజయవంతమైతే
        if response.status_code == 200:
            candidates = data.get("candidates", [])
            if not candidates:
                block_reason = data.get("promptFeedback", {}).get("blockReason")
                if block_reason:
                    raise Exception(f"Prompt blocked by AI Safety: {block_reason}")
                raise Exception("No candidates returned from Gemini.")

            first_candidate = candidates[0]
            parts = first_candidate.get("content", {}).get("parts", [])
            if not parts or "text" not in parts[0] or not parts[0]["text"].strip():
                finish_reason = first_candidate.get("finishReason", "UNKNOWN")
                raise Exception(f"Empty text output. Finish reason: {finish_reason}")
                
            return parts[0]["text"].strip()
            
        # 503 (High Demand) వస్తే ఆటో-రీట్రై
        if response.status_code == 503 and attempt < max_retries - 1:
            print(f"[Warning] 503 High demand encountered. Retrying in 2 seconds (Attempt {attempt + 1}/{max_retries})...")
            time.sleep(2)
            continue
            
        error_msg = data.get("error", {}).get("message", "Gemini API Error")
        raise Exception(f"HTTP {response.status_code}: {error_msg}")

def generate_with_chatgpt(prompt_text):
    """OpenAI GPT-4o-mini Fallback"""
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt_text}],
        temperature=0.7
    )
    return response.choices[0].message.content

# --- API Endpoint ---
@app.route("/api/unpack", methods=["POST"])
def unpack_news():
    client_hash = get_client_fingerprint(request)
    
    # 1. డైలీ ఫ్రీ లిమిట్ తనిఖీ (లాగిన్ లేకుండానే పనిచేస్తుంది)
    allowed, count = check_and_increment_quota(client_hash)
    if not allowed:
        return jsonify({
            "error": "Daily free limit reached",
            "message": f"మీరు ఈ రోజుకు కేటాయించిన {DAILY_FREE_LIMIT} ఉచిత సమ్మరీల పరిమితిని చేరుకున్నారు. రేపు మళ్లీ ఉచితంగా పొందవచ్చు!",
            "limit_reached": True,
            "usage_count": count
        }), 429

    data = request.get_json(silent=True) or {}
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # 2. ప్రాథమిక ఇంజిన్: Google Gemini 3.8 Flash
    try:
        print(f"[Info] User ({client_hash[:8]}...) - Usage {count}/{DAILY_FREE_LIMIT}. Calling Gemini...")
        output_text = generate_with_gemini(prompt)
        print("[Success] Processed via Gemini!")
        return jsonify({
            "success": True,
            "result": output_text,
            "source": "Google Gemini",
            "remaining_quota": max(0, DAILY_FREE_LIMIT - count),
            "usage_count": count
        })
    except Exception as gemini_err:
        print(f"[Warning] Gemini failed: {gemini_err}. Switching to ChatGPT...")

        # 3. బ్యాకప్ ఇంజిన్: OpenAI ChatGPT (gpt-4o-mini)
        try:
            output_text = generate_with_chatgpt(prompt)
            print("[Success] Processed via ChatGPT Fallback!")
            return jsonify({
                "success": True,
                "result": output_text,
                "source": "OpenAI ChatGPT",
                "remaining_quota": max(0, DAILY_FREE_LIMIT - count),
                "usage_count": count
            })
        except Exception as openai_err:
            print(f"[Error] ChatGPT backup also failed: {openai_err}")
            return jsonify({
                "error": "Both Gemini and ChatGPT engines failed.",
                "gemini_error": str(gemini_err),
                "openai_error": str(openai_err)
            }), 500

if __name__ == "__main__":
    print("News Unpacker Hybrid & Quota-Guarded Server running on port 5000...")
    app.run(host="127.0.0.1", port=5000, debug=True)
