# mini_figma_hapa_ai/api/api.py

"""
HAPA AI - Core API Gateway

Responsibilities:
- Central API entry point
- Route requests to subsystems
- Handle plugin API calls
- Bridge frontend <-> backend <-> AI engine
"""

from datetime import datetime
import json


class HAPAAPI:
    """
    Main API Gateway for HAPA system
    """

    def __init__(self, app):

        self.app = app

    # =========================================================
    # SYSTEM INFO
    # =========================================================

    def get_system_info(self):

        return {
            "name": "HAPA AI",
            "status": "active",
            "timestamp": datetime.utcnow().isoformat(),
            "plugins": list(self.app.plugins.keys())
        }

    # =========================================================
    # CANVAS API
    # =========================================================

    def canvas_state(self):

        return self.app.canvas.get_state()

    def canvas_update(self, payload):

        return self.app.canvas.update(payload)

    def canvas_add_node(self, node_type, data):

        return self.app.canvas.add_node(node_type, data)

    def canvas_remove_node(self, node_id):

        return self.app.canvas.remove_node(node_id)

    # =========================================================
    # AI API
    # =========================================================

    def ai_generate(self, prompt, mode="ui"):

        return self.app.ai.generate(prompt, mode)

    def ai_layout(self, data):

        return self.app.ai.layout_suggestion(data)

    def ai_component(self, spec):

        return self.app.ai.component_generator(spec)

    # =========================================================
    # PROJECT API
    # =========================================================

    def save_project(self):

        return self.app.canvas.save()

    def load_project(self, project_id):

        return self.app.canvas.load(project_id)

    # =========================================================
    # PLUGIN API
    # =========================================================

    def run_plugin(self, plugin_name, func, data=None):

        if plugin_name not in self.app.plugins:

            return {
                "success": False,
                "error": "plugin_not_found"
            }

        plugin = self.app.plugins[plugin_name]

        return plugin.run(data)

    # =========================================================
    # EXPORT API
    # =========================================================

    def export(self, format_type="json"):

        return {
            "status": "exported",
            "format": format_type,
            "timestamp": datetime.utcnow().isoformat()
        }

    # =========================================================
    # HEALTH CHECK
    # =========================================================

    def health(self):

        return {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat()
        }

    # =========================================================
    # RAW REQUEST HANDLER (SIMPLIFIED ROUTER)
    # =========================================================

    def handle_request(self, endpoint, payload=None):

        payload = payload or {}

        routes = {

            "system/info": self.get_system_info,
            "canvas/state": self.canvas_state,
            "canvas/update": lambda: self.canvas_update(payload),
            "ai/generate": lambda: self.ai_generate(payload.get("prompt", "")),
            "project/save": self.save_project,
            "project/load": lambda: self.load_project(payload.get("id")),
            "health": self.health,
        }

        handler = routes.get(endpoint)

        if not handler:

            return {
                "success": False,
                "error": "route_not_found",
                "endpoint": endpoint
            }

        return handler()


# =========================================================
# FACTORY
# =========================================================

def create_api(app):

    return HAPAAPI(app)


# =========================================================
# TEST
# =========================================================

if __name__ == "__main__":

    class DummyApp:

        class canvas:
            @staticmethod
            def get_state(): return {}

            @staticmethod
            def update(p): return True

            @staticmethod
            def add_node(t, d): return {}

            @staticmethod
            def remove_node(i): return True

            @staticmethod
            def save(): return True

            @staticmethod
            def load(pid): return {}

        class ai:
            @staticmethod
            def generate(p, m): return {"ai": True}

            @staticmethod
            def layout_suggestion(d): return {}

            @staticmethod
            def component_generator(s): return {}

        plugins = {}

    api = HAPAAPI(DummyApp())

    print(api.get_system_info())
