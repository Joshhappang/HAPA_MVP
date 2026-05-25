# =========================================
# HAPA MINI FIGMA - CODE AI ENGINE
# ai_tools/code_ai.py
# =========================================

from typing import Dict, Any, List, Optional
import time
import re


class CodeAI:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # formatting
            "indent_size": 4,
            "use_semicolons": True,

            # behavior
            "strict_mode": False,

            "debug": False,

            **(options or {})
        }

    # =====================================
    # MAIN GENERATOR
    # =====================================

    def generate_code(
        self,
        instruction: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}

        parsed = self._parse_instruction(instruction)

        code = self._build_code(parsed, context)

        return {
            "type": "HAPA_CODE",
            "version": self.options["version"],
            "timestamp": time.time(),
            "language": parsed["language"],
            "instruction": instruction,
            "code": code
        }

    # =====================================
    # INSTRUCTION PARSER
    # =====================================

    def _parse_instruction(self, instruction: str) -> Dict[str, Any]:

        text = instruction.lower()

        language = "javascript"

        if "python" in text:
            language = "python"

        if "css" in text:
            language = "css"

        if "html" in text:
            language = "html"

        return {
            "raw": instruction,
            "language": language,
            "keywords": re.findall(r"\w+", instruction)
        }

    # =====================================
    # CODE BUILDER (SIMPLIFIED GENERATOR)
    # =====================================

    def _build_code(self, parsed: Dict[str, Any], context: Dict[str, Any]) -> str:

        lang = parsed["language"]

        if lang == "javascript":
            return self._js_template(parsed, context)

        if lang == "python":
            return self._py_template(parsed, context)

        if lang == "html":
            return self._html_template(parsed, context)

        if lang == "css":
            return self._css_template(parsed, context)

        return "// unsupported language"

    # =====================================
    # JAVASCRIPT TEMPLATE
    # =====================================

    def _js_template(self, parsed: Dict[str, Any], context: Dict[str, Any]) -> str:

        name = context.get("name", "Component")

        return f"""
// HAPA GENERATED JS COMPONENT

export class {name} {{

    constructor() {{
        this.state = {{}};
    }}

    render() {{
        return `<div>{name}</div>`;
    }}

}}
""".strip()

    # =====================================
    # PYTHON TEMPLATE
    # =====================================

    def _py_template(self, parsed: Dict[str, Any], context: Dict[str, Any]) -> str:

        name = context.get("name", "Component")

        return f"""
# HAPA GENERATED PYTHON CLASS

class {name}:

    def __init__(self):
        self.state = {{}}

    def render(self):
        return "{name}"
""".strip()

    # =====================================
    # HTML TEMPLATE
    # =====================================

    def _html_template(self, parsed: Dict[str, Any], context: Dict[str, Any]) -> str:

        title = context.get("title", "HAPA UI")

        return f"""
<!DOCTYPE html>
<html>
<head>
    <title>{title}</title>
</head>
<body>
    <div>{title}</div>
</body>
</html>
""".strip()

    # =====================================
    # CSS TEMPLATE
    # =====================================

    def _css_template(self, parsed: Dict[str, Any], context: Dict[str, Any]) -> str:

        return """
/* HAPA GENERATED CSS */

.container {
    display: flex;
    padding: 16px;
}

.button {
    padding: 8px 12px;
    border-radius: 6px;
}
""".strip()

    # =====================================
    # VALIDATION
    # =====================================

    def validate(self, code: str) -> bool:

        if self.options["strict_mode"]:

            if "eval(" in code:
                return False

        return True

    # =====================================
    # FORMAT CODE
    # =====================================

    def format_code(self, code: str) -> str:

        return code.strip()

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, output: Dict[str, Any]):

        if not self.options["debug"]:
            return

        print("\n[CodeAI DEBUG]")
        print(output)
