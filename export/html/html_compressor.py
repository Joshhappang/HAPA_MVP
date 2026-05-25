# =========================================
# HAPA MINI FIGMA - HTML COMPRESSOR
# exports/html/html_compressor.py
# =========================================

from typing import Any, Dict, Optional
import copy
import json
import zlib
import time
import re


class HTMLCompressor:

    def __init__(self, options: Optional[Dict[str, Any]] = None):

        self.options = {
            "version": "1.0.0",

            # compression level (0-9)
            "level": 6,

            # minify HTML before compression
            "minify": True,

            # use JSON encoding
            "use_json": True,

            # debug mode
            "debug": False,

            **(options or {})
        }

    # =====================================
    # COMPRESS
    # =====================================

    def compress(self, data: Dict[str, Any]) -> Dict[str, Any]:

        start = time.time()

        payload = copy.deepcopy(data)

        if self.options["minify"] and "html" in payload:

            payload["html"] = self._minify_html(payload["html"])

        if self.options["use_json"]:

            raw = json.dumps(payload, separators=(",", ":")).encode("utf-8")

        else:

            raw = str(payload).encode("utf-8")

        compressed = zlib.compress(raw, self.options["level"])

        return {

            "compressed": True,

            "algorithm": "zlib_html_simulated",

            "size_raw": len(raw),

            "size_compressed": len(compressed),

            "compression_ratio": round(len(compressed) / len(raw), 4) if raw else 0,

            "data": compressed,

            "compressed_at": time.time(),

            "compress_time_ms": int((time.time() - start) * 1000)
        }

    # =====================================
    # MINIFY HTML
    # =====================================

    def _minify_html(self, html_list: list) -> list:

        minified = []

        for item in html_list:

            if not isinstance(item, str):

                minified.append(item)

                continue

            # remove newlines and extra spaces
            s = re.sub(r">\s+<", "><", item)
            s = re.sub(r"\s{2,}", " ", s)
            s = s.strip()

            minified.append(s)

        return minified

    # =====================================
    # DECOMPRESS
    # =====================================

    def decompress(self, package: Dict[str, Any]) -> Dict[str, Any]:

        if not package.get("compressed"):

            return package

        raw = zlib.decompress(package["data"])

        if self.options["use_json"]:

            return json.loads(raw.decode("utf-8"))

        return eval(raw.decode("utf-8"))  # unsafe fallback

    # =====================================
    # BATCH COMPRESS
    # =====================================

    def compress_batch(self, items: list) -> Dict[str, Any]:

        start = time.time()

        raw = json.dumps(items, separators=(",", ":")).encode("utf-8")

        compressed = zlib.compress(raw, self.options["level"])

        return {

            "compressed": True,

            "count": len(items),

            "size_raw": len(raw),

            "size_compressed": len(compressed),

            "compression_ratio": round(len(compressed) / len(raw), 4) if raw else 0,

            "data": compressed,

            "compress_time_ms": int((time.time() - start) * 1000)
        }

    # =====================================
    # STATS
    # =====================================

    def stats(self) -> Dict[str, Any]:

        return {

            "level": self.options["level"],

            "minify": self.options["minify"],

            "use_json": self.options["use_json"]
        }
