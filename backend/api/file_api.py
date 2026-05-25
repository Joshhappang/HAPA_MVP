# =========================================
# HAPA MINI FIGMA - FILE API
# api/file_api.py
# =========================================

from typing import Dict, Any, Optional, List
import time
import uuid
import os


class FileAPI:

    def __init__(self, server):

        self.server = server

        # in-memory file store (mock storage)
        self.files: Dict[str, Dict[str, Any]] = {}

    # =====================================
    # UPLOAD FILE
    # =====================================

    def upload_file(
        self,
        filename: str,
        content: bytes,
        file_type: str = "asset"
    ) -> Dict[str, Any]:

        file_id = self._uuid()

        file_data = {

            "id": file_id,

            "filename": filename,

            "type": file_type,

            "size": len(content),

            "content": content,

            "created_at": time.time()
        }

        self.files[file_id] = file_data

        return {

            "status": "success",

            "file": self._safe_meta(file_data)
        }

    # =====================================
    # GET FILE
    # =====================================

    def get_file(self, file_id: str) -> Optional[Dict[str, Any]]:

        return self.files.get(file_id)

    # =====================================
    # DELETE FILE
    # =====================================

    def delete_file(self, file_id: str) -> bool:

        if file_id not in self.files:

            return False

        del self.files[file_id]

        return True

    # =====================================
    # LIST FILES
    # =====================================

    def list_files(self, file_type: Optional[str] = None) -> List[Dict[str, Any]]:

        files = list(self.files.values())

        if file_type:

            files = [f for f in files if f["type"] == file_type]

        return [self._safe_meta(f) for f in files]

    # =====================================
    # DOWNLOAD FILE
    # =====================================

    def download_file(self, file_id: str) -> Optional[bytes]:

        file = self.files.get(file_id)

        if not file:

            return None

        return file["content"]

    # =====================================
    # UPDATE FILE META
    # =====================================

    def update_file(self, file_id: str, patch: Dict[str, Any]) -> Optional[Dict[str, Any]]:

        file = self.files.get(file_id)

        if not file:

            return None

        for k, v in patch.items():

            if k != "content":

                file[k] = v

        file["updated_at"] = time.time()

        return self._safe_meta(file)

    # =====================================
    # SAFE META (NO RAW CONTENT)
    # =====================================

    def _safe_meta(self, file: Dict[str, Any]) -> Dict[str, Any]:

        return {

            "id": file["id"],

            "filename": file["filename"],

            "type": file["type"],

            "size": file["size"],

            "created_at": file["created_at"]
        }

    # =====================================
    # CLEANUP FILES
    # =====================================

    def cleanup(self, max_age: int = 86400):

        now = time.time()

        to_delete = []

        for file_id, file in self.files.items():

            if now - file["created_at"] > max_age:

                to_delete.append(file_id)

        for file_id in to_delete:

            self.delete_file(file_id)

    # =====================================
    # UUID
    # =====================================

    def _uuid(self) -> str:

        return f"fileapi-{uuid.uuid4().hex[:8]}"
