/* =========================================
   HAPA MINI FIGMA - COLLABORATION SERVICE
   frontend/services/collaborationService.js
========================================= */

class CollaborationService {
    constructor(apiClient, eventBus) {
        this.api = apiClient;
        this.eventBus = eventBus;

        this.socket = null;
        this.isConnected = false;

        this.userId = this._generateUserId();
        this.roomId = null;
    }

    /* =========================
       INIT CONNECTION
    ========================= */

    connect(wsUrl) {
        try {
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                this.isConnected = true;

                this.eventBus?.emit("collab:connected", {
                    userId: this.userId
                });
            };

            this.socket.onmessage = (msg) => {
                this._handleMessage(msg);
            };

            this.socket.onclose = () => {
                this.isConnected = false;

                this.eventBus?.emit("collab:disconnected");
            };

            this.socket.onerror = (err) => {
                console.error("[HAPA COLLAB ERROR]", err);

                this.eventBus?.emit("collab:error", err);
            };

        } catch (err) {
            console.error("[HAPA COLLAB INIT ERROR]", err);
        }
    }

    /* =========================
       JOIN ROOM
    ========================= */

    joinRoom(roomId) {
        this.roomId = roomId;

        this._send({
            type: "join",
            roomId,
            userId: this.userId
        });
    }

    /* =========================
       SEND CANVAS UPDATE
    ========================= */

    sendCanvasUpdate(data) {
        this._send({
            type: "canvas:update",
            roomId: this.roomId,
            userId: this.userId,
            data
        });
    }

    /* =========================
       SEND CURSOR POSITION
    ========================= */

    sendCursor(x, y) {
        this._send({
            type: "cursor",
            roomId: this.roomId,
            userId: this.userId,
            x,
            y
        });
    }

    /* =========================
       HANDLE INCOMING MESSAGE
    ========================= */

    _handleMessage(msg) {
        try {
            const data = JSON.parse(msg.data);

            switch (data.type) {

                case "canvas:update":
                    this.eventBus?.emit("collab:canvas-update", data);
                    break;

                case "cursor":
                    this.eventBus?.emit("collab:cursor", data);
                    break;

                case "user:join":
                    this.eventBus?.emit("collab:user-join", data);
                    break;

                case "user:leave":
                    this.eventBus?.emit("collab:user-leave", data);
                    break;

                default:
                    console.log("[HAPA COLLAB MSG]", data);
            }

        } catch (err) {
            console.error("[HAPA COLLAB MESSAGE ERROR]", err);
        }
    }

    /* =========================
       SEND HELPER
    ========================= */

    _send(payload) {
        if (!this.socket || this.socket.readyState !== 1) return;

        this.socket.send(JSON.stringify(payload));
    }

    /* =========================
       USER ID GENERATOR
    ========================= */

    _generateUserId() {
        return "user_" + Math.random().toString(36).substring(2, 10);
    }

    /* =========================
       STATUS CHECK
    ========================= */

    isOnline() {
        return this.isConnected;
    }
}

/* =========================================
   GLOBAL EXPORT
========================================= */

window.CollaborationService = CollaborationService;
