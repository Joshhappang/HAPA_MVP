# =========================================
# HAPA MINI FIGMA - WEBSOCKET API
# api/websocket_api.py
# =========================================

from typing import Dict, Any, Optional, Callable, List
import time
import uuid
import threading


class WebSocketAPI:

    def __init__(self, server=None, options: Optional[Dict[str, Any]] = None):

        self.server = server

        self.options = {
            "version": "1.0.0",

            # behavior
            "auto_broadcast": True,

            "debug": False,

            **(options or {})
        }

        # connected clients (mock)
        self.clients: Dict[str, Dict[str, Any]] = {}

        # event listeners
        self.listeners: Dict[str, List[Callable]] = {}

        # message queue
        self.queue: List[Dict[str, Any]] = []

        self.running = False
        self._thread = None

    # =====================================
    # CONNECT CLIENT
    # =====================================

    def connect_client(self, user: str) -> Dict[str, Any]:

        client_id = self._uuid()

        client = {

            "id": client_id,

            "user": user,

            "connected_at": time.time(),

            "last_ping": time.time()
        }

        self.clients[client_id] = client

        self._emit("connect", client)

        return client

    # =====================================
    # DISCONNECT CLIENT
    # =====================================

    def disconnect_client(self, client_id: str) -> bool:

        if client_id not in self.clients:

            return False

        client = self.clients.pop(client_id)

        self._emit("disconnect", client)

        return True

    # =====================================
    # SEND MESSAGE
    # =====================================

    def send(self, event: str, data: Any):

        message = {

            "id": self._uuid(),

            "event": event,

            "data": data,

            "timestamp": time.time()
        }

        if self.options["auto_broadcast"]:

            self.broadcast(message)

        else:

            self.queue.append(message)

    # =====================================
    # BROADCAST
    # =====================================

    def broadcast(self, message: Dict[str, Any]):

        self._emit("broadcast", message)

    # =====================================
    # START LOOP (SIMULATED SERVER TICK)
    # =====================================

    def start(self):

        if self.running:

            return

        self.running = True

        self._thread = threading.Thread(

            target=self._loop,

            daemon=True
        )

        self._thread.start()

    # =====================================
    # STOP LOOP
    # =====================================

    def stop(self):

        self.running = False

    # =====================================
    # LOOP
    # =====================================

    def _loop(self):

        while self.running:

            time.sleep(0.5)

            self._heartbeat()

    # =====================================
    # HEARTBEAT
    # =====================================

    def _heartbeat(self):

        now = time.time()

        for client in self.clients.values():

            client["last_ping"] = now

    # =====================================
    # EVENT SYSTEM
    # =====================================

    def on(self, event: str, handler: Callable):

        if event not in self.listeners:

            self.listeners[event] = []

        self.listeners[event].append(handler)

    # =====================================
    # EMIT EVENT
    # =====================================

    def _emit(self, event: str, data: Any):

        handlers = self.listeners.get(event, [])

        for h in handlers:

            try:

                h(data)

            except Exception as e:

                if self.options["debug"]:

                    print("[WebSocketAPI ERROR]", e)

    # =====================================
    # GET CLIENTS
    # =====================================

    def list_clients(self) -> List[Dict[str, Any]]:

        return list(self.clients.values())

    # =====================================
    # STATUS
    # =====================================

    def status(self) -> Dict[str, Any]:

        return {

            "clients": len(self.clients),

            "queue": len(self.queue),

            "running": self.running
        }

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"wsapi-{uuid.uuid4().hex[:8]}"
