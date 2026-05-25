# =========================================
# HAPA MINI FIGMA - AI ROUTER ENGINE
# ai_tools/ai_router.py
# =========================================

from typing import Dict, Any, Optional
import time


class AIRouter:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # routing behavior
            "strict_mode": False,

            # debug
            "debug": False,

            **(options or {})
        }

        # registered tools
        self.tools: Dict[str, Any] = {}

    # =====================================
    # REGISTER TOOL
    # =====================================

    def register_tool(self, name: str, tool: Any):

        self.tools[name] = tool

    # =====================================
    # ROUTE REQUEST
    # =====================================

    def route(
        self,
        request: Dict[str, Any]
    ) -> Dict[str, Any]:

        tool_name = request.get("tool")

        payload = request.get("payload", {})

        if not tool_name:

            return self._error("No tool specified")

        tool = self.tools.get(tool_name)

        if not tool:

            return self._error(f"Tool not found: {tool_name}")

        # execute tool safely
        result = self._execute(tool, payload)

        return {

            "type": "HAPA_ROUTE",

            "tool": tool_name,

            "timestamp": time.time(),

            "result": result
        }

    # =====================================
    # SAFE EXECUTION
    # =====================================

    def _execute(self, tool: Any, payload: Dict[str, Any]) -> Any:

        try:

            if hasattr(tool, "run"):

                return tool.run(payload)

            if callable(tool):

                return tool(payload)

            return tool

        except Exception as e:

            return self._error(str(e))

    # =====================================
    # ERROR HANDLER
    # =====================================

    def _error(self, message: str) -> Dict[str, Any]:

        return {

            "type": "HAPA_ERROR",

            "message": message,

            "timestamp": time.time()
        }

    # =====================================
    # LIST TOOLS
    # =====================================

    def list_tools(self) -> Dict[str, Any]:

        return {

            "tools": list(self.tools.keys())
        }

    # =====================================
    # DEBUG
    # =====================================

    def debug(self):

        if not self.options["debug"]:
            return

        print("\n[AIRouter DEBUG]")
        print(self.list_tools())
