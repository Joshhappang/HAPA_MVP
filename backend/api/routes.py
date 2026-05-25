# =========================================
# HAPA MINI FIGMA - API SERVER
# api/server.py
# =========================================

from typing import Dict, Any, Optional
import time
import uuid


class MiniFigmaAPIServer:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # server config
            "name": "HAPA Mini Figma API",
            "debug": False,

            **(options or {})
        }

        # in-memory storage (mock DB)
        self.projects: Dict[str, Dict[str, Any]] = {}
        self.sessions: Dict[str, Dict[str, Any]] = {}

        self.routes = {}

    # =====================================
    # ROUTE REGISTRATION
    # =====================================

    def route(self, path: str):

        def wrapper(func):

            self.routes[path] = func

            return func

        return wrapper

    # =====================================
    # HANDLE REQUEST
    # =====================================

    def handle_request(
        self,
        path: str,
        payload: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        payload = payload or {}

        handler = self.routes.get(path)

        if not handler:

            return self._response_error("Route not found", path)

        try:

            result = handler(payload)

            return self._response_success(path, result)

        except Exception as e:

            return self._response_error(str(e), path)

    # =====================================
    # RESPONSE SUCCESS
    # =====================================

    def _response_success(self, path: str, data: Any) -> Dict[str, Any]:

        return {

            "status": "success",

            "path": path,

            "timestamp": time.time(),

            "data": data
        }

    # =====================================
    # RESPONSE ERROR
    # =====================================

    def _response_error(self, message: str, path: str) -> Dict[str, Any]:

        return {

            "status": "error",

            "path": path,

            "message": message,

            "timestamp": time.time()
        }

    # =====================================
    # PROJECT CRUD
    # =====================================

    def create_project(self, name: str) -> Dict[str, Any]:

        project_id = self._uuid()

        project = {

            "id": project_id,

            "name": name,

            "created_at": time.time(),

            "frames": {},

            "components": {}
        }

        self.projects[project_id] = project

        return project

    def get_project(self, project_id: str) -> Optional[Dict[str, Any]]:

        return self.projects.get(project_id)

    def update_project(self, project_id: str, data: Dict[str, Any]):

        if project_id not in self.projects:

            return None

        self.projects[project_id].update(data)

        return self.projects[project_id]

    def delete_project(self, project_id: str) -> bool:

        if project_id not in self.projects:

            return False

        del self.projects[project_id]

        return True

    # =====================================
    # SESSION
    # =====================================

    def create_session(self, user: str) -> Dict[str, Any]:

        session_id = self._uuid()

        session = {

            "id": session_id,

            "user": user,

            "created_at": time.time()
        }

        self.sessions[session_id] = session

        return session

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:

        return self.sessions.get(session_id)

    # =====================================
    # MOCK API ENDPOINTS
    # =====================================

    def register_default_routes(self):

        @self.route("/project/create")
        def create_project_route(payload):

            return self.create_project(payload.get("name", "Untitled"))

        @self.route("/project/get")
        def get_project_route(payload):

            return self.get_project(payload.get("id"))

        @self.route("/project/update")
        def update_project_route(payload):

            return self.update_project(
                payload.get("id"),
                payload.get("data", {})
            )

        @self.route("/project/delete")
        def delete_project_route(payload):

            return self.delete_project(payload.get("id"))

        @self.route("/session/create")
        def session_create_route(payload):

            return self.create_session(payload.get("user", "guest"))

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"api-{uuid.uuid4().hex[:8]}"

    # =====================================
    # DEBUG
    # =====================================

    def debug(self):

        if not self.options["debug"]:
            return

        print("\n[MiniFigmaAPIServer DEBUG]")
        print({
            "projects": len(self.projects),
            "sessions": len(self.sessions),
            "routes": list(self.routes.keys())
        })
