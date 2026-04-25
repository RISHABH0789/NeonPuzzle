# 🟦 Neon Puzzle

**Neon Puzzle** is a high-contrast, logic-based pathfinding game built with a focus on "vibe coding" aesthetics and smooth procedural generation. Challenge your brain across multiple difficulties, secure the grid, and claim your spot on the global leaderboard.


## 🚀 Live Demo
Play the game here: [neonpuzzle.vercel.app](https://neonpuzzle.vercel.app)

## 🎨 Design Philosophy: "Vibe Coding"
This project was born from an experiment in mixing raw AI-assisted logic with a specific visual identity. 
- **Palette:** Deep Black (#0a0b10), Vivid Orange (#ff8800), and Electric Cyan (#00C7FF).
- **Aesthetic:** A terminal-style, high-contrast neon environment designed for focus and immersion.

## 🛠️ Tech Stack
- **Frontend:** Vanilla JavaScript, HTML5 Canvas, CSS3.
- **Backend:** [Supabase](https://supabase.com/) (PostgreSQL) for real-time leaderboard management.
- **Hosting:** [Vercel](https://vercel.com/).
- **Architecture:** Procedural backtracking algorithm for 100% solvable level generation.

## 🧠 Key Features
- **Smart Level Generator:** Uses a recursive backtracking algorithm to ensure every generated puzzle is solvable and free of "island" traps.
- **Global Leaderboard:** Synchronized data fetching to track the fastest completion times across Easy, Medium, and Hard modes.
- **Anti-Cheat Protocol:** Server-side validation requirements to ensure integrity in competitive rankings.
- **Mobile Responsive:** Fully optimized for touch controls and various screen aspect ratios.

## 📂 Project Structure
```text
├── index.html          # Main Menu & Game Hub
├── game.html           # The Grid Interface
├── game.js             # Core Engine & Pathfinding Logic
├── leaderboard.html    # Global Rankings
├── tutorial.html       # How-to-play Guide
├── privacy.html        # AdSense Compliant Privacy Policy
└── about.html          # Developer Profile & Debug Protocol
```
## 🔧 Installation & Local Setup<br>
1. Clone the repository:
```
git clone [https://github.com/RISHABH0789/neon-puzzle.git](https://github.com/RISHABH0789/neon-puzzle.git)
```
2. Set up your Supabase environment variables:
Create a .env or include your SB_URL and SB_KEY in your configuration script.
3. Open index.html in any modern web browser.
## 🛠️ Debug Protocol
Found a glitch in the system?
Capture a screenshot and transmit it via the channels listed in the About page. System anomalies are patched with high priority.
## 👤 Developer
NYX – Student & Aspiring Game Engineer.

"If you can imagine it, do your best to make it in this AI era and get the experience."
<hr>
Inspired by classic logic puzzles. Developed with passion for clean code and dark mode.
