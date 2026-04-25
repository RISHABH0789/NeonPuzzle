const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridConfig = {
    size: 5,
    colors: { cyan: '#00C7FF', red: '#ff4444', green: '#00ff88', yellow: '#ffcc00', orange: '#ff8800' }
};

let currentLevel = 1, totalLevels = 5, score = 0, skipsUsed = 0;
let dots = [], isDrawing = false, activeColor = null, currentPath = [], completedPaths = [];

function initCanvas() {
    const savedMode = localStorage.getItem('gameMode') || 'easy';
    gridConfig.size = savedMode === 'hard' ? 9 : (savedMode === 'medium' ? 7 : 5);

    const container = document.getElementById('game-board');
    if (container) { canvas.width = container.clientWidth; canvas.height = container.clientWidth; }

    const skipBtn = document.getElementById('skip-btn');
    if (skipBtn) skipBtn.onclick = skipLevel;

    generateRandomLevel();
    if (currentLevel === 1) startTimer();
    setupInputListeners();
}

// --- NEW BACKTRACKING GENERATOR ---
function generateRandomLevel() {
    let solvable = false;
    let attempts = 0;
    const maxPairs = gridConfig.size === 5 ? 2 : (gridConfig.size === 7 ? 4 : 5);
    const palette = Object.keys(gridConfig.colors);

    while (!solvable && attempts < 100) {
        dots = [];
        let grid = Array(gridConfig.size).fill().map(() => Array(gridConfig.size).fill(null));
        let success = true;

        for (let i = 0; i < maxPairs; i++) {
            let pathFound = false;
            // Try to find a valid path for this color
            for (let retry = 0; retry < 50; retry++) {
                let start = { x: Math.floor(Math.random() * gridConfig.size), y: Math.floor(Math.random() * gridConfig.size) };
                if (grid[start.y][start.x] !== null) continue;

                let path = findPath(start, grid); 
                if (path && path.length > 1) {
                    path.forEach(p => grid[p.y][p.x] = palette[i]);
                    dots.push({ x: path[0].x, y: path[0].y, color: palette[i] });
                    dots.push({ x: path[path.length - 1].x, y: path[path.length - 1].y, color: palette[i] });
                    pathFound = true;
                    break;
                }
            }
            if (!pathFound) { success = false; break; }
        }

        if (success && dots.length === maxPairs * 2) solvable = true;
        attempts++;
    }
    completedPaths = [];
    drawScene();
}

// Generates a random walk path that doesn't block the grid
function findPath(start, grid) {
    let path = [start];
    let curr = start;
    let visited = new Set([`${start.x},${start.y}`]);
    let length = Math.floor(Math.random() * (gridConfig.size)) + 2; 

    for (let i = 0; i < length; i++) {
        let neighbors = [[0,1], [0,-1], [1,0], [-1,0]].map(([dx, dy]) => ({ x: curr.x + dx, y: curr.y + dy }));
        let valid = neighbors.filter(n => 
            n.x >= 0 && n.x < gridConfig.size && 
            n.y >= 0 && n.y < gridConfig.size && 
            grid[n.y][n.x] === null && 
            !visited.has(`${n.x},${n.y}`)
        );

        if (valid.length === 0) break;
        curr = valid[Math.floor(Math.random() * valid.length)];
        path.push(curr);
        visited.add(`${curr.x},${curr.y}`);
    }
    return path;
}

// --- INTERACTION LOGIC ---
function setupInputListeners() {
    const startAction = (e) => {
        const pos = getMousePos(e);
        if (pos.x < 0 || pos.x >= gridConfig.size || pos.y < 0 || pos.y >= gridConfig.size) return;
        
        const dot = dots.find(d => d.x === pos.x && d.y === pos.y);
        if (dot) {
            const pathIdx = completedPaths.findIndex(p => p.path.some(s => s.x === pos.x && s.y === pos.y));
            if (pathIdx !== -1) { completedPaths.splice(pathIdx, 1); drawScene(); return; }
            isDrawing = true; activeColor = dot.color; currentPath = [{ x: dot.x, y: dot.y }];
        }
    };

    const moveAction = (e) => {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        const lastPos = currentPath[currentPath.length - 1];

        if (pos.x < 0 || pos.x >= gridConfig.size || pos.y < 0 || pos.y >= gridConfig.size) {
            isDrawing = false; return;
        }

        if (pos.x !== lastPos.x || pos.y !== lastPos.y) {
            if (Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y) === 1) {
                const hitDot = dots.find(d => d.x === pos.x && d.y === pos.y);
                if (hitDot && hitDot.color !== activeColor) return;
                if (completedPaths.some(p => p.path.some(s => s.x === pos.x && s.y === pos.y)) || currentPath.some(s => s.x === pos.x && s.y === pos.y)) return;
                
                currentPath.push(pos); 
                drawScene();

                if (hitDot && hitDot.color === activeColor && currentPath.length > 1) {
                    completedPaths.push({ color: activeColor, path: [...currentPath] });
                    isDrawing = false; currentPath = []; drawScene();
                    if (completedPaths.length === dots.length / 2) setTimeout(solveLevel, 400);
                }
            }
        }
    };

    canvas.addEventListener('mousedown', startAction);
    window.addEventListener('mousemove', moveAction);
    window.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startAction(e.touches[0]); }, {passive: false});
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); moveAction(e.touches[0]); }, {passive: false});
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const size = canvas.width / gridConfig.size;
    return { x: Math.floor((e.clientX - rect.left) / size), y: Math.floor((e.clientY - rect.top) / size) };
}

function skipLevel() { skipsUsed++; nextLevelSequence(); }
function solveLevel() { score++; nextLevelSequence(); }

function nextLevelSequence() {
    if (currentLevel < totalLevels) { 
        currentLevel++; 
        const lvlDisplay = document.getElementById("level-num");
        if (lvlDisplay) lvlDisplay.textContent = currentLevel.toString().padStart(2, '0');
        generateRandomLevel(); 
    } else {
        localStorage.setItem('nodesSecured', score);
        localStorage.setItem('totalSkips', skipsUsed);
        localStorage.setItem('finalTime', document.getElementById('timer').innerText);
        window.location.href = 'result.html';
    }
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const size = canvas.width / gridConfig.size;
    ctx.strokeStyle = 'rgba(0, 199, 255, 0.1)';
    for (let i = 0; i <= gridConfig.size; i++) {
        ctx.beginPath(); ctx.moveTo(i * size, 0); ctx.lineTo(i * size, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * size); ctx.lineTo(canvas.width, i * size); ctx.stroke();
    }
    const all = [...completedPaths]; if (isDrawing) all.push({ color: activeColor, path: currentPath });
    all.forEach(p => {
        ctx.strokeStyle = gridConfig.colors[p.color]; ctx.lineWidth = size * 0.25; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(p.path[0].x * size + size / 2, p.path[0].y * size + size / 2);
        p.path.forEach(seg => ctx.lineTo(seg.x * size + size / 2, seg.y * size + size / 2)); ctx.stroke();
    });
    dots.forEach(d => {
        ctx.fillStyle = gridConfig.colors[d.color]; ctx.beginPath();
        ctx.arc(d.x * size + size / 2, d.y * size + size / 2, size * 0.3, 0, Math.PI * 2); ctx.fill();
    });
}

let seconds = 0;
function startTimer() {
    setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        const timer = document.getElementById('timer');
        if (timer) timer.innerText = `${mins}:${secs}`;
    }, 1000);
}

window.onload = initCanvas;