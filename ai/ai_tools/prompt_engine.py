# =========================================
# HAPA MINI FIGMA - PROMPT ENGINE
# ai_tools/prompt_engine.py
# =========================================

import re
import json
import time
from typing import Dict, Any, List, Optional


class PromptEngine:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # default system behavior
            "max_tokens": 2048,
            "temperature": 0.7,

            # safety / filtering
            "enable_filter": True,
            "blocked_keywords": [],

            # prompt formatting
            "use_system_prompt": True,

            # logging
            "debug": False,

            **(options or {})
        }

        self.history: List[Dict[str, Any]] = []

    # =====================================
    # MAIN ENTRY
    # =====================================

    def build_prompt(
        self,
        user_input: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        system_prompt = self._build_system_prompt(context)

        user_prompt = self._build_user_prompt(user_input, context)

        final_prompt = {
            "system": system_prompt,
            "user": user_prompt,
            "meta": {
                "timestamp": time.time(),
                "version": self.options["version"]
            }
        }

        self.history.append(final_prompt)

        return final_prompt

    # =====================================
    # SYSTEM PROMPT
    # =====================================

    def _build_system_prompt(self, context: Dict[str, Any]) -> str:

        base = [
            "You are HAPA AI, an assistant integrated into MINI FIGMA.",
            "You help with vector design, rendering logic, animation, and editor systems.",
            "Respond clearly, structurally, and technically when needed."
        ]

        if context.get("mode") == "code":

            base.append(
                "You are in CODE MODE: return clean production-ready code."
            )

        if context.get("mode") == "design":

            base.append(
                "You are in DESIGN MODE: focus on UI/UX structure and layout systems."
            )

        if context.get("strict"):

            base.append(
                "Strict mode enabled: avoid explanations, return only output."
            )

        return "\n".join(base)

    # =====================================
    # USER PROMPT BUILDER
    # =====================================

    def _build_user_prompt(
        self,
        user_input: str,
        context: Dict[str, Any]
    ) -> str:

        cleaned = self._sanitize(user_input)

        prompt = f"""
Task: {cleaned}

Context:
{json.dumps(context, indent=2)}

Instruction:
Follow MINI FIGMA architecture patterns (Renderer, Exporter, Physics, Gestures, Animation).
"""

        return prompt.strip()

    # =====================================
    # SANITIZATION
    # =====================================

    def _sanitize(self, text: str) -> str:

        text = text.strip()

        # remove excessive whitespace
        text = re.sub(r"\s+", " ", text)

        if self.options["enable_filter"]:

            for word in self.options["blocked_keywords"]:

                text = text.replace(word, "***")

        return text

    # =====================================
    # PROMPT VALIDATION
    # =====================================

    def validate(self, prompt: Dict[str, Any]) -> bool:

        if not prompt.get("user"):
            return False

        if len(prompt["user"]) > self.options["max_tokens"] * 4:
            return False

        return True

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, prompt: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[PromptEngine DEBUG]")
        print("SYSTEM:\n", prompt.get("system"))
        print("USER:\n", prompt.get("user"))
        print("META:\n", prompt.get("meta"))

    # =====================================
    # HISTORY
    # =====================================

    def get_history(self) -> List[Dict[str, Any]]:

        return self.history

    def clear_history(self):

        self.history = []
