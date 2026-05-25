# =========================================
# HAPA MINI FIGMA - AI MEMORY ENGINE
# ai_tools/ai_memory.py
# =========================================

from typing import Dict, Any, List, Optional
import time
import uuid


class AIMemory:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # memory limits
            "max_items": 1000,

            # behavior
            "auto_summarize": False,

            "debug": False,

            **(options or {})
        }

        # in-memory storage
        self.memory: List[Dict[str, Any]] = []

        # quick lookup index
        self.index: Dict[str, Dict[str, Any]] = {}

    # =====================================
    # STORE MEMORY
    # =====================================

    def store(
        self,
        key: str,
        value: Any,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        item_id = self._uuid()

        item = {

            "id": item_id,

            "key": key,

            "value": value,

            "context": context,

            "timestamp": time.time()
        }

        self.memory.append(item)

        self.index[key] = item

        self._enforce_limit()

        return item

    # =====================================
    # GET MEMORY
    # =====================================

    def get(self, key: str) -> Optional[Any]:

        item = self.index.get(key)

        if item:

            return item["value"]

        return None

    # =====================================
    # SEARCH MEMORY
    # =====================================

    def search(self, keyword: str) -> List[Dict[str, Any]]:

        results = []

        for item in self.memory:

            if keyword.lower() in item["key"].lower():

                results.append(item)

        return results

    # =====================================
    # UPDATE MEMORY
    # =====================================

    def update(
        self,
        key: str,
        value: Any
    ) -> bool:

        if key not in self.index:

            return False

        item = self.index[key]

        item["value"] = value

        item["timestamp"] = time.time()

        return True

    # =====================================
    # DELETE MEMORY
    # =====================================

    def delete(self, key: str) -> bool:

        if key not in self.index:

            return False

        item = self.index.pop(key)

        self.memory = [

            m for m in self.memory

            if m["id"] != item["id"]
        ]

        return True

    # =====================================
    # CLEAR ALL
    # =====================================

    def clear(self):

        self.memory.clear()

        self.index.clear()

    # =====================================
    # LIMIT ENFORCEMENT
    # =====================================

    def _enforce_limit(self):

        if len(self.memory) <= self.options["max_items"]:

            return

        # remove oldest
        self.memory.sort(key=lambda x: x["timestamp"])

        while len(self.memory) > self.options["max_items"]:

            old = self.memory.pop(0)

            self.index.pop(old["key"], None)

    # =====================================
    # SIMPLE SUMMARY
    # =====================================

    def summarize(self) -> Dict[str, Any]:

        return {

            "total_items": len(self.memory),

            "keys": list(self.index.keys())[:50]
        }

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"mem-{uuid.uuid4().hex[:8]}"

    # =====================================
    # DEBUG
    # =====================================

    def debug(self):

        if not self.options["debug"]:
            return

        print("\n[AIMemory DEBUG]")
        print(self.summarize())
