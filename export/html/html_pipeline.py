# =========================================
# HAPA MINI FIGMA - HTML PIPELINE
# exports/html/html_pipeline.py
# =========================================

from typing import Any, Dict, Optional, List
import time


class HTMLPipeline:

    def __init__(self, renderer, builder, exporter, optimizer=None, compressor=None):

        """
        Pipeline flow:
        builder → renderer → optimizer → compressor → exporter
        """

        self.renderer = renderer
        self.builder = builder
        self.exporter = exporter
        self.optimizer = optimizer
        self.compressor = compressor

        self.stats_data = {
            "runs": 0,
            "last_time_ms": 0,
            "total_time_ms": 0
        }

    # =====================================
    # RUN PIPELINE
    # =====================================

    def run(self, room_id: str, canvas: Dict[str, Any], elements: Dict[str, Any]) -> Dict[str, Any]:

        start = time.time()

        self.stats_data["runs"] += 1

        # 1. build
        built = self.builder.build(canvas, elements)

        # 2. render
        rendered = self.renderer.render(
            built.get("tree", canvas),
            built.get("tree", {}).get("elements", elements)
        )

        # 3. optimize (optional)
        if self.optimizer:

            rendered = self.optimizer.optimize(rendered)

        # 4. compress (optional)
        if self.compressor:

            rendered = self.compressor.compress(rendered)

        # 5. export
        result = self.exporter.export(
            room_id=room_id,
            canvas=canvas,
            elements=elements
        )

        duration = int((time.time() - start) * 1000)

        self.stats_data["last_time_ms"] = duration
        self.stats_data["total_time_ms"] += duration

        return {

            "pipeline_result": result,

            "render": rendered,

            "duration_ms": duration,

            "status": "success"
        }

    # =====================================
    # BATCH RUN
    # =====================================

    def run_batch(self, jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:

        results = []

        for job in jobs:

            results.append(

                self.run(
                    room_id=job.get("room_id"),
                    canvas=job.get("canvas", {}),
                    elements=job.get("elements", {})
                )
            )

        return results

    # =====================================
    # STATS
    # =====================================

    def stats(self) -> Dict[str, Any]:

        avg = 0

        if self.stats_data["runs"] > 0:

            avg = self.stats_data["total_time_ms"] / self.stats_data["runs"]

        return {

            "runs": self.stats_data["runs"],

            "last_time_ms": self.stats_data["last_time_ms"],

            "avg_time_ms": round(avg, 2)
        }

    # =====================================
    # RESET
    # =====================================

    def reset(self):

        self.stats_data = {

            "runs": 0,

            "last_time_ms": 0,

            "total_time_ms": 0
        }
