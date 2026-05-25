# =========================================
# HAPA MINI FIGMA - EXPORT API
# api/export_api.py
# =========================================

from typing import Dict, Any, Optional, List
import time
import uuid
import json


class ExportAPI:

    def __init__(self, server=None):

        self.server = server

        # export history (cache)
        self.exports: Dict[str, Dict[str, Any]] = {}

    # =====================================
    # EXPORT PROJECT
    # =====================================

    def export_project(self, project: Dict[str, Any], format: str = "json") -> Dict[str, Any]:

        export_id = self._uuid()

        if format == "json":

            data = self._export_json(project)

        elif format == "minified":

            data = self._export_minified(project)

        else:

            return self._error("Unsupported export format")

        export_record = {

            "id": export_id,

            "format": format,

            "timestamp": time.time(),

            "data": data
        }

        self.exports[export_id] = export_record

        return {

            "status": "success",

            "export_id": export_id,

            "format": format,

            "data": data
        }

    # =====================================
    # EXPORT MULTIPLE PROJECTS
    # =====================================

    def export_batch(self, projects: List[Dict[str, Any]], format: str = "json") -> Dict[str, Any]:

        results = []

        for project in projects:

            results.append(self.export_project(project, format))

        return {

            "status": "success",

            "count": len(results),

            "results": results
        }

    # =====================================
    # JSON EXPORT
    # =====================================

    def _export_json(self, project: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "type": "PROJECT_EXPORT_JSON",

            "timestamp": time.time(),

            "project": project
        }

    # =====================================
    # MINIFIED EXPORT
    # =====================================

    def _export_minified(self, project: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "id": project.get("id"),

            "name": project.get("name"),

            "frames": len(project.get("frames", {})),

            "components": len(project.get("components", {}))
        }

    # =====================================
    # GET EXPORT
    # =====================================

    def get_export(self, export_id: str) -> Optional[Dict[str, Any]]:

        return self.exports.get(export_id)

    # =====================================
    # LIST EXPORTS
    # =====================================

    def list_exports(self) -> Dict[str, Any]:

        return {

            "exports": list(self.exports.keys())
        }

    # =====================================
    # DELETE EXPORT
    # =====================================

    def delete_export(self, export_id: str) -> bool:

        if export_id not in self.exports:

            return False

        del self.exports[export_id]

        return True

    # =====================================
    # CLEAR EXPORTS
    # =====================================

    def clear_exports(self):

        self.exports.clear()

    # =====================================
    # DOWNLOAD PAYLOAD
    # =====================================

    def download_payload(self, export_id: str) -> Optional[str]:

        export = self.exports.get(export_id)

        if not export:

            return None

        return json.dumps(export, indent=2, default=str)

    # =====================================
    # ERROR HANDLER
    # =====================================

    def _error(self, message: str) -> Dict[str, Any]:

        return {

            "status": "error",

            "message": message,

            "timestamp": time.time()
        }

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"exportapi-{uuid.uuid4().hex[:8]}"
