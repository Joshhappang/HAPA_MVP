import os
import sys
from flask import Flask, request, jsonify

# =========================
# FIX IMPORT PATH (IMPORTANT FOR RENDER)
# =========================
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from server import MiniFigmaAPIServer

app = Flask(__name__)

engine = MiniFigmaAPIServer()
engine.register_routes()

# =========================
# HEALTH CHECK
# =========================
@app.route("/")
def home():
    return "HAPA API RUNNING"

# =========================
# AI GENERATE ENDPOINT
# =========================
@app.route("/ai/generate", methods=["POST"])
def ai_generate():
    data = request.json or {}

    prompt = data.get("prompt", "")

    result = engine.ai_generate(prompt)

    return jsonify({
        "status": "success",
        "data": result
    })

# =========================
# TEST ROUTE
# =========================
@app.route("/ping")
def ping():
    return jsonify({
        "status": "ok",
        "message": "HAPA alive"
    })

# =========================
# RUN SERVER (DEPLOY SAFE)
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
