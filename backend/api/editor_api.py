# =========================================
# HAPA MINI FIGMA - EDITOR API
# api/editor_api.py
# =========================================

from typing import Dict, Any, Optional
import time
import uuid


class EditorAPI:

    def __init__(self, server):

        self.server = server

    # =====================================
    # CREATE FRAME
    # =====================================

    def create_frame(self, name: str = "Frame") -> Dict[str, Any]:

        frame_id = self._uuid()

        frame = {

            "id": frame_id,

            "type": "FRAME",

            "name": name,

            "x": 0,
            "y": 0,
            "width": 800,
            "height": 600,

            "created_at": time.time(),

            "children": []
        }

        return frame

    # =====================================
    # CREATE SHAPE
    # =====================================

    def create_shape(self, shape_type: str = "RECT") -> Dict[str, Any]:

        shape_id = self._uuid()

        return {

            "id": shape_id,

            "type": shape_type,

            "x": 0,
            "y": 0,
            "width": 100,
            "height": 100,

            "fill": "#FFFFFF",

            "stroke": "#000000",

            "created_at": time.time()
        }

    # =====================================
    # CREATE TEXT
    # =====================================

    def create_text(self, content: str = "Text") -> Dict[str, Any]:

        text_id = self._uuid()

        return {

            "id": text_id,

            "type": "TEXT",

            "content": content,

            "x": 0,
            "y": 0,

            "fontSize": 16,
            "color": "#000000",

            "created_at": time.time()
        }

    # =====================================
    # UPDATE NODE
    # =====================================

    def update_node(self, node: Dict[str, Any], patch: Dict[str, Any]) -> Dict[str, Any]:

        for k, v in patch.items():

            node[k] = v

        node["updated_at"] = time.time()

        return node

    # =====================================
    # DELETE NODE
    # =====================================

    def delete_node(self, parent: Dict[str, Any], node_id: str) -> bool:

        if "children" not in parent:

            return False

        before = len(parent["children"])

        parent["children"] = [

            c for c in parent["children"]

            if c.get("id") != node_id
        ]

        return len(parent["children"]) != before

    # =====================================
    # ADD CHILD
    # =====================================

    def add_child(self, parent: Dict[str, Any], child: Dict[str, Any]):

        if "children" not in parent:

            parent["children"] = []

        parent["children"].append(child)

    # =====================================
    # CLONE NODE
    # =====================================

    def clone(self, node: Dict[str, Any]) -> Dict[str, Any]:

        import copy

        new_node = copy.deepcopy(node)

        new_node["id"] = self._uuid()

        new_node["cloned_at"] = time.time()

        return new_node

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"node-{uuid.uuid4().hex[:8]}"

    # =====================================
    # DEBUG
    # =====================================

    def debug(self, node: Dict[str, Any]):

        print("\n[EditorAPI DEBUG]")
        print(node)
