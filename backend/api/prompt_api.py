# =========================================
# HAPA MINI FIGMA - PROMPT API
# api/prompt_api.py
# =========================================

from typing import Dict, Any, Optional, List
import time
import uuid


class PromptAPI:

    def __init__(self, ai_api=None):

        self.ai_api = ai_api

        # prompt history storage
        self.prompts: List[Dict[str, Any]] = []

    # =====================================
    # SEND PROMPT
    # =====================================

    def send_prompt(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:

        request_id = self._uuid()

        payload = {

            "prompt": prompt,

            "context": context or {},

            "timestamp": time.time()
        }

        result = None

        # if AI API exists, try route to AI system
        if self.ai_api and hasattr(self.ai_api, "call_tool"):

            result = self._route_to_ai(prompt, context)

        record = {

            "id": request_id,

            "prompt": prompt,

            "context": context,

            "result": result,

            "timestamp": time.time()
        }

        self.prompts.append(record)

        return {

            "status": "success",

            "request_id": request_id,

            "result": result
        }

    # =====================================
    # ROUTE TO AI
    # =====================================

    def _route_to_ai(self, prompt: str, context: Optional[Dict[str, Any]]) -> Any:

        # simple heuristic routing
        lower = prompt.lower()

        if "layout" in lower:

            return self.ai_api.call_tool("layout_ai", {"prompt": prompt, "context": context})

        if "color" in lower:

            return self.ai_api.call_tool("color_ai", {"prompt": prompt, "context": context})

        if "typography" in lower:

            return self.ai_api.call_tool("typography_ai", {"prompt": prompt, "context": context})

        if "component" in lower:

            return self.ai_api.call_tool("component_ai", {"prompt": prompt, "context": context})

        if "frame" in lower:

            return self.ai_api.call_tool("frame_ai", {"prompt": prompt, "context": context})

        # fallback generic AI call
        return self.ai_api.call_tool("generic_ai", {

            "prompt": prompt,

            "context": context
        })

    # =====================================
    # GET PROMPT HISTORY
    # =====================================

    def get_history(self) -> List[Dict[str, Any]]:

        return self.prompts

    # =====================================
    # CLEAR HISTORY
    # =====================================

    def clear_history(self):

        self.prompts.clear()

    # =====================================
    # LAST PROMPT
    # =====================================

    def last_prompt(self) -> Optional[Dict[str, Any]]:

        if not self.prompts:

            return None

        return self.prompts[-1]

    # =====================================
    # STATS
    # =====================================

    def stats(self) -> Dict[str, Any]:

        return {

            "total_prompts": len(self.prompts)
        }

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"promptapi-{uuid.uuid4().hex[:8]}"
