# =========================================
# HAPA MINI FIGMA - API INDEX
# api/index.py
# =========================================

from typing import Dict, Any, Optional


class API:

    def __init__(self):

        # core API modules registry
        self.modules: Dict[str, Any] = {}

    # =====================================
    # REGISTER MODULE
    # =====================================

    def register(self, name: str, module: Any):

        self.modules[name] = module

    # =====================================
    # GET MODULE
    # =====================================

    def get(self, name: str) -> Any:

        return self.modules.get(name)

    # =====================================
    # REMOVE MODULE
    # =====================================

    def remove(self, name: str) -> bool:

        if name not in self.modules:

            return False

        del self.modules[name]

        return True

    # =====================================
    # LIST MODULES
    # =====================================

    def list_modules(self) -> Dict[str, Any]:

        return {

            "modules": list(self.modules.keys())
        }

    # =====================================
    # CALL MODULE METHOD (GENERIC ROUTER)
    # =====================================

    def call(self, module_name: str, method: str, *args, **kwargs) -> Any:

        module = self.modules.get(module_name)

        if not module:

            return self._error(f"Module not found: {module_name}")

        if not hasattr(module, method):

            return self._error(f"Method not found: {method}")

        func = getattr(module, method)

        try:

            return func(*args, **kwargs)

        except Exception as e:

            return self._error(str(e))

    # =====================================
    # SAFE ERROR
    # =====================================

    def _error(self, message: str) -> Dict[str, Any]:

        return {

            "status": "error",

            "message": message
        }

    # =====================================
    # HEALTH CHECK
    # =====================================

    def health(self) -> Dict[str, Any]:

        return {

            "status": "ok",

            "modules": len(self.modules)
        }

    # =====================================
    # DEBUG
    # =====================================

    def debug(self):

        print("\n[API INDEX DEBUG]")
        print(self.list_modules())

