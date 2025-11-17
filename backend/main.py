from __future__ import annotations

from typing import Any, Dict, List, Optional
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Support running both as a package (python -m backend.main)
# and as a plain script from inside the backend folder (python main.py)
try:  # pragma: no cover - import wiring
    from .dfa_engine import DFA, create_even_ones_dfa, dfa_from_dict
except ImportError:  # When executed as "python main.py"
    from dfa_engine import DFA, create_even_ones_dfa, dfa_from_dict


class DFAPayload(BaseModel):
    states: List[str]
    alphabet: List[str]
    transitions: Dict[str, Dict[str, str]]
    start_state: Optional[str] = None
    startState: Optional[str] = None
    final_states: Optional[List[str]] = None
    finalStates: Optional[List[str]] = None


class SimulateRequest(BaseModel):
    input_string: str
    dfa_id: Optional[str] = None
    dfa: Optional[DFAPayload] = None


class SimulateResponse(BaseModel):
    accepted: bool
    trace: List[str]
    message: str


app = FastAPI(title="Regex Runner DFA Backend", version="1.0.0")

# Get the parent directory (DFA-Project root)
BASE_DIR = Path(__file__).resolve().parent.parent

# Mount static files (assets, images, etc.)
if (BASE_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(BASE_DIR / "assets")), name="assets")

# Mount examples folder if it exists
if (BASE_DIR / "examples").exists():
    app.mount("/examples", StaticFiles(directory=str(BASE_DIR / "examples")), name="examples")


@app.get("/health", tags=["system"])
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/", tags=["frontend"])
async def serve_index():
    """Serve the main index.html page"""
    index_path = BASE_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"error": "index.html not found"}


@app.get("/style.css", tags=["frontend"])
async def serve_css():
    """Serve the CSS file"""
    css_path = BASE_DIR / "style.css"
    if css_path.exists():
        return FileResponse(str(css_path), media_type="text/css")
    return {"error": "style.css not found"}


@app.get("/script.js", tags=["frontend"])
async def serve_js():
    """Serve the JavaScript file"""
    js_path = BASE_DIR / "script.js"
    if js_path.exists():
        return FileResponse(str(js_path), media_type="application/javascript")
    return {"error": "script.js not found"}


def _resolve_dfa(payload: SimulateRequest) -> DFA:
    # 1) If client passes a known id, use a built-in DFA
    if payload.dfa_id == "even_ones" or (
        payload.dfa_id is None and payload.dfa is None
    ):
        return create_even_ones_dfa()

    # 2) If a custom DFA structure is provided, build from that
    if payload.dfa is not None:
        data: Dict[str, Any] = payload.dfa.model_dump()
        return dfa_from_dict(data)

    # Fallback to even-ones DFA
    return create_even_ones_dfa()


@app.post("/simulate", response_model=SimulateResponse, tags=["dfa"])
def simulate(request: SimulateRequest) -> SimulateResponse:
    """
    Simulate a DFA on a given input string.

    - If `dfa_id` is omitted, the default "even number of 1s" DFA is used.
    - You can also pass a full DFA description in `dfa` to simulate arbitrary machines.
    """
    dfa = _resolve_dfa(request)
    accepted, trace, message = dfa.process_string(request.input_string)
    return SimulateResponse(accepted=accepted, trace=trace, message=message)


# Optional: handy entry point for `python main.py`
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )