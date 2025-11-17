from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Tuple


@dataclass
class DFA:
    """
    Core DFA engine used by the backend API.

    This mirrors the DFA class you wrote in your Python example.
    """

    states: List[str]
    alphabet: List[str]
    transitions: Dict[Tuple[str, str], str]
    start_state: str
    final_states: List[str]

    def process_string(self, input_string: str) -> Tuple[bool, List[str], str]:
        """Process input string and return (accepted, trace, message)."""
        current_state = self.start_state
        trace = [current_state]

        for symbol in input_string:
            if symbol not in self.alphabet:
                return False, trace, f"Invalid symbol: {symbol}"

            key = (current_state, symbol)
            if key not in self.transitions:
                return False, trace, f"No transition from {current_state} on {symbol}"

            current_state = self.transitions[key]
            trace.append(current_state)

        accepted = current_state in self.final_states
        return accepted, trace, "Accepted" if accepted else "Rejected"

    def is_valid(self) -> Tuple[bool, str]:
        """Check if DFA is properly defined."""
        for state in self.states:
            for symbol in self.alphabet:
                if (state, symbol) not in self.transitions:
                    return False, f"Missing transition: ({state}, {symbol})"
        return True, "Valid DFA"


def create_even_ones_dfa() -> DFA:
    """DFA that accepts strings with an even number of 1s."""
    return DFA(
        states=["q0", "q1"],
        alphabet=["0", "1"],
        transitions={
            ("q0", "0"): "q0",
            ("q0", "1"): "q1",
            ("q1", "0"): "q1",
            ("q1", "1"): "q0",
        },
        start_state="q0",
        final_states=["q0"],
    )


def dfa_from_dict(data: dict) -> DFA:
    """
    Helper to construct a DFA from a JSON-like dict payload.

    Expected shape:
      {
        "states": [...],
        "alphabet": [...],
        "transitions": { "q0": {"0": "q0", "1": "q1"}, ... },
        "start_state": "q0",
        "final_states": [...]
      }
    """
    transitions_table: Dict[Tuple[str, str], str] = {}
    raw_transitions = data.get("transitions", {})

    for state, mapping in raw_transitions.items():
        for symbol, next_state in mapping.items():
            transitions_table[(state, symbol)] = next_state

    return DFA(
        states=list(data.get("states", [])),
        alphabet=list(data.get("alphabet", [])),
        transitions=transitions_table,
        start_state=data.get("start_state") or data.get("startState", ""),
        final_states=list(data.get("final_states") or data.get("finalStates") or []),
    )


