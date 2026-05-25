# =========================================
# HAPA MINI FIGMA - HTML BUILDER
# exports/html/html_builder.py
# =========================================

from typing import Any, Dict, Optional, List
import time
import copy


class HTMLBuilder:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # include hidden elements
            "include_hidden": False,

            # normalize layout values
            "normalize": True,

            # debug mode
            "debug": False,

            **(options or {})
        }

    # =====================================
    # BUILD ENTRY
    # =====================================

    def build(self, canvas: Dict[str, Any], elements: Dict[str, Any]) -> Dict[str, Any]:

        start = time.time()

        tree = self._build_tree(canvas, elements)

        nodes = self._flatten(tree)

        optimized = self._optimize(nodes)

        return {

            "tree": tree,

            "nodes": optimized,

            "built_at": time.time(),

            "build_time_ms": int((time.time() - start) * 1000)
        }

    # =====================================
    # BUILD TREE
    # =====================================

    def _build_tree(self, canvas: Dict[str, Any], elements: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "canvas": copy.deepcopy(canvas),

            "elements": copy.deepcopy(elements),

            "meta": {

                "created_at": time.time(),

                "source": "html_builder"
            }
        }

    # =====================================
    # FLATTEN
    # =====================================

    def _flatten(self, tree: Dict[str, Any]) -> List[Dict[str, Any]]:

        nodes: List[Dict[str, Any]] = []

        canvas = tree.get("canvas", {})
        elements = tree.get("elements", {})

        # background layer
        nodes.append({

            "id": "background",

            "type": "rect",

            "x": 0,

            "y": 0,

            "width": canvas.get("width", 800),

            "height": canvas.get("height", 600),

            "color": canvas.get("background", "#ffffff"),

            "z": -1
        })

        for eid, el in elements.items():

            if not self.options["include_hidden"] and el.get("hidden", False):

                continue

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

        return nodes

    # =====================================
    # OPTIMIZE
    # =====================================

    def _optimize(self, nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:

        optimized = []

        seen = set()

        for node in nodes:

            key = (

                node.get("id"),

                node.get("x"),

                node.get("y"),

                node.get("width"),

                node.get("height"),

                node.get("color")
            )

            if key in seen:

                continue

            seen.add(key)

            if self.options["normalize"]:

                node = self._normalize(node)

            optimized.append(node)

        optimized.sort(key=lambda n: n.get("z", 0))

        return optimized

    # =====================================
    # NORMALIZE
    # =====================================

    def _normalize(self, node: Dict[str, Any]) -> Dict[str, Any]:

        for k in ["x", "y", "width", "height"]:

            if k in node and isinstance(node[k], (int, float)):

                node[k] = round(node[k])

        return node

    # =====================================
    # PREVIEW
    # =====================================

    def preview(self, canvas: Dict[str, Any], elements: Dict[str, Any]) -> Dict[str, Any]:

        built = self.build(canvas, elements)

        return {

            "node_count": len(built["nodes"]),

            "nodes": built["nodes"]
        }

    # =====================================
    # STATS
    # =====================================

    def stats(self) -> Dict[str, Any]:

        return {

            "include_hidden": self.options["include_hidden"],

            "normalize": self.options["normalize"]
        }
