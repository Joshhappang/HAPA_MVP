# =========================================
# HAPA MINI FIGMA - VOICE AI ENGINE
# ai_tools/voice_ai.py
# =========================================

from typing import Dict, Any, List, Optional
import time
import uuid


class VoiceAI:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # voice settings
            "default_voice": "en-US",
            "default_speed": 1.0,
            "default_pitch": 1.0,

            # behavior
            "auto_cache": True,

            "debug": False,

            **(options or {})
        }

        self.cache: Dict[str, Dict[str, Any]] = {}

    # =====================================
    # MAIN SPEECH GENERATION
    # =====================================

    def speak(
        self,
        text: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        voice_id = self._uuid()

        speech = {
            "type": "HAPA_VOICE",
            "version": self.options["version"],
            "id": voice_id,
            "timestamp": time.time(),

            "text": text,

            "voice": context.get("voice", self.options["default_voice"]),

            "speed": context.get("speed", self.options["default_speed"]),

            "pitch": context.get("pitch", self.options["default_pitch"]),

            "audio": self._generate_placeholder_audio(text, voice_id)
        }

        if self.options["auto_cache"]:

            self.cache[voice_id] = speech

        return speech

    # =====================================
    # AUDIO PLACEHOLDER GENERATOR
    # =====================================

    def _generate_placeholder_audio(self, text: str, voice_id: str) -> str:

        safe = text.replace(" ", "+")[:30]

        return f"https://hapa.ai/voice/{voice_id}?q={safe}"

    # =====================================
    # BATCH SPEAK
    # =====================================

    def speak_batch(
        self,
        texts: List[str],
        context: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:

        return [
            self.speak(t, context)
            for t in texts
        ]

    # =====================================
    # STOP (SIMULATED)
    # =====================================

    def stop(self) -> Dict[str, Any]:

        return {
            "type": "HAPA_VOICE_STOP",
            "timestamp": time.time(),
            "status": "stopped"
        }

    # =====================================
    # CACHE GET
    # =====================================

    def get(self, voice_id: str) -> Optional[Dict[str, Any]]:

        return self.cache.get(voice_id)

    def clear_cache(self):

        self.cache.clear()

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"voice-{uuid.uuid4().hex[:8]}"

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, output: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[VoiceAI DEBUG]")
        print(output)
