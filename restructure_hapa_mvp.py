import os
import shutil

BASE = os.path.dirname(os.path.abspath(__file__))

DRY_RUN = True  # Ubah ke False kalau sudah yakin

# =========================
# MAPPING STRUKTUR BARU
# =========================

MAPPINGS = [
    # CORE ENGINE
    ("canvas", "core/canvas"),
    ("canvas_renderer", "core/renderer"),

    # AI
    ("ai/ai_tools", "ai/tools"),

    # BACKEND tetap
    ("backend", "backend"),

    # FRONTEND / EDITOR split ringan
    ("frontend", "frontend"),
    ("editor", "editor"),

    # EXPORT
    ("export", "export"),

    # STORAGE
    ("storage", "storage"),

    # DOCS
    ("docs", "docs"),

    # TESTS
    ("tests", "tests"),

    # ASSETS
    ("assets", "assets"),
]

# =========================
# UTIL
# =========================

def log(msg):
    print(f"[HAPA-MIGRATE] {msg}")

def safe_mkdir(path):
    if not os.path.exists(path):
        log(f"mkdir: {path}")
        if not DRY_RUN:
            os.makedirs(path)

def move(src, dst):
    if not os.path.exists(src):
        log(f"SKIP (not found): {src}")
        return

    safe_mkdir(dst)

    if os.path.isdir(src):
        log(f"move DIR: {src} -> {dst}")
        if not DRY_RUN:
            for item in os.listdir(src):
                s = os.path.join(src, item)
                d = os.path.join(dst, item)
                if os.path.exists(d):
                    continue
                shutil.move(s, d)
            try:
                os.rmdir(src)
            except:
                pass
    else:
        log(f"move FILE: {src} -> {dst}")
        if not DRY_RUN:
            shutil.move(src, dst)

# =========================
# EXECUTION
# =========================

def main():
    log(f"BASE: {BASE}")
    log(f"DRY_RUN = {DRY_RUN}")

    for src, dst in MAPPINGS:
        src_path = os.path.join(BASE, src)
        dst_path = os.path.join(BASE, dst)

        move(src_path, dst_path)

    log("DONE")

if __name__ == "__main__":
    main()
