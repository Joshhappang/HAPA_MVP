from typing import Dict, Any, Optional
import time
import uuid


class MiniFigmaAPIServer:

    def __init__(self):
        self.projects = {}
        self.sessions = {}
        self.routes = {}

    # =========================
    # ROUTER SYSTEM
    # =========================
    def route(self, path):

        def wrapper(func):
            self.routes[path] = func
            return func

        return wrapper

    def handle_request(self, path, payload=None):

        payload = payload or {}
        handler = self.routes.get(path)

        if not handler:
            return {"status": "error", "message": "route not found"}

        return handler(payload)

    # =========================
    # 🧠 AI ENGINE (AUTO LAYOUT CORE)
    # =========================
    def ai_generate(self, prompt: str):

        p = prompt.lower()

        # =========================
        # LOGIN PAGE
        # =========================
        if "login" in p:

            nodes = [
                {"type": "title", "text": "Login Page"},
                {"type": "input", "text": "Email"},
                {"type": "input", "text": "Password"},
                {"type": "button", "text": "Login"}
            ]

        # =========================
        # DASHBOARD
        # =========================
        elif "dashboard" in p:

            nodes = [
                {"type": "sidebar", "text": "Sidebar"},
                {"type": "navbar", "text": "Top Bar"},
                {"type": "card", "text": "Chart"},
                {"type": "card", "text": "Stats"}
            ]

        # =========================
        # LANDING PAGE
        # =========================
        elif "landing" in p:

            nodes = [
                {"type": "hero", "text": "Hero Section"},
                {"type": "button", "text": "Get Started"},
                {"type": "feature", "text": "Feature 1"},
                {"type": "feature", "text": "Feature 2"}
            ]

        # =========================
        # DEFAULT
        # =========================
        else:

            nodes = [
                {"type": "card", "text": "AI Block"}
            ]

        return {
            "prompt": prompt,
            "nodes": nodes,
            "count": len(nodes)
        }

    # =========================
    # ROUTES REGISTER
    # =========================
    def register_routes(self):

        @self.route("/ai/generate")
        def ai_route(payload):
            return self.ai_generate(payload.get("prompt", ""))

        @self.route("/project/create")
        def create_project(payload):
            pid = str(uuid.uuid4())[:8]

            self.projects[pid] = {
                "id": pid,
                "name": payload.get("name", "Untitled"),
                "created_at": time.time()
            }

            return self.projects[pid]

        @self.route("/session/create")
        def create_session(payload):
            sid = str(uuid.uuid4())[:8]

            self.sessions[sid] = {
                "id": sid,
                "user": payload.get("user", "guest"),
                "created_at": time.time()
            }

            return self.sessions[sid]

    # =========================
    # DEBUG
    # =========================
    def debug(self):

        print({
            "projects": len(self.projects),
            "sessions": len(self.sessions),
            "routes": list(self.routes.keys())
        })
