# =========================================
# HAPA MINI FIGMA - SYNC API
# api/sync_api.py
# =========================================

from typing import Dict, Any, Optional, List
import time
import uuid
import copy


class SyncAPI:

    def __init__(self, server=None):

        self.server = server

        # global sync state store
        self.state: Dict[str, Any] = {

            "documents": {},

            "clients": {},

            "last_sync": None
        }

        # sync history log
        self.history: List[Dict[str, Any]] = []

    # =====================================
    # PUSH STATE
    # =====================================

    def push(self, client_id: str, data: Dict[str, Any]) -> Dict[str, Any]:

        sync_id = self._uuid()

        # update server state
        self.state["documents"][client_id] = {

            "data": data,

            "updated_at": time.time()
        }

        record = {

            "id": sync_id,

            "client_id": client_id,

            "type": "PUSH",

            "data": copy.deepcopy(data),

            "timestamp": time.time()
        }

        self.history.append(record)

        self.state["last_sync"] = record

        return {

            "status": "success",

            "sync_id": sync_id,

            "type": "PUSH"
        }

    # =====================================
    # PULL STATE
    # =====================================

    def pull(self, client_id: str) -> Dict[str, Any]:

        doc = self.state["documents"].get(client_id)

        record = {

            "id": self._uuid(),

            "client_id": client_id,

            "type": "PULL",

            "timestamp": time.time()
        }

        self.history.append(record)

        return {

            "status": "success",

            "data": doc
        }

    # =====================================
    # BROADCAST SYNC
    # =====================================

    def broadcast(self, data: Dict[str, Any]):

        sync_id = self._uuid()

        record = {

            "id": sync_id,

            "type": "BROADCAST",

            "data": copy.deepcopy(data),

            "timestamp": time.time()
        }

        self.history.append(record)

        self.state["last_sync"] = record

        return {

            "status": "broadcasted",

            "sync_id": sync_id
        }

    # =====================================
    # GET FULL STATE
    # =====================================

    def get_state(self) -> Dict[str, Any]:

        return self.state

    # =====================================
    # GET HISTORY
    # =====================================

    def get_history(self) -> List[Dict[str, Any]]:

        return self.history

    # =====================================
    # CLEAR STATE
    # =====================================

    def clear(self):

        self.state = {

            "documents": {},

            "clients": {},

            "last_sync": None
        }

        self.history.clear()

    # =====================================
    # DIFF (SIMPLE)
    # =====================================

    def diff(self, old: Dict[str, Any], new: Dict[str, Any]) -> Dict[str, Any]:

        changes = {}

        for k in set(old.keys()).union(new.keys()):

            if old.get(k) != new.get(k):

                changes[k] = {

                    "old": old.get(k),

                    "new": new.get(k)
                }

        return changes

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"syncapi-{uuid.uuid4().hex[:8]}"
