# =========================================
# HAPA MINI FIGMA - HTML OPTIMIZER
# exports/html/html_optimizer.py
# =========================================

from typing import Any, Dict, Optional
import copy
import json
import time
import re


class HTMLOptimizer:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # remove duplicate nodes
            "remove_duplicates": True,

            # minify inline styles
            "minify_styles": True,

            # remove empty nodes/comments
            "clean_empty": True,

            # debug mode
            "debug": False,

            **(options or {})
        }

    # =====================================
    # OPTIMIZE ENTRY
    # =====================================

    def optimize(self, rendered: Dict[str, Any]) -> Dict[str, Any]:

        start = time.time()

        data = copy.deepcopy(rendered)

        if self.options["remove_duplicates"]:

            data = self._remove_duplicates(data)

        if self.options["minify_styles"]:

            data = self._minify_styles(data)

        if self.options["clean_empty"]:

            data = self._clean_empty(data)

        data["optimized_at"] = time.time()
        data["optimize_time_ms"] = int((time.time() - start) * 1000)

        return data

    # =====================================
    # REMOVE DUPLICATES
    # =====================================

    def _remove_duplicates(self, data: Dict[str, Any]) -> Dict[str, Any]:

        if "html" not in data:

            return data

        cleaned = []
        seen = set()

        for item in data["html"]:

            key = str(item)

            if key in seen:

                continue

            seen.add(key)

            cleaned.append(item)

        data["html"] = cleaned

        return data

    # =====================================
    # MINIFY STYLES
    # =====================================

    def _minify_styles(self, data: Dict[str, Any]) -> Dict[str, Any]:

        if "html" not in data:

            return data

        minified = []

        for item in data["html"]:

            if not isinstance(item, str):

                minified.append(item)

                continue

            # remove extra spaces in style=""
            item = re.sub(r"\s*:\s*", ":", item)
            item = re.sub(r"\s*;\s*", ";", item)
            item = re.sub(r"\s{2,}", " ", item)

            minified.append(item.strip())

        data["html"] = minified

        return data

    # =====================================
    # CLEAN EMPTY
    # =====================================

    def _clean_empty(self, data: Dict[str, Any]) -> Dict[str, Any]:

        if "html" not in data:

            return data

        cleaned = []

        for item in data["html"]:

            if isinstance(item, str):

                stripped = item.strip()

                if not stripped:

                    continue

                if "<!-- empty -->" in stripped:

                    continue

                cleaned.append(item)

            else:

                cleaned.append(item)

        data["html"] = cleaned

        return data

    # =====================================
    # STATS
    # =====================================

    def stats(self) -> Dict[str, Any]:

        return {

            "remove_duplicates": self.options["remove_duplicates"],

            "minify_styles": self.options["minify_styles"],

            "clean_empty": self.options["clean_empty"]
        }
