# =========================================
# HAPA MINI FIGMA - COMPONENT AI ENGINE
# ai_tools/component_ai.py
# =========================================

from typing import Dict, Any, List, Optional
import time
import uuid


class ComponentAI:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # default styling
            "default_radius": 6,
            "default_padding": 8,
            "default_gap": 8,

            # behavior
            "auto_layout": True,
            "use_design_tokens": True,

            "debug": False,

            **(options or {})
        }

    # =====================================
    # MAIN ENTRY
    # =====================================

    def generate_component(
        self,
        name: str,
        schema: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        component = {
            "type": "HAPA_COMPONENT",
            "version": self.options["version"],
            "id": self._uuid(name),
            "name": name,
            "timestamp": time.time(),
            "props": schema.get("props", {}),
            "layout": self._build_layout(schema),
            "children": self._build_children(schema)
        }

        return component

    # =====================================
    # LAYOUT BUILDER
    # =====================================

    def _build_layout(self, schema: Dict[str, Any]) -> Dict[str, Any]:

        layout_type = schema.get("layout", "vertical")

        return {

            "type": "layout",

            "direction": layout_type,

            "padding": schema.get("padding", self.options["default_padding"]),

            "gap": schema.get("gap", self.options["default_gap"]),

            "align": schema.get("align", "start")
        }

    # =====================================
    # CHILD BUILDER
    # =====================================

    def _build_children(self, schema: Dict[str, Any]) -> List[Dict[str, Any]]:

        children = schema.get("children", [])

        result = []

        for child in children:

            result.append(self._normalize_child(child))

        return result

    # =====================================
    # NORMALIZE CHILD NODE
    # =====================================

    def _normalize_child(self, child: Dict[str, Any]) -> Dict[str, Any]:

        node_type = child.get("type", "box")

        base = {
            "id": self._uuid(node_type),
            "type": node_type,
            "props": child.get("props", {}),
            "style": self._build_style(child)
        }

        if "children" in child:

            base["children"] = self._build_children(child)

        return base

    # =====================================
    # STYLE BUILDER
    # =====================================

    def _build_style(self, node: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "width": node.get("width", "auto"),

            "height": node.get("height", "auto"),

            "radius": node.get("radius", self.options["default_radius"]),

            "background": node.get("background", "transparent"),

            "border": node.get("border", "none")
        }

    # =====================================
    # BUTTON COMPONENT
    # =====================================

    def button(self, label: str = "Button") -> Dict[str, Any]:

        return {

            "type": "button",

            "props": {
                "label": label
            },

            "style": {
                "padding": self.options["default_padding"],
                "radius": self.options["default_radius"]
            }
        }

    # =====================================
    # INPUT COMPONENT
    # =====================================

    def input(self, placeholder: str = "Enter text") -> Dict[str, Any]:

        return {

            "type": "input",

            "props": {
                "placeholder": placeholder
            },

            "style": {
                "padding": self.options["default_padding"]
            }
        }

    # =====================================
    # CONTAINER COMPONENT
    # =====================================

    def container(self, children: List[Dict[str, Any]]) -> Dict[str, Any]:

        return {

            "type": "container",

            "layout": {
                "direction": "vertical",
                "gap": self.options["default_gap"]
            },

            "children": children
        }

    # =====================================
    # UUID
    # =====================================

    def _uuid(self, prefix: str) -> str:

        return f"{prefix}-{uuid.uuid4().hex[:8]}"

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, component: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[ComponentAI DEBUG]")
        print(component)
