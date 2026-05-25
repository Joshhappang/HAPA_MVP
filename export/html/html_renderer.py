# =========================================
# HAPA MINI FIGMA - HTML RENDERER
# exports/html/html_renderer.py
# =========================================

from typing import Any, Dict, List, Optional
import time
import copy
import json
import html


class HTMLRenderer:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # default canvas size
            "width": 800,
            "height": 600,

            # debug mode
            "debug": False,

            **(options or {})
        }

    # =====================================
    # MAIN RENDER ENTRY
    # =====================================

    def render(self, canvas: Dict[str, Any], elements: Dict[str, Any]) -> Dict[str, Any]:

        start = time.time()

        tree = self._build_tree(canvas, elements)

        nodes = self._flatten(tree)

        html_nodes = self._to_html(nodes, tree)

        return {

            "html": html_nodes,

            "node_count": len(html_nodes),

            "render_time_ms": int((time.time() - start) * 1000)
        }

    # =====================================
    # BUILD TREE
    # =====================================

    def _build_tree(self, canvas: Dict[str, Any], elements: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "canvas": copy.deepcopy(canvas),

            "elements": copy.deepcopy(elements),

            "meta": {

                "built_at": time.time()
            }
        }

    # =====================================
    # FLATTEN NODES
    # =====================================

    def _flatten(self, tree: Dict[str, Any]) -> List[Dict[str, Any]]:

        nodes: List[Dict[str, Any]] = []

        canvas = tree.get("canvas", {})
        elements = tree.get("elements", {})

        # background node
        nodes.append({

            "id": "background",

            "type": "rect",

            "x": 0,

            "y": 0,

            "width": canvas.get("width", self.options["width"]),

            "height": canvas.get("height", self.options["height"]),

            "color": canvas.get("background", "#ffffff"),

            "z": -1
        })

        for eid, el in elements.items():

            nodes.append({

                "id": eid,

                "type": el.get("type", "rect"),

                "x": el.get("x", 0),

                "y": el.get("y", 0),

                "width": el.get("width", 100),

                "height": el.get("height", 100),

                "color": el.get("color", "#000000"),

                "text": el.get("text"),

                "font_size": el.get("font_size", 16),

                "z": el.get("z", 0)
            })

        nodes.sort(key=lambda n: n.get("z", 0))

        return nodes

    # =====================================
    # TO HTML
    # =====================================

    def _to_html(self, nodes: List[Dict[str, Any]], tree: Dict[str, Any]) -> List[str]:

        width = tree["canvas"].get("width", self.options["width"])
        height = tree["canvas"].get("height", self.options["height"])

        output: List[str] = []

        # wrapper
        output.append(
            f"<div style='position:relative;width:{width}px;height:{height}px;background:{tree['canvas'].get('background','#fff')};overflow:hidden;'>"
        )

        for node in nodes:

            if node["type"] == "rect":

                output.append(
                    f"<div id='{node['id']}' "
                    f"style='position:absolute;left:{node['x']}px;top:{node['y']}px;"
                    f"width:{node['width']}px;height:{node['height']}px;"
                    f"background:{node['color']};'></div>"
                )

            elif node["type"] == "circle":

                output.append(
                    f"<div id='{node['id']}' "
                    f"style='position:absolute;left:{node['x']}px;top:{node['y']}px;"
                    f"width:{node['width']}px;height:{node['height']}px;"
                    f"border-radius:50%;background:{node['color']};'></div>"
                )

            elif node["type"] == "text":

                text = html.escape(node.get("text", ""))

                output.append(
                    f"<div id='{node['id']}' "
                    f"style='position:absolute;left:{node['x']}px;top:{node['y']}px;"
                    f"color:{node['color']};font-size:{node['font_size']}px;'>"
                    f"{text}</div>"
                )

            else:

                output.append(
                    f"<!-- unsupported node {node['id']} type={node['type']} -->"
                )

        output.append("</div>")

        return output

    # =====================================
    # DEBUG DUMP
    # =====================================

    def debug_dump(self, canvas: Dict[str, Any], elements: Dict[str, Any]) -> str:

        tree = self._build_tree(canvas, elements)

        nodes = self._flatten(tree)

        return json.dumps(nodes, indent=2)
