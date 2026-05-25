# =========================================
# HAPA MINI FIGMA - UI GENERATOR
# ai_tools/ui_generator.py
# =========================================

from typing import Dict, Any, List, Optional
import json
import time


class UIGenerator:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # output style
            "pretty": True,

            # component defaults
            "default_theme": "light",

            "default_spacing": 8,

            "default_radius": 6,

            # debug
            "debug": False,

            **(options or {})
        }

    # =====================================
    # MAIN GENERATE ENTRY
    # =====================================

    def generate_ui(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        parsed = self._parse_prompt(prompt)

        ui_tree = self._build_ui_tree(parsed, context)

        result = {
            "type": "HAPA_UI_SCHEMA",
            "version": self.options["version"],
            "timestamp": time.time(),
            "theme": context.get("theme", self.options["default_theme"]),
            "ui": ui_tree
        }

        return result

    # =====================================
    # SIMPLE PROMPT PARSER
    # =====================================

    def _parse_prompt(self, prompt: str) -> Dict[str, Any]:

        prompt = prompt.lower()

        return {

            "raw": prompt,

            "type": self._detect_type(prompt),

            "keywords": prompt.split()
        }

    # =====================================
    # UI TYPE DETECTOR
    # =====================================

    def _detect_type(self, prompt: str) -> str:

        if "button" in prompt:
            return "button"

        if "form" in prompt:
            return "form"

        if "toolbar" in prompt:
            return "toolbar"

        if "canvas" in prompt:
            return "canvas"

        if "panel" in prompt:
            return "panel"

        return "layout"

    # =====================================
    # BUILD UI TREE
    # =====================================

    def _build_ui_tree(
        self,
        parsed: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:

        ui_type = parsed["type"]

        if ui_type == "button":
            return self._button()

        if ui_type == "form":
            return self._form()

        if ui_type == "toolbar":
            return self._toolbar()

        if ui_type == "canvas":
            return self._canvas()

        if ui_type == "panel":
            return self._panel()

        return self._layout()

    # =====================================
    # COMPONENTS
    # =====================================

    def _button(self) -> Dict[str, Any]:

        return {
            "type": "button",
            "props": {
                "text": "Button",
                "width": 120,
                "height": 40,
                "radius": self.options["default_radius"]
            }
        }

    def _form(self) -> Dict[str, Any]:

        return {
            "type": "form",
            "children": [
                self._input("Name"),
                self._input("Email"),
                self._button()
            ]
        }

    def _toolbar(self) -> Dict[str, Any]:

        return {
            "type": "toolbar",
            "children": [
                self._button(),
                self._button(),
                self._button()
            ]
        }

    def _canvas(self) -> Dict[str, Any]:

        return {
            "type": "canvas",
            "props": {
                "width": 800,
                "height": 600,
                "background": "#ffffff"
            }
        }

    def _panel(self) -> Dict[str, Any]:

        return {
            "type": "panel",
            "props": {
                "width": 300,
                "height": 500
            },
            "children": [
                self._button()
            ]
        }

    def _layout(self) -> Dict[str, Any]:

        return {
            "type": "layout",
            "props": {
                "direction": "vertical",
                "gap": self.options["default_spacing"]
            },
            "children": [
                self._button(),
                self._button()
            ]
        }

    # =====================================
    # INPUT COMPONENT
    # =====================================

    def _input(self, label: str) -> Dict[str, Any]:

        return {
            "type": "input",
            "props": {
                "label": label,
                "placeholder": f"Enter {label.lower()}",
                "width": 240,
                "height": 36
            }
        }

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, ui: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[UIGenerator DEBUG]")
        print(json.dumps(ui, indent=2))
