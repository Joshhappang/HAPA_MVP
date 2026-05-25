# =========================================
# HAPA MINI FIGMA - SAVE API
# api/save_api.py
# =========================================

from typing import Dict, Any, Optional
import time
import uuid
import json


class SaveAPI:

    def __init__(self, server=None):

        self.server = server

        # mock storage (like database / disk)
        self.storage: Dict[str, Dict[str, Any]] = {}

    # =====================================
    # SAVE DATA
    # =====================================

    def save(self, key: str, data: Dict[str, Any]) -> Dict[str, Any]:

        record = {

            "key": key,

            "data": data,

            "saved_at": time.time()
        }

        self.storage[key] = record

        return {

            "status": "success",

            "key": key,

            "timestamp": record["saved_at"]
        }

    # =====================================
    # LOAD DATA
    # =====================================

    def load(self, key: str) -> Optional[Dict[str, Any]]:

        record = self.storage.get(key)

        if not record:

            return None

        return record["data"]

    # =====================================
    # DELETE DATA
    # =====================================

    def delete(self, key: str) -> bool:

        if key not in self.storage:

            return False

        del self.storage[key]

        return True

    # =====================================
    # LIST KEYS
    # =====================================

    def list_keys(self) -> Dict[str, Any]:

        return {

            "keys": list(self.storage.keys())
        }

    # =====================================
    # EXPORT ALL
    # =====================================

    def export_all(self) -> Dict[str, Any]:

        return {

            "type": "SAVE_EXPORT",

            "timestamp": time.time(),

            "data": self.storage
        }

    # =====================================
    # IMPORT DATA
    # =====================================

    def import_data(self, data: Dict[str, Any]):

        if not isinstance(data, dict):

            return {

                "status": "error",

                "message": "Invalid data format"
            }

        self.storage.update(data)

        return {

            "status": "success",

            "imported": len(data)
        }

    # =====================================
    # CLEAR STORAGE
    # =====================================

    def clear(self):

        self.storage.clear()

    # =====================================
    # TO JSON
    # =====================================

    def to_json(self) -> str:

        return json.dumps(self.storage, indent=2, default=str)

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"saveapi-{uuid.uuid4().hex[:8]}"
