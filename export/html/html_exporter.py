# =========================================
# HAPA MINI FIGMA - HTML EXPORTER
# exports/html/html_exporter.py
# =========================================

from typing import Any, Dict, Optional
import time
import os
import json
import uuid
import html


class HTMLExporter:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # output directory
            "output_dir": "exports/html/output",

            # pretty HTML formatting
            "pretty": True,

            # include metadata file
            "include_metadata": True,

            # embed CSS inline
            "inline_css": True,

            # debug mode
            "debug": False,

            **(options or {})
        }

        os.makedirs(self.options["output_dir"], exist_ok=True)

    # =====================================
    # MAIN EXPORT ENTRY
    # =====================================

    def export(self, room_id: str, canvas: Dict[str, Any], elements: Dict[str, Any]) -> Dict[str, Any]:

        start = time.time()

        # 1. build html structure
        html_tree = self._build(canvas, elements)

        # 2. render html string
        html_string = self._render(html_tree)

        # 3. save file
        file_path = self._save(room_id, html_string)

        # 4. metadata
        meta = self._metadata(room_id, canvas, elements, file_path, start)

        if self.options["include_metadata"]:

            self._save_metadata(file_path, meta)

        return meta

    # =====================================
    # BUILD STRUCTURE
    # =====================================

    def _build(self, canvas: Dict[str, Any], elements: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "width": canvas.get("width", 800),

            "height": canvas.get("height", 600),

            "background": canvas.get("background", "#ffffff"),

            "elements": elements,

            "built_at": time.time()
        }

    # =====================================
    # RENDER HTML
    # =====================================

    def _render(self, tree: Dict[str, Any]) -> str:

        width = tree["width"]
        height = tree["height"]
        bg = tree["background"]

        html_parts = []

        # HTML header
        html_parts.append("<!DOCTYPE html>")
        html_parts.append("<html>")
        html_parts.append("<head>")
        html_parts.append("<meta charset='utf-8'>")
        html_parts.append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
        html_parts.append("<title>HAPA Export</title>")

        # basic style
        html_parts.append("<style>")
        html_parts.append("body { margin:0; padding:0; }")
        html_parts.append(f".canvas {{ position:relative; width:{width}px; height:{height}px; background:{bg}; overflow:hidden; }}")
        html_parts.append(".el { position:absolute; }")
        html_parts.append("</style>")

        html_parts.append("</head>")
        html_parts.append("<body>")

        # canvas container
        html_parts.append(f"<div class='canvas'>")

        # elements
        for eid, el in tree.get("elements", {}).items():

            el_type = el.get("type", "rect")

            x = el.get("x", 0)
            y = el.get("y", 0)
            w = el.get("width", 100)
            h = el.get("height", 100)
            color = el.get("color", "#000000")

            if el_type == "rect":

                html_parts.append(
                    f"<div id='{eid}' class='el' "
                    f"style='left:{x}px; top:{y}px; width:{w}px; height:{h}px; background:{color};'></div>"
                )

            elif el_type == "text":

                text = html.escape(el.get("text", ""))

                html_parts.append(
                    f"<div id='{eid}' class='el' "
                    f"style='left:{x}px; top:{y}px; color:{color}; font-size:{el.get('font_size',16)}px;'>"
                    f"{text}</div>"
                )

            elif el_type == "circle":

                html_parts.append(
                    f"<div id='{eid}' class='el' "
                    f"style='left:{x}px; top:{y}px; width:{w}px; height:{h}px; "
                    f"border-radius:50%; background:{color};'></div>"
                )

            else:

                html_parts.append(
                    f"<!-- unsupported element {eid} type={el_type} -->"
                )

        html_parts.append("</div>")

        html_parts.append("</body>")
        html_parts.append("</html>")

        if self.options["pretty"]:

            return "\n".join(html_parts)

        return "".join(html_parts)

    # =====================================
    # SAVE FILE
    # =====================================

    def _save(self, room_id: str, html_string: str) -> str:

        file_id = self._uuid()

        file_name = f"{room_id}_{file_id}.html"

        file_path = os.path.join(self.options["output_dir"], file_name)

        with open(file_path, "w", encoding="utf-8") as f:

            f.write(html_string)

        return file_path

    # =====================================
    # METADATA
    # =====================================

    def _metadata(
        self,
        room_id: str,
        canvas: Dict[str, Any],
        elements: Dict[str, Any],
        file_path: str,
        start_time: float
    ) -> Dict[str, Any]:

        return {

            "id": self._uuid(),

            "room_id": room_id,

            "file_path": file_path,

            "format": "html",

            "created_at": time.time(),

            "duration_ms": int((time.time() - start_time) * 1000),

            "canvas_size": len(canvas),

            "elements_size": len(elements)
        }

    # =====================================
    # SAVE METADATA JSON
    # =====================================

    def _save_metadata(self, file_path: str, meta: Dict[str, Any]):

        meta_path = file_path.replace(".html", ".json")

        with open(meta_path, "w", encoding="utf-8") as f:

            json.dump(meta, f, indent=2)

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return uuid.uuid4().hex[:8]
