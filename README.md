# DFA Automata - Regex Runner 🎯

An interactive web-based visualizer for Deterministic Finite Automata (DFA) with a FastAPI backend. Built as a final project for Automata Theory course to demonstrate regular language recognition through gamification.

![DFA Visualizer](assets/images/demo.gif)

## 🌟 Features

- **Interactive DFA Visualization** - Watch state transitions in real-time
- **Step-by-Step Animation** - See how each character is processed
- **Multiple Challenge Levels** - Test different DFA patterns
- **Score Tracking System** - Gamified learning experience
- **Transition History** - Complete trace of state changes
- **FastAPI Backend** - RESTful API for DFA simulation
- **Custom DFA Support** - Define and test your own automata
- **Responsive Design** - Works on desktop and mobile devices

## 🎓 Educational Objectives

This project demonstrates fundamental concepts in automata theory:

### DFA 5-Tuple Representation
- **Q** (States): Finite set of states {q0, q1, ...}
- **Σ** (Alphabet): Input symbols {0, 1}
- **δ** (Transition Function): State transition logic
- **q0** (Start State): Initial state
- **F** (Final States): Accepting states

### Default Language
**L = {w ∈ {0,1}* | w has an even number of 1s}**

#### Test Cases
- ✅ **Accepted**: "", "00", "11", "0110", "1100", "1001"
- ❌ **Rejected**: "1", "10", "101", "001", "111"

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Modern web browser (Chrome, Firefox, Edge)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Davefgh/DFA-Automata.git
   cd DFA-Automata
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run the backend server**
   ```bash
   python main.py
   ```

4. **Open in browser**
   ```
   http://127.0.0.1:8000
   ```

### Alternative: Frontend Only (No Backend)

If you only want to run the frontend visualization:

```bash
# From project root
python -m http.server 8000
```

Then open: `http://127.0.0.1:8000/index.html`

## 📁 Project Structure

```
DFA-Automata/
│
├── backend/                       # FastAPI backend
│   ├── main.py                    # API server with static file serving
│   ├── dfa_engine.py              # Core DFA simulation logic
│   └── requirements.txt           # Python dependencies
│
├── assets/                        # Static assets
│   └── images/                    
│       ├── logo.png
│       └── demo.gif
│
├── examples/                      # Sample DFA configurations
│   └── sample-dfas.json
│
├── index.html                     # Main HTML interface
├── style.css                      # Styling with glassmorphism effects
├── script.js                      # Frontend DFA logic & animations
└── README.md                      # This file
```

## 🎮 How to Use

### Basic Usage

1. **Enter a binary string** (using only 0s and 1s)
   ```
   Example: 0110
   ```

2. **Click the "Run" button** to start the simulation

3. **Watch the animation** as the DFA processes each character

4. **View the result** - Accepted ✓ or Rejected ✗

5. **Check the transition history** to understand the state changes

### Challenge Levels

#### Level 1: Even Number of 1s
- Language: Strings with an even count of 1s
- Examples: `00`, `11`, `0110`

#### Level 2: Ends with "01" (Future)
- Language: Strings ending with the pattern "01"
- Examples: `01`, `1001`, `0001`

#### Level 3: Contains "11" (Future)
- Language: Strings containing "11" as a substring
- Examples: `011`, `110`, `0110`

## 🔧 API Documentation

### Endpoints

#### `GET /`
Serves the main web interface

#### `GET /health`
Health check endpoint
```json
{
  "status": "ok"
}
```

#### `POST /simulate`
Simulate a DFA on an input string

**Request Body:**
```json
{
  "input_string": "0110",
  "dfa_id": "even_ones"
}
```

**Response:**
```json
{
  "accepted": true,
  "trace": ["q0", "q0", "q1", "q1", "q0"],
  "message": "Accepted"
}
```

#### Custom DFA Simulation
```json
{
  "input_string": "101",
  "dfa": {
    "states": ["q0", "q1"],
    "alphabet": ["0", "1"],
    "transitions": {
      "q0": {"0": "q0", "1": "q1"},
      "q1": {"0": "q1", "1": "q0"}
    },
    "startState": "q0",
    "finalStates": ["q0"]
  }
}
```

### Interactive API Documentation
Visit `http://127.0.0.1:8000/docs` for Swagger UI documentation

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with glassmorphism effects
- **Vanilla JavaScript** - DFA simulation and animations
- **Responsive Design** - Mobile-friendly interface

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Python 3.8+** - Core logic

### Libraries
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pydantic` - Data models

## 🎨 Design Features

- **Dark Theme** - Easy on the eyes with black/white contrast
- **Glassmorphism Effects** - Modern frosted-glass aesthetic
- **Smooth Animations** - 800ms transitions between states
- **Visual Feedback** - Color-coded states (active, final, normal)
- **Responsive Layout** - Adapts to different screen sizes
- **Accessibility** - Clear labels and semantic HTML

## 📚 Automata Theory Concepts

### What is a DFA?
A Deterministic Finite Automaton is a theoretical model of computation that:
- Has a finite number of states
- Reads input symbols one at a time
- Transitions deterministically between states
- Accepts or rejects based on the final state

### Regular Languages
Languages recognized by DFAs are called **regular languages**. They can be:
- Described by regular expressions
- Recognized by finite automata
- Generated by regular grammars

### Example: Even 1s DFA

```
State Diagram:

    0        1        0
q0 ⟲ ----→ q1 ⟲
↑           |
└───── 1 ───┘

q0: Even number of 1s (Final State) ✓
q1: Odd number of 1s
```

## 🧪 Testing

### Manual Testing
1. Test accepted strings: `""`, `"00"`, `"11"`, `"0110"`
2. Test rejected strings: `"1"`, `"10"`, `"101"`
3. Test invalid input: `"abc"`, `"2"`, `"01a"`

### Expected Behavior
- Empty string should be accepted (even number of 1s = 0)
- Single "1" should be rejected
- "11" should be accepted (two 1s)
- Invalid characters should show error message

## 🚧 Future Enhancements

- [ ] DFA Builder Mode - Visual editor for creating custom DFAs
- [ ] More Challenge Levels - Additional language patterns
- [ ] NFA Support - Non-deterministic finite automata
- [ ] Regex to DFA Converter - Generate DFA from regular expressions
- [ ] Export/Import DFAs - Save and load custom automata
- [ ] Multiplayer Mode - Competitive string validation
- [ ] Leaderboard System - Track top scores
- [ ] Mobile App Version - Native iOS/Android apps
- [ ] Step-Back Feature - Reverse the simulation
- [ ] Tutorial Mode - Guided learning experience

## 👥 Authors

- **Davefgh** - Initial work - [GitHub Profile](https://github.com/Davefgh)

## 📅 Project Timeline

- **Week 1**: Research & Planning
- **Week 2**: Core DFA Engine Development
- **Week 3**: Frontend Visualization
- **Week 4**: Backend API Integration
- **Week 5**: Testing & Polish

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Automata Theory course instructors
- Inspiration from theoretical computer science
- FastAPI documentation and community
- Claude AI for development assistance

## 📧 Contact

**Project Repository**: [https://github.com/Davefgh/DFA-Automata](https://github.com/Davefgh/DFA-Automata)

**Project Fair Presentation**: November 2025

---

## 📸 Screenshots

### Main Interface
![Main Interface](assets/images/screenshot-main.png)

### Processing Animation
![Processing](assets/images/screenshot-processing.png)

### Result Display
![Result](assets/images/screenshot-result.png)

---

## 🎓 Educational Use

This project is designed for:
- Computer Science students learning automata theory
- Educators teaching formal languages and computation
- Anyone interested in understanding how compilers recognize patterns
- Project fair demonstrations and presentations

---

## ⚡ Performance

- **Frontend**: Lightweight, runs entirely in browser
- **Backend**: Fast API responses (<10ms for typical requests)
- **Animation**: Smooth 60fps transitions
- **Memory**: Minimal footprint (~5MB)

---

## 🔐 Security

- No user data collection
- No authentication required
- All processing done client-side or locally
- Safe for educational environments

---

**Made with ❤️ for Automata Theory Final Project**

*Last Updated: November 2025*