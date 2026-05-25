# =========================================
# HAPA MINI FIGMA - ICON AI ENGINE
# ai_tools/icon_ai.py
# =========================================

from typing import Dict, Any, List, Optional
import time
import uuid


class IconAI:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # default icon settings
            "default_size": 24,
            "stroke_width": 2,

            # style system
            "style": "outline",  # outline | filled | duotone

            # behavior
            "auto_optimize": True,

            "debug": False,

            **(options or {})
        }

        self.cache: Dict[str, Dict[str, Any]] = {}

    # =====================================
    # MAIN ICON GENERATOR
    # =====================================

    def generate_icon(
        self,
        name: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        icon_id = self._uuid(name)

        icon = {
            "type": "HAPA_ICON",
            "version": self.options["version"],
            "id": icon_id,
            "timestamp": time.time(),

            "name": name,

            "size": context.get("size", self.options["default_size"]),

            "style": context.get("style", self.options["style"]),

            "strokeWidth": context.get("strokeWidth", self.options["stroke_width"]),

            "svg": self._generate_svg(name, context)
        }

        if self.options["auto_optimize"]:

            icon = self._optimize(icon)

        self.cache[icon_id] = icon

        return icon

    # =====================================
    # SVG GENERATOR (SIMPLIFIED)
    # =====================================

    def _generate_svg(self, name: str, context: Dict[str, Any]) -> str:

        size = context.get("size", self.options["default_size"])

        stroke = context.get("strokeWidth", self.options["stroke_width"])

        # simplified icon paths (placeholder system)
        path = self._icon_path(name)

        return f"""
<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="{stroke}"
     stroke-linecap="round" stroke-linejoin="round">

    {path}

</svg>
""".strip()

    # =====================================
    # ICON PATH LIBRARY (SIMPLE MAP)
    # =====================================

    def _icon_path(self, name: str) -> str:

        icons = {

            "home": '<path d="M3 12l9-9 9 9"></path><path d="M9 21V9h6v12"></path>',

            "trash": '<path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M6 6l1 14h10l1-14"></path>',

            "edit": '<path d="M4 20h4l10-10-4-4L4 16v4z"></path>',

            "plus": '<path d="M12 5v14"></path><path d="M5 12h14"></path>',

            "close": '<path d="M6 6l12 12"></path><path d="M18 6L6 18"></path>',

            "search": '<circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path>',

            "user": '<circle cx="12" cy="7" r="4"></circle><path d="M5 21c1.5-4 12.5-4 14 0"></path>',

            "settings": '<circle cx="12" cy="12" r="3"></circle><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1l-.3-2.6H9.5L9.2 6a7 7 0 0 0-1.7 1l-2.4-1-2 3.5L5 11a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.3 2.6h5l.3-2.6a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1z"></path>'
        }

        return icons.get(name.lower(), '<path d="M12 2l10 10-10 10L2 12z"></path>')

    # =====================================
    # OPTIMIZATION
    # =====================================

    def _optimize(self, icon: Dict[str, Any]) -> Dict[str, Any]:

        icon["optimized"] = True

        # normalize size
        if icon["size"] > 48:

            icon["size"] = 48

        return icon

    # =====================================
    # BATCH GENERATION
    # =====================================

    def generate_batch(
        self,
        names: List[str],
        context: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:

        return [
            self.generate_icon(name, context)
            for name in names
        ]

    # =====================================
    # CACHE
    # =====================================

    def get(self, icon_id: str) -> Optional[Dict[str, Any]]:

        return self.cache.get(icon_id)

    def clear_cache(self):

        self.cache.clear()

    # =====================================
    # UUID
    # =====================================

    def _uuid(self, name: str) -> str:

        return f"icon-{name}-{uuid.uuid4().hex[:6]}"

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, icon: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[IconAI DEBUG]")
        print(icon)
