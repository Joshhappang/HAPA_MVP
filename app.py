from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json

app = FastAPI(title="HAPA MVP API", version="0.1-mvp")

# CORS (biar frontend bisa connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# SYSTEM STATUS
# ---------------------------
@app.get("/")
def root():
    return {
        "name": "HAPA_MVP",
        "status": "running",
        "time": datetime.now().isoformat()
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "engine": "alive",
        "timestamp": datetime.now().isoformat()
    }


# ---------------------------
# AI ENDPOINT (DUMMY)
# ---------------------------
@app.post("/ai/generate")
async def ai_generate(request: Request):
    body = await request.json()
    prompt = body.get("prompt", "")

    return {
        "prompt": prompt,
        "result": f"[AI MOCK] Generated UI for: {prompt}",
        "type": "ui_mock",
        "time": datetime.now().isoformat()
    }


# ---------------------------
# CANVAS ENDPOINT (DUMMY)
# ---------------------------
@app.post("/canvas/create")
async def canvas_create(request: Request):
    body = await request.json()

    return {
        "canvas_id": "canvas_" + datetime.now().strftime("%Y%m%d%H%M%S"),
        "data": body,
        "status": "created"
    }


@app.post("/canvas/save")
async def canvas_save(request: Request):
    body = await request.json()

    return {
        "status": "saved",
        "message": "Canvas saved successfully",
        "timestamp": datetime.now().isoformat(),
        "data": body
    }


# ---------------------------
# EXPORT ENDPOINT (DUMMY)
# ---------------------------
@app.post("/export")
async def export_project(request: Request):
    body = await request.json()
    export_type = body.get("type", "html")

    return {
        "status": "success",
        "export_type": export_type,
        "download_url": f"/downloads/mock.{export_type}",
        "time": datetime.now().isoformat()
    }


# ---------------------------
# DEBUG ROUTE
# ---------------------------
@app.get("/debug")
def debug():
    return {
        "modules": [
            "ai",
            "canvas",
            "export",
            "auth (future)",
            "collaboration (future)"
        ],
        "architecture": "HAPA MVP CORE",
        "mode": "development"
    }
