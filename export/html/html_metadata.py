# =========================================
# HAPA MINI FIGMA - HTML METADATA
# exports/html/html_metadata.py
# =========================================

from typing import Any, Dict, Optional
import time
import platform
import uuid
import json


class HTMLMetadata:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # include system info
            "include_system": True,

            # include canvas stats
            "include_canvas_stats": True,

            # include element stats
            "include_element_stats": True,

            # debug mode
            "debug": False,

            **(options or {})
        }

    # =====================================
    # BUILD METADATA
    # =====================================

    def build(
        self,
        room_id: str,
        canvas: Dict[str, Any],
        elements: Dict[str, Any],
        file_path: str,
        duration_ms: int
    ) -> Dict[str, Any]:

        meta = {

            "id": self._uuid(),

            "room_id": room_id,

            "file_path": file_path,

            "format": "html",

            "created_at": time.time(),

            "duration_ms": duration_ms,

            "version": self.options["version"]
        }

        if self.options["include_system"]:

            meta["system"] = self._system_info()

        if self.options["include_canvas_stats"]:

            meta["canvas"] = self._canvas_stats(canvas)

        if self.options["include_element_stats"]:

            meta["elements"] = self._element_stats(elements)

        return meta

    # =====================================
    # SYSTEM INFO
    # =====================================

    def _system_info(self) -> Dict[str, Any]:

        return {

            "platform": platform.system(),

            "platform_release": platform.release(),

            "python_version": platform.python_version()
        }

    # =====================================
    # CANVAS STATS
    # =====================================

    def _canvas_stats(self, canvas: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "width": canvas.get("width", 0),

            "height": canvas.get("height", 0),

            "background": canvas.get("background", "#ffffff"),

            "fields": len(canvas)
        }

    # =====================================
    # ELEMENT STATS
    # =====================================

    def _element_stats(self, elements: Dict[str, Any]) -> Dict[str, Any]:

        types = {}

        for _, el in elements.items():

            t = el.get("type", "unknown")

            types[t] = types.get(t, 0) + 1

        return {

            "total": len(elements),

            "type_distribution": types
        }

    # =====================================
    # JSON EXPORT
    # =====================================

    def to_json(self, metadata: Dict[str, Any]) -> str:

        return json.dumps(metadata, indent=2)

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"htmlm-{uuid.uuid4().hex[:8]}"
