# =========================================
# HAPA MINI FIGMA - AI LAYOUT ENGINE
# ai_tools/layout_ai.py
# =========================================

from typing import Dict, Any, List, Optional
import time


class LayoutAI:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # layout defaults
            "grid_columns": 12,
            "base_spacing": 8,
            "auto_padding": True,

            # behavior
            "align_strategy": "smart",  # smart | strict | loose

            "debug": False,

            **(options or {})
        }

    # =====================================
    # MAIN ENTRY
    # =====================================

    def generate_layout(
        self,
        ui_tree: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        layout = self._process_node(ui_tree, depth=0)

        return {
            "type": "HAPA_LAYOUT",
            "version": self.options["version"],
            "timestamp": time.time(),
            "layout": layout
        }

    # =====================================
    # RECURSIVE PROCESSOR
    # =====================================

    def _process_node(
        self,
        node: Dict[str, Any],
        depth: int
    ) -> Dict[str, Any]:

        node_type = node.get("type", "unknown")

        layout_node = {
            "type": node_type,
            "depth": depth,
            "style": self._compute_style(node, depth),
            "children": []
        }

        children = node.get("children", [])

        for child in children:

            layout_node["children"].append(
                self._process_node(child, depth + 1)
            )

        return layout_node

    # =====================================
    # STYLE CALCULATION
    # =====================================

    def _compute_style(
        self,
        node: Dict[str, Any],
        depth: int
    ) -> Dict[str, Any]:

        base_gap = self.options["base_spacing"]

        return {

            "padding": base_gap * (depth + 1) if self.options["auto_padding"] else base_gap,

            "margin": base_gap,

            "align": self._get_alignment(node),

            "width": node.get("props", {}).get("width", "auto"),

            "height": node.get("props", {}).get("height", "auto")
        }

    # =====================================
    # ALIGNMENT ENGINE
    # =====================================

    def _get_alignment(self, node: Dict[str, Any]) -> str:

        strategy = self.options["align_strategy"]

        node_type = node.get("type", "")

        if strategy == "strict":

            return "left"

        if strategy == "loose":

            return "center"

        # SMART MODE
        if node_type in ["button", "input"]:
            return "center"

        if node_type in ["toolbar"]:
            return "space-between"

        return "left"

    # =====================================
    # FLATTEN LAYOUT
    # =====================================

    def flatten(self, layout: Dict[str, Any]) -> List[Dict[str, Any]]:

        result = []

        def walk(node):

            result.append(node)

            for c in node.get("children", []):

                walk(c)

        walk(layout)

        return result

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, layout: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[LayoutAI DEBUG]")
        print(layout)
