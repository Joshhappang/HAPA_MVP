# =========================================
# HAPA MINI FIGMA - HTML BATCH EXPORT
# exports/html/html_batch_export.py
# =========================================

from typing import Any, Dict, List, Optional
import time
import threading
from queue import Queue


class HTMLBatchExport:

    def __init__(self, exporter, options: Optional[Dict[str, Any]] = None):

        self.exporter = exporter

        self.options = {
            "version": "1.0.0",

            # number of worker threads
            "workers": 2,

            # async processing
            "async_mode": True,

            # debug mode
            "debug": False,

            **(options or {})
        }

        self.queue: "Queue[Dict[str, Any]]" = Queue()

        self.results: List[Dict[str, Any]] = []

        self._running = True

        self._threads: List[threading.Thread] = []

        if self.options["async_mode"]:

            self._start_workers()

    # =====================================
    # ADD JOB
    # =====================================

    def add_job(self, room_id: str, canvas: Dict[str, Any], elements: Dict[str, Any]) -> Dict[str, Any]:

        job = {

            "room_id": room_id,

            "canvas": canvas,

            "elements": elements,

            "created_at": time.time()
        }

        self.queue.put(job)

        return job

    # =====================================
    # START WORKERS
    # =====================================

    def _start_workers(self):

        for _ in range(self.options["workers"]):

            t = threading.Thread(target=self._worker, daemon=True)

            t.start()

            self._threads.append(t)

    # =====================================
    # WORKER LOOP
    # =====================================

    def _worker(self):

        while self._running:

            try:

                job = self.queue.get(timeout=1)

            except Exception:

                continue

            try:

                result = self.exporter.export(
                    room_id=job["room_id"],
                    canvas=job["canvas"],
                    elements=job["elements"]
                )

                self.results.append(result)

            except Exception as e:

                if self.options["debug"]:

                    print("[HTMLBatchExport ERROR]", e)

            finally:

                self.queue.task_done()

    # =====================================
    # WAIT ALL JOBS
    # =====================================

    def wait(self) -> List[Dict[str, Any]]:

        self.queue.join()

        return self.results

    # =====================================
    # STOP WORKERS
    # =====================================

    def stop(self):

        self._running = False

        for t in self._threads:

            t.join(timeout=1)

    # =====================================
    # SYNC MODE
    # =====================================

    def run_sync(self, jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:

        results = []

        for job in jobs:

            try:

                results.append(
                    self.exporter.export(
                        room_id=job.get("room_id"),
                        canvas=job.get("canvas", {}),
                        elements=job.get("elements", {})
                    )
                )

            except Exception as e:

                if self.options["debug"]:

                    print("[HTMLBatchExport SYNC ERROR]", e)

        return results

    # =====================================
    # STATS
    # =====================================

    def stats(self) -> Dict[str, Any]:

        return {

            "queued": self.queue.qsize(),

            "results": len(self.results),

            "workers": self.options["workers"]
        }
