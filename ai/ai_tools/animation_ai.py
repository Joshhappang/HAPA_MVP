# =========================================
# HAPA MINI FIGMA - ANIMATION AI ENGINE
# ai_tools/animation_ai.py
# =========================================

from typing import Dict, Any, List, Optional
import time
import uuid
import math


class AnimationAI:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # timing defaults
            "default_duration": 300,
            "default_delay": 0,

            # easing
            "default_easing": "linear",

            # behavior
            "auto_chain": True,

            "debug": False,

            **(options or {})
        }

    # =====================================
    # MAIN ANIMATION GENERATOR
    # =====================================

    def generate_animation(
        self,
        target: Dict[str, Any],
        keyframes: List[Dict[str, Any]],
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        animation = {
            "type": "HAPA_ANIMATION",
            "version": self.options["version"],
            "id": self._uuid(),
            "timestamp": time.time(),

            "target": target,

            "timeline": self._build_timeline(keyframes),

            "options": {
                "duration": context.get("duration", self.options["default_duration"]),
                "delay": context.get("delay", self.options["default_delay"]),
                "easing": context.get("easing", self.options["default_easing"])
            }
        }

        return animation

    # =====================================
    # TIMELINE BUILDER
    # =====================================

    def _build_timeline(self, keyframes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:

        timeline = []

        for i, kf in enumerate(keyframes):

            timeline.append({

                "id": self._uuid(),

                "time": kf.get("time", i * 100),

                "props": kf.get("props", {}),

                "easing": kf.get("easing", self.options["default_easing"])
            })

        return sorted(timeline, key=lambda x: x["time"])

    # =====================================
    # SIMPLE FADE ANIMATION
    # =====================================

    def fade(self, target: Dict[str, Any], duration: int = 300) -> Dict[str, Any]:

        return self.generate_animation(
            target,
            [
                {"time": 0, "props": {"opacity": 0}},
                {"time": duration, "props": {"opacity": 1}}
            ],
            {"duration": duration}
        )

    # =====================================
    # MOVE ANIMATION
    # =====================================

    def move(self, target: Dict[str, Any], x: int, y: int, duration: int = 300) -> Dict[str, Any]:

        return self.generate_animation(
            target,
            [
                {"time": 0, "props": {"x": target.get("x", 0), "y": target.get("y", 0)}},
                {"time": duration, "props": {"x": x, "y": y}}
            ],
            {"duration": duration}
        )

    # =====================================
    # SCALE ANIMATION
    # =====================================

    def scale(self, target: Dict[str, Any], scale: float, duration: int = 300) -> Dict[str, Any]:

        return self.generate_animation(
            target,
            [
                {"time": 0, "props": {"scale": target.get("scale", 1)}},
                {"time": duration, "props": {"scale": scale}}
            ],
            {"duration": duration}
        )

    # =====================================
    # EASING FUNCTIONS
    # =====================================

    def easing(self, t: float, type: str = "linear") -> float:

        if type == "ease-in":

            return t * t

        if type == "ease-out":

            return 1 - (1 - t) * (1 - t)

        if type == "ease-in-out":

            return 3 * t * t - 2 * t * t * t

        return t  # linear

    # =====================================
    # CHAIN ANIMATIONS
    # =====================================

    def chain(self, animations: List[Dict[str, Any]]) -> Dict[str, Any]:

        time_cursor = 0

        timeline = []

        for anim in animations:

            duration = anim.get("options", {}).get("duration", 300)

            for kf in anim.get("timeline", []):

                timeline.append({

                    "id": self._uuid(),

                    "time": kf["time"] + time_cursor,

                    "props": kf["props"]
                })

            time_cursor += duration

        return {
            "type": "HAPA_ANIMATION_CHAIN",
            "timeline": sorted(timeline, key=lambda x: x["time"])
        }

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"anim-{uuid.uuid4().hex[:8]}"

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, animation: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[AnimationAI DEBUG]")
        print(animation)
