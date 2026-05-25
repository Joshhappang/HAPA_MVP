# =========================================
# HAPA MINI FIGMA - PROJECT API
# api/project_api.py
# =========================================

from typing import Dict, Any, Optional, List
import time
import uuid
import copy


class ProjectAPI:

    def __init__(self, server):

        self.server = server

        # in-memory project DB
        self.projects: Dict[str, Dict[str, Any]] = {}

    # =====================================
    # CREATE PROJECT
    # =====================================

    def create_project(self, name: str = "Untitled Project") -> Dict[str, Any]:

        project_id = self._uuid()

        project = {

            "id": project_id,

            "name": name,

            "created_at": time.time(),

            "updated_at": time.time(),

            "frames": {},

            "components": {},

            "assets": []
        }

        self.projects[project_id] = project

        return project

    # =====================================
    # GET PROJECT
    # =====================================

    def get_project(self, project_id: str) -> Optional[Dict[str, Any]]:

        return self.projects.get(project_id)

    # =====================================
    # UPDATE PROJECT
    # =====================================

    def update_project(self, project_id: str, patch: Dict[str, Any]) -> Optional[Dict[str, Any]]:

        project = self.projects.get(project_id)

        if not project:

            return None

        self._deep_merge(project, patch)

        project["updated_at"] = time.time()

        return project

    # =====================================
    # DELETE PROJECT
    # =====================================

    def delete_project(self, project_id: str) -> bool:

        if project_id not in self.projects:

            return False

        del self.projects[project_id]

        return True

    # =====================================
    # LIST PROJECTS
    # =====================================

    def list_projects(self) -> List[Dict[str, Any]]:

        return list(self.projects.values())

    # =====================================
    # CLONE PROJECT
    # =====================================

    def clone_project(self, project_id: str) -> Optional[Dict[str, Any]]:

        project = self.projects.get(project_id)

        if not project:

            return None

        new_project = copy.deepcopy(project)

        new_project["id"] = self._uuid()

        new_project["name"] = project["name"] + " (Copy)"

        new_project["created_at"] = time.time()

        self.projects[new_project["id"]] = new_project

        return new_project

    # =====================================
    # EXPORT PROJECT DATA
    # =====================================

    def export_project(self, project_id: str) -> Optional[Dict[str, Any]]:

        project = self.projects.get(project_id)

        if not project:

            return None

        return {

            "type": "PROJECT_EXPORT",

            "timestamp": time.time(),

            "data": copy.deepcopy(project)
        }

    # =====================================
    # IMPORT PROJECT DATA
    # =====================================

    def import_project(self, data: Dict[str, Any]) -> Dict[str, Any]:

        project_id = self._uuid()

        project = copy.deepcopy(data)

        project["id"] = project_id

        project["created_at"] = time.time()

        project["updated_at"] = time.time()

        self.projects[project_id] = project

        return project

    # =====================================
    # DEEP MERGE
    # =====================================

    def _deep_merge(self, target: Dict[str, Any], patch: Dict[str, Any]):

        for key, value in patch.items():

            if isinstance(value, dict) and isinstance(target.get(key), dict):

                self._deep_merge(target[key], value)

            else:

                target[key] = value

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"projapi-{uuid.uuid4().hex[:8]}"
