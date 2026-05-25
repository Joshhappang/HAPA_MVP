import os
import sys
import json
from datetime import datetime

from config import config

# Backend API (kalau ada Flask/FastAPI di backend/api)
try:
    from backend.api.server import app
    HAS_SERVER = True
except Exception as e:
    print("[HAPA] Backend server not loaded:", e)
    HAS_SERVER = False


# Core engine bootstrap (placeholder safe import)
def bootstrap_engine():
    print("[HAPA] Booting Core Engine...")

    try:
        from core import engine
        print("[HAPA] Core engine loaded")
    except Exception as e:
        print("[HAPA] Core engine not found:", e)

    try:
        from ai.ai_tools.ui_generator import generate_ui
        print("[HAPA] AI UI Generator ready")
    except Exception as e:
        print("[HAPA] AI tools not fully loaded:", e)

    print("[HAPA] Engine bootstrap complete")


# Simple runtime info
def runtime_info():
    return {
        "name": "HAPA_MVP",
        "status": "running",
        "time": datetime.now().isoformat(),
        "version": "0.1-mvp"
    }


# CLI mode fallback
def cli_mode():
    print("\n=== HAPA MVP CLI MODE ===")
    print(json.dumps(runtime_info(), indent=2))

    while True:
        cmd = input("\nHAPA> ").strip()

        if cmd == "exit":
            break

        elif cmd == "status":
            print(json.dumps(runtime_info(), indent=2))

        elif cmd.startswith("ai "):
            prompt = cmd.replace("ai ", "")
            print("[AI MOCK RESPONSE]:", prompt)

        elif cmd == "help":
            print("""
Commands:
  status   - system status
  ai <msg> - test AI engine
  exit     - quit
            """)

        else:
            print("Unknown command. type 'help'")


# Web server mode
def run_server():
    if not HAS_SERVER:
        print("[HAPA] No server found, switching to CLI mode")
        cli_mode()
        return

    print("[HAPA] Starting API server...")

    try:
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8000)
    except Exception as e:
        print("[HAPA] Failed to start server:", e)
        cli_mode()


# ENTRY POINT
if __name__ == "__main__":
    print("\n======================")
    print("  HAPA MVP STARTING")
    print("======================\n")

    bootstrap_engine()

    mode = sys.argv[1] if len(sys.argv) > 1 else "server"

    if mode == "cli":
        cli_mode()
    else:
        run_server()

