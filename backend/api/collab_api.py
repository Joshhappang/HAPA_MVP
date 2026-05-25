# =========================================
# HAPA MINI FIGMA - COLLABORATION API
# api/collab_api.py
# =========================================

from typing import Dict, Any, Optional, List, Callable
import time
import uuid


class CollabAPI:

    def __init__(self, server):

        self.server = server

        # rooms storage
        self.rooms: Dict[str, Dict[str, Any]] = {}

        # presence tracking
        self.presence: Dict[str, Dict[str, Any]] = {}

    # =====================================
    # CREATE ROOM
    # =====================================

    def create_room(self, name: str = "Untitled Room") -> Dict[str, Any]:

        room_id = self._uuid()

        room = {

            "id": room_id,

            "name": name,

            "created_at": time.time(),

            "users": {},

            "events": []
        }

        self.rooms[room_id] = room

        return room

    # =====================================
    # JOIN ROOM
    # =====================================

    def join_room(self, room_id: str, user: str) -> Dict[str, Any]:

        room = self.rooms.get(room_id)

        if not room:

            return self._error("Room not found")

        user_id = self._uuid()

        user_data = {

            "id": user_id,

            "name": user,

            "joined_at": time.time(),

            "cursor": {"x": 0, "y": 0}
        }

        room["users"][user_id] = user_data

        self.presence[user_id] = user_data

        return {

            "status": "joined",

            "room_id": room_id,

            "user": user_data
        }

    # =====================================
    # LEAVE ROOM
    # =====================================

    def leave_room(self, room_id: str, user_id: str) -> Dict[str, Any]:

        room = self.rooms.get(room_id)

        if not room:

            return self._error("Room not found")

        if user_id in room["users"]:

            user = room["users"].pop(user_id)

            self.presence.pop(user_id, None)

            return {

                "status": "left",

                "user": user
            }

        return self._error("User not in room")

    # =====================================
    # UPDATE CURSOR
    # =====================================

    def update_cursor(self, user_id: str, x: float, y: float):

        if user_id in self.presence:

            self.presence[user_id]["cursor"] = {

                "x": x,
                "y": y
            }

    # =====================================
    # BROADCAST EVENT
    # =====================================

    def broadcast(self, room_id: str, event: str, data: Any):

        room = self.rooms.get(room_id)

        if not room:

            return self._error("Room not found")

        event_obj = {

            "id": self._uuid(),

            "event": event,

            "data": data,

            "timestamp": time.time()
        }

        room["events"].append(event_obj)

        return event_obj

    # =====================================
    # GET ROOM STATE
    # =====================================

    def get_room(self, room_id: str) -> Optional[Dict[str, Any]]:

        return self.rooms.get(room_id)

    # =====================================
    # LIST ROOMS
    # =====================================

    def list_rooms(self) -> List[Dict[str, Any]]:

        return list(self.rooms.values())

    # =====================================
    # PRESENCE SNAPSHOT
    # =====================================

    def get_presence(self) -> Dict[str, Any]:

        return self.presence

    # =====================================
    # ERROR
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

        return f"collabapi-{uuid.uuid4().hex[:8]}"
