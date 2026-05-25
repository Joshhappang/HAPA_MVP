from flask import Flask, request, jsonify
from server import MiniFigmaAPIServer

app = Flask(__name__)

engine = MiniFigmaAPIServer()
engine.register_routes()

# =========================
# HEALTH CHECK (DEPLOY TEST)
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
    result = engine.ai_generate(data.get("prompt", ""))
    return jsonify({
        "status": "success",
        "data": result
    })

# =========================
# RUN SERVER (LOCAL ONLY)
# =========================
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
