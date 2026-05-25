# =========================================
# HAPA MINI FIGMA - FRAME AI ENGINE
# ai_tools/frame_ai.py
# =========================================

from typing import Dict, Any, List, Optional
import time
import uuid


class FrameAI:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # default frame settings
            "default_width": 1440,
            "default_height": 900,

            "default_padding": 16,
            "default_gap": 12,

            # grid system
            "grid_columns": 12,

            # behavior
            "auto_center": True,
            "auto_layout": True,

            "debug": False,

            **(options or {})
        }

    # =====================================
    # MAIN FRAME GENERATOR
    # =====================================

    def generate_frame(
        self,
        name: str,
        layout: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        frame = {
            "type": "HAPA_FRAME",
            "version": self.options["version"],
            "id": self._uuid(name),
            "name": name,
            "timestamp": time.time(),

            "size": self._compute_size(context),

            "layout": self._build_layout(layout),

            "children": self._build_children(layout)
        }

        if self.options["auto_center"]:

            frame["position"] = self._center_frame(frame["size"], context)

        return frame

    # =====================================
    # SIZE ENGINE
    # =====================================

    def _compute_size(self, context: Dict[str, Any]) -> Dict[str, int]:

        return {

            "width": context.get("width", self.options["default_width"]),

            "height": context.get("height", self.options["default_height"])
        }

    # =====================================
    # FRAME LAYOUT BUILDER
    # =====================================

    def _build_layout(self, layout: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "type": "frame-layout",

            "direction": layout.get("direction", "vertical"),

            "padding": layout.get("padding", self.options["default_padding"]),

            "gap": layout.get("gap", self.options["default_gap"]),

            "align": layout.get("align", "start"),

            "justify": layout.get("justify", "start"),

            "grid": {

                "columns": layout.get("columns", self.options["grid_columns"])
            }
        }

    # =====================================
    # CHILD BUILDER
    # =====================================

    def _build_children(self, layout: Dict[str, Any]) -> List[Dict[str, Any]]:

        children = layout.get("children", [])

        return [self._normalize_child(c) for c in children]

    # =====================================
    # CHILD NORMALIZER
    # =====================================

    def _normalize_child(self, child: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "id": self._uuid(child.get("type", "node")),

            "type": child.get("type", "node"),

            "props": child.get("props", {}),

            "style": self._build_style(child),

            "children": [
                self._normalize_child(c)
                for c in child.get("children", [])
            ] if child.get("children") else []
        }

    # =====================================
    # STYLE ENGINE
    # =====================================

    def _build_style(self, node: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "width": node.get("width", "auto"),

            "height": node.get("height", "auto"),

            "padding": node.get("padding", self.options["default_padding"]),

            "gap": node.get("gap", self.options["default_gap"]),

            "background": node.get("background", "transparent"),

            "radius": node.get("radius", 0),

            "shadow": node.get("shadow", "none")
        }

    # =====================================
    # CENTER FRAME POSITIONING
    # =====================================

    def _center_frame(self, size: Dict[str, int], context: Dict[str, Any]) -> Dict[str, int]:

        viewport = context.get("viewport", {})

        vw = viewport.get("width", 1920)

        vh = viewport.get("height", 1080)

        return {

            "x": (vw - size["width"]) // 2,

            "y": (vh - size["height"]) // 2
        }

    # =====================================
    # SIMPLE FRAME (QUICK API)
    # =====================================

    def simple_frame(self, name: str) -> Dict[str, Any]:

        return self.generate_frame(
            name,
            {
                "direction": "vertical",
                "children": []
            }
        )

    # =====================================
    # UUID
    # =====================================

    def _uuid(self, prefix: str) -> str:

        return f"{prefix}-frame-{uuid.uuid4().hex[:8]}"

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, frame: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[FrameAI DEBUG]")
        print(frame)
