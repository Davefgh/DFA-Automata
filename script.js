// --- Challenge definitions (equivalent to challenges.js) ---

const challenges = [
  {
    id: 1,
    level: 1,
    name: "Even Ones",
    description: "Accept strings with an even number of 1s.",
    dfa: {
      states: ["q0", "q1"],
      alphabet: ["0", "1"],
      transitions: {
        q0: { 0: "q0", 1: "q1" },
        q1: { 0: "q1", 1: "q0" },
      },
      startState: "q0",
      finalStates: ["q0"],
      labels: {
        q0: "Even 1s",
        q1: "Odd 1s",
      },
    },
    examples: ["00", "11", "0110"],
  },
  // You can add more challenge levels here later.
];

// --- DFA Engine (JS port of your Python DFA class) ---

class DFA {
  constructor(states, alphabet, transitions, startState, finalStates) {
    this.states = states;
    this.alphabet = alphabet;
    this.transitions = transitions;
    this.startState = startState;
    this.finalStates = finalStates;
  }

  processString(inputString) {
    let currentState = this.startState;
    const trace = [currentState];

    for (const symbol of inputString) {
      if (!this.alphabet.includes(symbol)) {
        return {
          accepted: false,
          trace,
          message: `Invalid symbol: ${symbol}`,
        };
      }

      const stateTransitions = this.transitions[currentState] || {};
      const next = stateTransitions[symbol];
      if (!next) {
        return {
          accepted: false,
          trace,
          message: `No transition from ${currentState} on ${symbol}`,
        };
      }

      currentState = next;
      trace.push(currentState);
    }

    const accepted = this.finalStates.includes(currentState);
    return {
      accepted,
      trace,
      message: accepted ? "Accepted" : "Rejected",
    };
  }
}

// --- UI Wiring ---

const stateContainer = document.getElementById("dfa-states");
const challengeNameEl = document.getElementById("challenge-name");
const challengeDescEl = document.getElementById("challenge-description");
const challengeExamplesEl = document.getElementById("challenge-examples");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const inputEl = document.getElementById("input-string");
const runBtn = document.getElementById("run-btn");
const resetBtn = document.getElementById("reset-btn");
const resultMessageEl = document.getElementById("result-message");
const hintBtn = document.getElementById("hint-btn");
const hintModal = document.getElementById("hint-modal");
const hintClose = document.getElementById("hint-close");

let currentChallengeIndex = 0;
let currentDFA = null;
let score = 0;

function loadChallenge(index) {
  const challenge = challenges[index];
  if (!challenge) return;

  levelEl.textContent = challenge.level;
  challengeNameEl.textContent = challenge.name;
  challengeDescEl.textContent = challenge.description;
  challengeExamplesEl.textContent = challenge.examples.join(", ");

  currentDFA = new DFA(
    challenge.dfa.states,
    challenge.dfa.alphabet,
    challenge.dfa.transitions,
    challenge.dfa.startState,
    challenge.dfa.finalStates
  );

  renderStates(challenge);
  clearResult();
}

function renderStates(challenge) {
  stateContainer.innerHTML = "";
  const { states, finalStates, labels } = challenge.dfa;

  states.forEach((stateName) => {
    const isFinal = finalStates.includes(stateName);

    const node = document.createElement("div");
    node.className = "dfa-state";
    if (isFinal) node.classList.add("final");
    if (stateName === challenge.dfa.startState) node.classList.add("active");
    node.dataset.state = stateName;

    const label = document.createElement("div");
    label.className = "dfa-state-label";
    label.textContent = stateName;

    const subtitle = document.createElement("div");
    subtitle.className = "dfa-state-subtitle";
    subtitle.textContent = labels?.[stateName] || "";

    node.appendChild(label);
    node.appendChild(subtitle);

    if (isFinal) {
      const badge = document.createElement("div");
      badge.className = "dfa-badge";
      badge.textContent = "✓";
      node.appendChild(badge);
    }

    const chips = document.createElement("div");
    chips.className = "transition-chips";

    const alphabet = challenge.dfa.alphabet;
    alphabet.forEach((sym) => {
      const chip = document.createElement("div");
      chip.className = "chip";
      const target = challenge.dfa.transitions[stateName]?.[sym] ?? "—";
      chip.innerHTML = `<span>${sym} → ${target}</span>`;
      chips.appendChild(chip);
    });

    node.appendChild(chips);
    stateContainer.appendChild(node);
  });
}

function setActiveState(stateName) {
  const nodes = stateContainer.querySelectorAll(".dfa-state");
  nodes.forEach((node) => {
    node.classList.toggle("active", node.dataset.state === stateName);
  });
}

function clearResult() {
  resultMessageEl.textContent = "";
  resultMessageEl.className = "result-message";
  setActiveState(challenges[currentChallengeIndex].dfa.startState);
}

async function runSimulation() {
  const input = (inputEl.value || "").trim();
  if (!input) {
    resultMessageEl.textContent = "Please enter a binary string.";
    resultMessageEl.className = "result-message error";
    return;
  }

  const result = currentDFA.processString(input);

  const { trace, accepted, message } = result;

  // Animate through the trace
  for (let i = 0; i < trace.length; i++) {
    setActiveState(trace[i]);
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  if (accepted) {
    resultMessageEl.textContent = `Accepted • Trace: ${trace.join(" → ")}`;
    resultMessageEl.className = "result-message success";
    score += 10;
    scoreEl.textContent = String(score);
  } else {
    resultMessageEl.textContent = `${message} • Trace: ${trace.join(" → ")}`;
    resultMessageEl.className = "result-message error";
  }
}

runBtn.addEventListener("click", runSimulation);
resetBtn.addEventListener("click", () => {
  inputEl.value = "";
  clearResult();
});

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    runSimulation();
  }
});

function openHint() {
  if (!hintModal) return;
  hintModal.classList.add("open");
  hintModal.setAttribute("aria-hidden", "false");
}

function closeHint() {
  if (!hintModal) return;
  hintModal.classList.remove("open");
  hintModal.setAttribute("aria-hidden", "true");
}

hintBtn?.addEventListener("click", openHint);
hintClose?.addEventListener("click", closeHint);
hintModal?.addEventListener("click", (e) => {
  if (e.target === hintModal || e.target.classList.contains("hint-backdrop")) {
    closeHint();
  }
});

// Initial load
loadChallenge(0);


