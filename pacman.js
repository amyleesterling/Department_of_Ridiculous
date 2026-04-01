/* PAC-MAN: Political Action Committee Man
   A PAC gobbles donations while fleeing regulatory oversight.
   Power pellets are Citizens United rulings. */
(function () {
  const TILE = 24;
  const MAZE_DEF = [
    "1111111111111111111",
    "1o...o..1o..o...o1",
    "1.11.11.1.11.11.o1",
    "1O1..o1.1.1o..1O.1",
    "1.1.11......11.1.1",
    "1...o...1o..o..oo1",
    "1.11.11.1.11.11.o1",
    "1..1..1...1..1...1",
    "11.1.o11111o.1.111",
    "1....1GGGGG1....o1",
    "1.11.1G...G1.11.o1",
    "1o...o.G.G..o..o.1",
    "1.11.1.....1.11.o1",
    "11.1.1111111.1.111",
    "1..1...o.....1..o1",
    "1.11.11.1.11.11.o1",
    "1o..o..o1o..o..o.1",
    "1.11.11.1.11.11.o1",
    "1O.1.o.o.o...1.O.1",
    "1..........P.....1",
    "1111111111111111111",
  ];
  const ROWS = MAZE_DEF.length;
  const COLS = MAZE_DEF[0].length;
  const W = COLS * TILE;
  const H = ROWS * TILE;

  const GHOST_INFO = [
    { name: "FEC", color: "#ff3b30" },
    { name: "ETHICS", color: "#ff6eb4" },
    { name: "AUDIT", color: "#53e0d7" },
    { name: "REFORM", color: "#ff8e5e" },
  ];

  const FRIGHTENED_COLOR = "#2233aa";
  const COIN_COLOR = "#d4a017";
  const PAC_COLOR = "#ffd93d";
  const WALL_COLOR = "#1a2744";
  const WALL_STROKE = "#3a5080";
  const BG_COLOR = "#0a0e1a";

  let canvas, ctx, maze, pacman, ghosts, coins, powerPellets;
  let totalCoins, score, lives, gameState, frightenedTimer;
  let lastTime, accumulator, rafId, overlay, shell;
  const TICK = 1000 / 60;
  const PAC_SPEED = 0.09;
  const GHOST_SPEED = 0.065;
  const GHOST_FRIGHTENED_SPEED = 0.04;
  const FRIGHTENED_DURATION = 6000;

  function buildMaze() {
    maze = [];
    coins = [];
    powerPellets = [];
    ghosts = [];
    pacman = null;
    let ghostIdx = 0;
    for (let r = 0; r < ROWS; r++) {
      maze[r] = [];
      for (let c = 0; c < COLS; c++) {
        const ch = MAZE_DEF[r][c];
        if (ch === "1") {
          maze[r][c] = 1; // wall
        } else {
          maze[r][c] = 0;
          if (ch === "o" || ch === ".") coins.push({ r, c });
          if (ch === "O") powerPellets.push({ r, c });
          if (ch === "P") {
            pacman = { r, c, dr: 0, dc: -1, nextDr: 0, nextDc: -1, mouth: 0, mouthDir: 1 };
          }
          if (ch === "G" && ghostIdx < GHOST_INFO.length) {
            ghosts.push({
              r, c,
              dr: 0, dc: ghostIdx % 2 === 0 ? -1 : 1,
              ...GHOST_INFO[ghostIdx],
              frightened: false,
              eaten: false,
              homeR: r, homeC: c,
            });
            ghostIdx++;
          }
        }
      }
    }
    totalCoins = coins.length + powerPellets.length;
    // fill remaining ghosts if maze didn't have enough G spots
    while (ghosts.length < 4) {
      const info = GHOST_INFO[ghosts.length];
      ghosts.push({
        r: 10, c: 9, dr: 0, dc: 1,
        ...info, frightened: false, eaten: false, homeR: 10, homeC: 9,
      });
    }
  }

  function isWall(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return true;
    return maze[r][c] === 1;
  }

  function canMove(r, c, dr, dc) {
    const nr = Math.round(r + dr);
    const nc = Math.round(c + dc);
    return !isWall(nr, nc);
  }

  function moveEntity(e, speed) {
    const nr = e.r + e.dr * speed;
    const nc = e.c + e.dc * speed;
    const targetR = Math.round(e.r + e.dr);
    const targetC = Math.round(e.c + e.dc);
    if (isWall(targetR, targetC)) return;
    e.r = nr;
    e.c = nc;
    // snap to grid when close
    if (Math.abs(e.r - Math.round(e.r)) < speed * 1.1 &&
        Math.abs(e.c - Math.round(e.c)) < speed * 1.1) {
      e.r = Math.round(e.r);
      e.c = Math.round(e.c);
    }
  }

  function updatePacman() {
    // try next direction first
    const snappedR = Math.round(pacman.r);
    const snappedC = Math.round(pacman.c);
    const atGrid = Math.abs(pacman.r - snappedR) < 0.05 && Math.abs(pacman.c - snappedC) < 0.05;

    if (atGrid && canMove(snappedR, snappedC, pacman.nextDr, pacman.nextDc)) {
      pacman.dr = pacman.nextDr;
      pacman.dc = pacman.nextDc;
      pacman.r = snappedR;
      pacman.c = snappedC;
    }

    moveEntity(pacman, PAC_SPEED);

    // eat coins
    const pr = Math.round(pacman.r);
    const pc = Math.round(pacman.c);
    const ci = coins.findIndex((coin) => coin.r === pr && coin.c === pc);
    if (ci !== -1) {
      coins.splice(ci, 1);
      score += 10;
    }

    // eat power pellets
    const pi = powerPellets.findIndex((p) => p.r === pr && p.c === pc);
    if (pi !== -1) {
      powerPellets.splice(pi, 1);
      score += 50;
      frightenedTimer = FRIGHTENED_DURATION;
      ghosts.forEach((g) => {
        if (!g.eaten) g.frightened = true;
      });
    }

    // mouth animation
    pacman.mouth += 0.12 * pacman.mouthDir;
    if (pacman.mouth > 0.9) pacman.mouthDir = -1;
    if (pacman.mouth < 0.05) pacman.mouthDir = 1;

    // win check
    if (coins.length === 0 && powerPellets.length === 0) {
      gameState = "win";
    }
  }

  function ghostAI(g) {
    const gr = Math.round(g.r);
    const gc = Math.round(g.c);
    const atGrid = Math.abs(g.r - gr) < 0.03 && Math.abs(g.c - gc) < 0.03;
    if (!atGrid) return;

    g.r = gr;
    g.c = gc;

    if (g.eaten) {
      // return home
      const dr = Math.sign(g.homeR - gr);
      const dc = Math.sign(g.homeC - gc);
      if (gr === g.homeR && gc === g.homeC) {
        g.eaten = false;
        g.frightened = false;
        return;
      }
      if (dr !== 0 && canMove(gr, gc, dr, 0)) { g.dr = dr; g.dc = 0; return; }
      if (dc !== 0 && canMove(gr, gc, 0, dc)) { g.dr = 0; g.dc = dc; return; }
    }

    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    const valid = dirs.filter(([dr, dc]) => {
      if (dr === -g.dr && dc === -g.dc) return false; // no 180
      return canMove(gr, gc, dr, dc);
    });

    if (valid.length === 0) {
      g.dr = -g.dr;
      g.dc = -g.dc;
      return;
    }

    if (g.frightened) {
      // run away from pacman
      valid.sort((a, b) => {
        const da = Math.abs(pacman.r - (gr + a[0])) + Math.abs(pacman.c - (gc + a[1]));
        const db = Math.abs(pacman.r - (gr + b[0])) + Math.abs(pacman.c - (gc + b[1]));
        return db - da;
      });
    } else {
      // chase pacman with some randomness
      if (Math.random() < 0.7) {
        valid.sort((a, b) => {
          const da = Math.abs(pacman.r - (gr + a[0])) + Math.abs(pacman.c - (gc + a[1]));
          const db = Math.abs(pacman.r - (gr + b[0])) + Math.abs(pacman.c - (gc + b[1]));
          return da - db;
        });
      } else {
        // random
        valid.sort(() => Math.random() - 0.5);
      }
    }

    g.dr = valid[0][0];
    g.dc = valid[0][1];
  }

  function updateGhosts(dt) {
    if (frightenedTimer > 0) {
      frightenedTimer -= dt;
      if (frightenedTimer <= 0) {
        ghosts.forEach((g) => { g.frightened = false; });
      }
    }

    ghosts.forEach((g) => {
      ghostAI(g);
      const speed = g.eaten ? GHOST_SPEED * 1.8 : g.frightened ? GHOST_FRIGHTENED_SPEED : GHOST_SPEED;
      moveEntity(g, speed);

      // collision with pacman
      const dist = Math.abs(g.r - pacman.r) + Math.abs(g.c - pacman.c);
      if (dist < 0.6) {
        if (g.frightened && !g.eaten) {
          g.eaten = true;
          g.frightened = false;
          score += 200;
        } else if (!g.eaten) {
          lives--;
          if (lives <= 0) {
            gameState = "dead";
          } else {
            resetPositions();
          }
        }
      }
    });
  }

  function resetPositions() {
    // find P position
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (MAZE_DEF[r][c] === "P") {
          pacman.r = r; pacman.c = c;
          pacman.dr = 0; pacman.dc = -1;
          pacman.nextDr = 0; pacman.nextDc = -1;
        }
      }
    }
    ghosts.forEach((g, i) => {
      g.r = g.homeR; g.c = g.homeC;
      g.dr = 0; g.dc = i % 2 === 0 ? -1 : 1;
      g.frightened = false; g.eaten = false;
    });
    frightenedTimer = 0;
  }

  function drawWalls() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (maze[r][c] !== 1) continue;
        const x = c * TILE;
        const y = r * TILE;
        ctx.fillStyle = WALL_COLOR;
        ctx.fillRect(x, y, TILE, TILE);
        // draw visible edges
        ctx.strokeStyle = WALL_STROKE;
        ctx.lineWidth = 1.5;
        if (r > 0 && maze[r-1][c] !== 1) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + TILE, y); ctx.stroke(); }
        if (r < ROWS-1 && maze[r+1][c] !== 1) { ctx.beginPath(); ctx.moveTo(x, y + TILE); ctx.lineTo(x + TILE, y + TILE); ctx.stroke(); }
        if (c > 0 && maze[r][c-1] !== 1) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + TILE); ctx.stroke(); }
        if (c < COLS-1 && maze[r][c+1] !== 1) { ctx.beginPath(); ctx.moveTo(x + TILE, y); ctx.lineTo(x + TILE, y + TILE); ctx.stroke(); }
      }
    }
  }

  function drawCoins() {
    coins.forEach(({ r, c }) => {
      const x = c * TILE + TILE / 2;
      const y = r * TILE + TILE / 2;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = COIN_COLOR;
      ctx.fill();
      // $ sign
      ctx.fillStyle = "#8b6914";
      ctx.font = "bold 7px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", x, y + 0.5);
    });
  }

  function drawPowerPellets(now) {
    const pulse = 0.7 + Math.sin(now / 200) * 0.3;
    powerPellets.forEach(({ r, c }) => {
      const x = c * TILE + TILE / 2;
      const y = r * TILE + TILE / 2;
      ctx.beginPath();
      ctx.arc(x, y, 7 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,230,78,${0.6 + pulse * 0.3})`;
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 5px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("CU", x, y + 0.5);
    });
  }

  function drawPacman() {
    const x = pacman.c * TILE + TILE / 2;
    const y = pacman.r * TILE + TILE / 2;
    const angle = Math.atan2(pacman.dr, pacman.dc);
    const mouthAngle = pacman.mouth * 0.4;

    ctx.beginPath();
    ctx.arc(x, y, TILE / 2 - 2, angle + mouthAngle, angle + Math.PI * 2 - mouthAngle);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = PAC_COLOR;
    ctx.fill();

    // eye
    const eyeX = x + Math.cos(angle - 0.6) * 5;
    const eyeY = y + Math.sin(angle - 0.6) * 5;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#14213d";
    ctx.fill();
  }

  function drawGhosts(now) {
    ghosts.forEach((g) => {
      const x = g.c * TILE + TILE / 2;
      const y = g.r * TILE + TILE / 2;
      const r = TILE / 2 - 2;

      if (g.eaten) {
        // just eyes
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "bold 8px 'IBM Plex Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(g.name, x, y);
        return;
      }

      const color = g.frightened
        ? (frightenedTimer < 2000 && Math.floor(now / 200) % 2 ? "#ffffff" : FRIGHTENED_COLOR)
        : g.color;

      // ghost body
      ctx.beginPath();
      ctx.arc(x, y - 2, r, Math.PI, 0);
      ctx.lineTo(x + r, y + r - 2);
      // wavy bottom
      const segments = 3;
      const segW = (r * 2) / segments;
      for (let i = 0; i < segments; i++) {
        const sx = x + r - i * segW;
        const cp = y + r - 2 + (i % 2 === 0 ? -4 : 2);
        ctx.quadraticCurveTo(sx - segW / 2, cp, sx - segW, y + r - 2);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // eyes
      if (!g.frightened) {
        const edx = g.dc * 2;
        const edy = g.dr * 2;
        [-3, 3].forEach((ox) => {
          ctx.beginPath();
          ctx.arc(x + ox, y - 3, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + ox + edx, y - 3 + edy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#14213d";
          ctx.fill();
        });
      } else {
        // frightened face
        ctx.fillStyle = "#fff";
        ctx.font = "7px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("~ ~", x, y - 1);
      }

      // label
      ctx.fillStyle = g.frightened ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.9)";
      ctx.font = "bold 7px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(g.name, x, y + r + 6);
    });
  }

  function drawHUD() {
    // score
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px 'Outfit', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("$" + score.toLocaleString(), 8, H + 18);

    // lives
    ctx.textAlign = "right";
    for (let i = 0; i < lives; i++) {
      ctx.beginPath();
      ctx.arc(W - 14 - i * 22, H + 14, 8, 0.25, Math.PI * 2 - 0.25);
      ctx.lineTo(W - 14 - i * 22, H + 14);
      ctx.closePath();
      ctx.fillStyle = PAC_COLOR;
      ctx.fill();
    }
  }

  function render(now) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWalls();
    drawCoins();
    drawPowerPellets(now);
    drawPacman();
    drawGhosts(now);
    drawHUD();

    if (gameState === "dead") {
      ctx.fillStyle = "rgba(10,14,26,0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ff3b30";
      ctx.font = "bold 22px 'Outfit', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("REGULATORY CAPTURE", W / 2, H / 2 - 14);
      ctx.fillStyle = "#fff";
      ctx.font = "14px 'Outfit', sans-serif";
      ctx.fillText("$" + score.toLocaleString() + " lobbied", W / 2, H / 2 + 10);
      ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.fillText("PRESS SPACE TO REFILE", W / 2, H / 2 + 34);
    }

    if (gameState === "win") {
      ctx.fillStyle = "rgba(10,14,26,0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = COIN_COLOR;
      ctx.font = "bold 20px 'Outfit', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("FULLY FUNDED", W / 2, H / 2 - 14);
      ctx.fillStyle = "#fff";
      ctx.font = "14px 'Outfit', sans-serif";
      ctx.fillText("$" + score.toLocaleString() + " raised", W / 2, H / 2 + 10);
      ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.fillText("PRESS SPACE FOR NEXT CYCLE", W / 2, H / 2 + 34);
    }

    if (gameState === "ready") {
      ctx.fillStyle = "rgba(10,14,26,0.55)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = PAC_COLOR;
      ctx.font = "bold 20px 'Outfit', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PAC-MAN", W / 2, H / 2 - 32);
      ctx.fillStyle = "#fff";
      ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.fillText("POLITICAL ACTION COMMITTEE MAN", W / 2, H / 2 - 12);
      ctx.fillText("EAT $ · DODGE REGULATORS", W / 2, H / 2 + 8);
      ctx.fillStyle = "rgba(200,230,78,0.9)";
      ctx.fillText("CU PELLETS = CITIZENS UNITED", W / 2, H / 2 + 26);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText("ARROW KEYS TO MOVE · SPACE TO START", W / 2, H / 2 + 50);
    }
  }

  function gameLoop(now) {
    if (!shell || shell.classList.contains("hidden")) {
      rafId = null;
      return;
    }

    if (!lastTime) lastTime = now;
    const dt = Math.min(now - lastTime, 50);
    lastTime = now;

    if (gameState === "playing") {
      accumulator += dt;
      while (accumulator >= TICK) {
        updatePacman();
        updateGhosts(TICK);
        accumulator -= TICK;
        if (gameState !== "playing") break;
      }
    }

    render(now);
    rafId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    buildMaze();
    score = 0;
    lives = 3;
    frightenedTimer = 0;
    gameState = "ready";
    lastTime = 0;
    accumulator = 0;
  }

  function handleKey(e) {
    if (!shell || shell.classList.contains("hidden")) return;

    if (gameState === "ready" && e.key === " ") {
      e.preventDefault();
      gameState = "playing";
      return;
    }

    if ((gameState === "dead" || gameState === "win") && e.key === " ") {
      e.preventDefault();
      startGame();
      gameState = "playing";
      return;
    }

    if (gameState !== "playing") return;

    switch (e.key) {
      case "ArrowLeft":  e.preventDefault(); pacman.nextDr = 0;  pacman.nextDc = -1; break;
      case "ArrowRight": e.preventDefault(); pacman.nextDr = 0;  pacman.nextDc = 1;  break;
      case "ArrowUp":    e.preventDefault(); pacman.nextDr = -1; pacman.nextDc = 0;  break;
      case "ArrowDown":  e.preventDefault(); pacman.nextDr = 1;  pacman.nextDc = 0;  break;
    }
  }

  function openPacman() {
    if (!canvas) initDOM();
    shell.classList.remove("hidden");
    shell.setAttribute("aria-hidden", "false");
    startGame();
    render(performance.now());
    if (!rafId) rafId = requestAnimationFrame(gameLoop);
  }

  function closePacman() {
    shell.classList.add("hidden");
    shell.setAttribute("aria-hidden", "true");
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    lastTime = 0;
  }

  function initDOM() {
    shell = document.createElement("div");
    shell.className = "pacman-shell hidden";
    shell.id = "pacmanShell";
    shell.setAttribute("aria-hidden", "true");

    const backdrop = document.createElement("div");
    backdrop.className = "pacman-backdrop";
    backdrop.addEventListener("click", closePacman);

    const card = document.createElement("div");
    card.className = "pacman-card";

    const header = document.createElement("div");
    header.className = "pacman-header";
    header.innerHTML = `
      <div>
        <p class="panel-kicker">Recreational lobbying exercise</p>
        <h2>PAC-MAN</h2>
      </div>
      <button class="composer-close" aria-label="Close game">X</button>
    `;
    header.querySelector("button").addEventListener("click", closePacman);

    canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H + 28;
    canvas.className = "pacman-canvas";
    ctx = canvas.getContext("2d");

    card.appendChild(header);
    card.appendChild(canvas);
    shell.appendChild(backdrop);
    shell.appendChild(card);
    document.body.appendChild(shell);
  }

  document.addEventListener("keydown", handleKey);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && shell && !shell.classList.contains("hidden")) closePacman();
  });

  window.openPacman = openPacman;
})();
