from typing import Dict, Any, Optional
import time
import uuid
import hashlib


class AuthAPI:

    def __init__(self, server):

        self.server = server
        self.users: Dict[str, Dict[str, Any]] = {}
        self.sessions: Dict[str, Dict[str, Any]] = {}

    # =========================
    # REGISTER
    # =========================
    def register(self, username: str, password: str) -> Dict[str, Any]:

        if username in self.users:
            return self._error("User already exists")

        user_id = self._uuid()

        self.users[username] = {
            "id": user_id,
            "username": username,
            "password_hash": self._hash(password),
            "created_at": time.time(),

            # 💰 SUBSCRIPTION STATUS
            "plan": "free",
            "is_active": True
        }

        return {
            "status": "success",
            "user": {
                "id": user_id,
                "username": username,
                "plan": "free"
            }
        }

    # =========================
    # LOGIN
    # =========================
    def login(self, username: str, password: str) -> Dict[str, Any]:

        user = self.users.get(username)

        if not user:
            return self._error("User not found")

        if user["password_hash"] != self._hash(password):
            return self._error("Invalid password")

        session_id = self._uuid()

        self.sessions[session_id] = {
            "session_id": session_id,
            "user_id": user["id"],
            "username": username,

            # 💰 penting untuk subscription check
            "plan": user.get("plan", "free"),

            "created_at": time.time(),
            "last_active": time.time()
        }

        return {
            "status": "success",
            "session": self.sessions[session_id]
        }

    # =========================
    # VERIFY SESSION
    # =========================
    def verify(self, session_id: str) -> bool:

        session = self.sessions.get(session_id)

        if not session:
            return False

        session["last_active"] = time.time()
        return True

    # =========================
    # UPGRADE TO PRO (STRIPE CALLBACK)
    # =========================
    def upgrade_to_pro(self, username: str) -> Dict[str, Any]:

        user = self.users.get(username)

        if not user:
            return self._error("User not found")

        user["plan"] = "pro"

        # update session juga
        for sid, s in self.sessions.items():
            if s["username"] == username:
                s["plan"] = "pro"

        return {
            "status": "success",
            "message": "Upgraded to PRO",
            "plan": "pro"
        }

    # =========================
    # LOGOUT
    # =========================
    def logout(self, session_id: str) -> Dict[str, Any]:

        if session_id in self.sessions:
            del self.sessions[session_id]
            return {"status": "logged_out"}

        return self._error("Session not found")

    # =========================
    # USER DATA
    # =========================
    def get_user(self, username: str) -> Optional[Dict[str, Any]]:
        return self.users.get(username)

    def list_users(self) -> Dict[str, Any]:
        return {
            "users": [
                {
                    "id": u["id"],
                    "username": u["username"],
                    "plan": u.get("plan", "free")
                }
                for u in self.users.values()
            ]
        }

    # =========================
    # SECURITY
    # =========================
    def _hash(self, text: str) -> str:
        return hashlib.sha256(text.encode("utf-8")).hexdigest()

    def _error(self, message: str) -> Dict[str, Any]:
        return {
            "status": "error",
            "message": message,
            "timestamp": time.time()
        }

    def _uuid(self) -> str:
        return f"authapi-{uuid.uuid4().hex[:8]}"
