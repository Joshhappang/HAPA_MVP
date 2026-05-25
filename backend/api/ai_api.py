# =========================================
# HAPA MINI FIGMA - AI API
# api/ai_api.py
# =========================================

from typing import Dict, Any, Optional
import time
import uuid


class AIApi:

    def __init__(self, server):

        self.server = server

        # registry for AI tools (layout_ai, color_ai, etc)
        self.tools: Dict[str, Any] = {}

    # =====================================
    # REGISTER AI TOOL
    # =====================================

    def register_tool(self, name: str, tool: Any):

        self.tools[name] = tool

    # =====================================
    # CALL TOOL
    # =====================================

    def call_tool(self, name: str, payload: Dict[str, Any]) -> Dict[str, Any]:

        tool = self.tools.get(name)

        if not tool:

            return self._error(f"AI tool not found: {name}")

        try:

            result = self._execute(tool, payload)

            return {

                "status": "success",

                "tool": name,

                "timestamp": time.time(),

                "result": result
            }

        except Exception as e:

            return self._error(str(e))

    # =====================================
    # EXECUTE TOOL SAFELY
    # =====================================

    def _execute(self, tool: Any, payload: Dict[str, Any]) -> Any:

        # layout AI
        if hasattr(tool, "generate_layout"):

            return tool.generate_layout(payload)

        # component AI
        if hasattr(tool, "generate_component"):

            return tool.generate_component(

                payload.get("name", "Component"),

                payload
            )

        # frame AI
        if hasattr(tool, "generate_frame"):

            return tool.generate_frame(

                payload.get("name", "Frame"),

                payload
            )

        # generic callable
        if callable(tool):

            return tool(payload)

        return tool

    # =====================================
    # BATCH AI CALLS
    # =====================================

    def batch_call(self, requests: list) -> Dict[str, Any]:

        results = []

        for req in requests:

            name = req.get("tool")

            payload = req.get("payload", {})

            results.append(self.call_tool(name, payload))

        return {

            "status": "batch_success",

            "count": len(results),

            "results": results
        }

    # =====================================
    # LIST TOOLS
    # =====================================

    def list_tools(self) -> Dict[str, Any]:

        return {

            "tools": list(self.tools.keys())
        }

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

        return f"aiapi-{uuid.uuid4().hex[:8]}"
