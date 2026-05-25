# =========================================
# HAPA MINI FIGMA - AI SECURITY ENGINE
# ai_tools/ai_security.py
# =========================================

from typing import Dict, Any, List, Optional
import time
import re
import hashlib


class AISecurity:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # security rules
            "enable_sanitize": True,
            "enable_rate_limit": False,

            # blocked patterns
            "blocked_patterns": [
                r"eval\(",
                r"exec\(",
                r"import os",
                r"subprocess",
                r"rm -rf"
            ],

            # debug
            "debug": False,

            **(options or {})
        }

        self.request_log: List[Dict[str, Any]] = []

    # =====================================
    # MAIN SECURITY CHECK
    # =====================================

    def validate(
        self,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:

        text = str(payload)

        result = {
            "safe": True,
            "warnings": [],
            "hash": self._hash(payload)
        }

        # check patterns
        for pattern in self.options["blocked_patterns"]:

            if re.search(pattern, text):

                result["safe"] = False

                result["warnings"].append(f"Blocked pattern detected: {pattern}")

        return result

    # =====================================
    # SANITIZE INPUT
    # =====================================

    def sanitize(self, text: str) -> str:

        if not self.options["enable_sanitize"]:
            return text

        cleaned = text

        for pattern in self.options["blocked_patterns"]:

            cleaned = re.sub(pattern, "[BLOCKED]", cleaned)

        return cleaned

    # =====================================
    # RATE LIMIT (SIMPLE)
    # =====================================

    def check_rate_limit(self, user_id: str, limit: int = 60) -> bool:

        now = time.time()

        window = 60  # seconds

        self.request_log = [
            r for r in self.request_log
            if now - r["time"] < window
        ]

        user_requests = [
            r for r in self.request_log
            if r["user"] == user_id
        ]

        if len(user_requests) >= limit:
            return False

        self.request_log.append({
            "user": user_id,
            "time": now
        })

        return True

    # =====================================
    # HASH PAYLOAD
    # =====================================

    def _hash(self, payload: Any) -> str:

        raw = str(payload).encode("utf-8")

        return hashlib.sha256(raw).hexdigest()

    # =====================================
    # AUDIT LOG
    # =====================================

    def audit(self, event: Dict[str, Any]):

        event["timestamp"] = time.time()

        self.request_log.append(event)

    # =====================================
    # GET LOGS
    # =====================================

    def logs(self) -> List[Dict[str, Any]]:

        return self.request_log

    # =====================================
    # DEBUG
    # =====================================

    def debug(self):

        if not self.options["debug"]:
            return

        print("\n[AISecurity DEBUG]")
        print({
            "logs": len(self.request_log),
            "patterns": len(self.options["blocked_patterns"])
        })
