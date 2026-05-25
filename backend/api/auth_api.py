# =========================================
# HAPA MINI FIGMA - AUTH API
# api/auth_api.py
# =========================================

from typing import Dict, Any, Optional
import time
import uuid
import hashlib


class AuthAPI:

    def __init__(self, server):

        self.server = server

        # user storage (mock DB)
        self.users: Dict[str, Dict[str, Any]] = {}

        # session storage
        self.sessions: Dict[str, Dict[str, Any]] = {}

    # =====================================
    # REGISTER USER
    # =====================================

    def register(self, username: str, password: str) -> Dict[str, Any]:

        if username in self.users:

            return self._error("User already exists")

        user_id = self._uuid()

        user = {

            "id": user_id,

            "username": username,

            "password_hash": self._hash(password),

            "created_at": time.time()
        }

        self.users[username] = user

        return {

            "status": "success",

            "user": {
                "id": user_id,
                "username": username
            }
        }

    # =====================================
    # LOGIN
    # =====================================

    def login(self, username: str, password: str) -> Dict[str, Any]:

        user = self.users.get(username)

        if not user:

            return self._error("User not found")

        if user["password_hash"] != self._hash(password):

            return self._error("Invalid password")

        session_id = self._uuid()

        session = {

            "session_id": session_id,

            "user_id": user["id"],

            "username": username,

            "created_at": time.time(),

            "last_active": time.time()
        }

        self.sessions[session_id] = session

        return {

            "status": "success",

            "session": session
        }

    # =====================================
    # VERIFY SESSION
    # =====================================

    def verify(self, session_id: str) -> bool:

        session = self.sessions.get(session_id)

        if not session:

            return False

        session["last_active"] = time.time()

        return True

    # =====================================
    # LOGOUT
    # =====================================

    def logout(self, session_id: str) -> Dict[str, Any]:

        if session_id in self.sessions:

            self.sessions.pop(session_id)

            return {

                "status": "logged_out"
            }

        return self._error("Session not found")

    # =====================================
    # GET USER
    # =====================================

    def get_user(self, username: str) -> Optional[Dict[str, Any]]:

        return self.users.get(username)

    # =====================================
    # LIST USERS
    # =====================================

    def list_users(self) -> Dict[str, Any]:

        return {

            "users": [
                {
                    "id": u["id"],
                    "username": u["username"]
                }
                for u in self.users.values()
            ]
        }

    # =====================================
    # HASH PASSWORD
    # =====================================

    def _hash(self, text: str) -> str:

        return hashlib.sha256(text.encode("utf-8")).hexdigest()

    # =====================================
    # ERROR HANDLER
    # =====================================

    def _error(self, message: str) -> Dict[str, Any]:

        return {

            "status": "error",

            "message": message,

            "timestamp": time.time()
        }

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"authapi-{uuid.uuid4().hex[:8]}"
