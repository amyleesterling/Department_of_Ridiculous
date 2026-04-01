/* Bureaucratic Tetris — words rearrange as institutional gravity takes hold */
(function () {
  const COLS = 10;
  const ROWS = 20;
  const CELL = 30;
  const canvas = document.getElementById("tetrisCanvas");
  const ctx = canvas.getContext("2d");
  const nextCanvas = document.getElementById("tetrisNextCanvas");
  const nextCtx = nextCanvas.getContext("2d");
  const scoreEl = document.getElementById("tetrisScore");
  const linesEl = document.getElementById("tetrisLines");
  const levelEl = document.getElementById("tetrisLevel");
  const overlay = document.getElementById("tetrisOverlay");
  const overlayText = document.getElementById("tetrisOverlayText");
  const startBtn = document.getElementById("tetrisStartBtn");
  const pauseBtn = document.getElementById("tetrisPauseBtn");

  const COLORS = {
    I: "#53e0d7",
    O: "#ffd93d",
    T: "#c584ff",
    S: "#c8e64e",
    Z: "#ff3b30",
    L: "#ff8e5e",
    J: "#5b8fff",
  };

  const SHAPES = {
    I: [[0,0],[1,0],[2,0],[3,0]],
    O: [[0,0],[1,0],[0,1],[1,1]],
    T: [[0,0],[1,0],[2,0],[1,1]],
    S: [[1,0],[2,0],[0,1],[1,1]],
    Z: [[0,0],[1,0],[1,1],[2,1]],
    L: [[0,0],[0,1],[0,2],[1,2]],
    J: [[1,0],[1,1],[1,2],[0,2]],
  };

  const PIECE_NAMES = Object.keys(SHAPES);

  const bureaucraticWords = [
    "REGULATION","COMPLIANCE","SUBSECTION","AMENDMENT","OVERSIGHT",
    "PROTOCOL","DIRECTIVE","MANDATE","PROVISION","STATUTE",
    "ORDINANCE","REQUISITION","MEMORANDUM","ADDENDUM","APPENDIX",
    "CLAUSE","STIPULATION","PROCUREMENT","ADJUDICATION","TRIBUNAL",
    "RESOLUTION","GOVERNANCE","AUTHORIZATION","CERTIFICATION","JURISDICTION",
    "EXPEDITE","HARMONIZE","RATIFY","PROMULGATE","ADJOURNMENT",
    "QUORUM","SUBCOMMITTEE","BUREAUCRAT","CREDENTIAL","ABSURD",
    "NONSENSE","PAGEANTRY","CONFETTI","SPARKLY","SEQUINED",
    "RACCOON","TRUMPET","CEREMONIAL","RIDICULOUS","EMERGENCY",
  ];

  let board = [];
  let textBoard = [];
  let current = null;
  let next = null;
  let score = 0;
  let lines = 0;
  let level = 1;
  let gameOver = false;
  let paused = false;
  let running = false;
  let dropInterval = 800;
  let lastDrop = 0;
  let animatingLines = [];
  let animStart = 0;
  let rafId = null;

  function createBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  function fillTextBoard() {
    textBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
    let wordIdx = 0;
    let charIdx = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
          textBoard[r][c] = "";
          continue;
        }
        const word = bureaucraticWords[wordIdx % bureaucraticWords.length];
        textBoard[r][c] = word[charIdx];
        charIdx++;
        if (charIdx >= word.length) {
          charIdx = 0;
          wordIdx++;
        }
      }
    }
  }

  function randomPiece() {
    const name = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
    const cells = SHAPES[name].map(([x, y]) => [x, y]);
    return { name, cells, x: Math.floor(COLS / 2) - 1, y: 0 };
  }

  function rotatePiece(piece) {
    const cx = piece.cells.reduce((s, c) => s + c[0], 0) / piece.cells.length;
    const cy = piece.cells.reduce((s, c) => s + c[1], 0) / piece.cells.length;
    return piece.cells.map(([x, y]) => [
      Math.round(cx - (y - cy)),
      Math.round(cy + (x - cx)),
    ]);
  }

  function collides(cells, offX, offY) {
    return cells.some(([cx, cy]) => {
      const nx = cx + offX;
      const ny = cy + offY;
      return nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && board[ny][nx]);
    });
  }

  function lockPiece() {
    current.cells.forEach(([cx, cy]) => {
      const nx = cx + current.x;
      const ny = cy + current.y;
      if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
        board[ny][nx] = current.name;
      }
    });
  }

  function findFullLines() {
    const full = [];
    for (let r = 0; r < ROWS; r++) {
      if (board[r].every((cell) => cell !== null)) full.push(r);
    }
    return full;
  }

  function clearLines(fullRows) {
    fullRows.sort((a, b) => b - a).forEach((r) => {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(null));
    });
    const count = fullRows.length;
    const pts = [0, 100, 300, 500, 800][count] || 800;
    score += pts * level;
    lines += count;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 800 - (level - 1) * 70);
    scoreEl.textContent = score;
    linesEl.textContent = lines;
    levelEl.textContent = level;
  }

  function spawnPiece() {
    current = next || randomPiece();
    next = randomPiece();
    if (collides(current.cells, current.x, current.y)) {
      gameOver = true;
      running = false;
      overlayText.textContent = `COMPLIANCE FAILURE — ${score} pts`;
      overlay.classList.remove("hidden");
      startBtn.textContent = "Retry Compliance";
      startBtn.classList.remove("hidden");
      pauseBtn.classList.add("hidden");
    }
  }

  function moveLeft() {
    if (!collides(current.cells, current.x - 1, current.y)) current.x--;
  }

  function moveRight() {
    if (!collides(current.cells, current.x + 1, current.y)) current.x++;
  }

  function moveDown() {
    if (!collides(current.cells, current.x, current.y + 1)) {
      current.y++;
      return true;
    }
    return false;
  }

  function hardDrop() {
    while (!collides(current.cells, current.x, current.y + 1)) {
      current.y++;
      score += 2;
    }
    scoreEl.textContent = score;
    lockAndAdvance();
  }

  function rotate() {
    const rotated = rotatePiece(current);
    if (!collides(rotated, current.x, current.y)) {
      current.cells = rotated;
    } else if (!collides(rotated, current.x + 1, current.y)) {
      current.cells = rotated;
      current.x++;
    } else if (!collides(rotated, current.x - 1, current.y)) {
      current.cells = rotated;
      current.x--;
    }
  }

  function lockAndAdvance() {
    lockPiece();
    const full = findFullLines();
    if (full.length > 0) {
      animatingLines = full;
      animStart = performance.now();
    } else {
      spawnPiece();
    }
    fillTextBoard();
  }

  function drawCell(context, x, y, color, size) {
    const pad = 1;
    const r = 4;
    const cx = x * size + pad;
    const cy = y * size + pad;
    const w = size - pad * 2;
    const h = size - pad * 2;
    context.beginPath();
    context.roundRect(cx, cy, w, h, r);
    context.fillStyle = color;
    context.fill();
    context.fillStyle = "rgba(255,255,255,0.18)";
    context.fillRect(cx + 2, cy + 2, w - 4, 3);
  }

  function drawTextCell(r, c) {
    const ch = textBoard[r]?.[c];
    if (!ch) return;
    const x = c * CELL + CELL / 2;
    const y = r * CELL + CELL / 2 + 1;
    ctx.fillStyle = "rgba(20,33,61,0.09)";
    ctx.font = "600 13px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ch, x, y);
  }

  function render(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // grid background
    ctx.fillStyle = "rgba(255,249,239,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // background text in empty cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!board[r][c]) drawTextCell(r, c);
      }
    }

    // grid lines
    ctx.strokeStyle = "rgba(20,33,61,0.06)";
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, ROWS * CELL);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(COLS * CELL, r * CELL);
      ctx.stroke();
    }

    // placed pieces
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
          // animate clearing lines
          if (animatingLines.includes(r)) {
            const elapsed = now - animStart;
            const t = Math.min(1, elapsed / 300);
            ctx.globalAlpha = 1 - t;
            drawCell(ctx, c, r, COLORS[board[r][c]], CELL);
            ctx.globalAlpha = 1;
          } else {
            drawCell(ctx, c, r, COLORS[board[r][c]], CELL);
          }
        }
      }
    }

    // current piece + ghost
    if (current && !gameOver) {
      // ghost
      let ghostY = current.y;
      while (!collides(current.cells, current.x, ghostY + 1)) ghostY++;
      if (ghostY !== current.y) {
        ctx.globalAlpha = 0.18;
        current.cells.forEach(([cx, cy]) => {
          drawCell(ctx, cx + current.x, cy + ghostY, COLORS[current.name], CELL);
        });
        ctx.globalAlpha = 1;
      }

      // active piece
      current.cells.forEach(([cx, cy]) => {
        const py = cy + current.y;
        if (py >= 0) drawCell(ctx, cx + current.x, py, COLORS[current.name], CELL);
      });
    }

    // draw next piece preview
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextCtx.fillStyle = "rgba(255,249,239,0.4)";
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (next) {
      const previewCell = 24;
      const minX = Math.min(...next.cells.map(c => c[0]));
      const maxX = Math.max(...next.cells.map(c => c[0]));
      const minY = Math.min(...next.cells.map(c => c[1]));
      const maxY = Math.max(...next.cells.map(c => c[1]));
      const pw = (maxX - minX + 1) * previewCell;
      const ph = (maxY - minY + 1) * previewCell;
      const ox = (nextCanvas.width - pw) / 2 - minX * previewCell;
      const oy = (nextCanvas.height - ph) / 2 - minY * previewCell;
      next.cells.forEach(([cx, cy]) => {
        const pad = 1;
        const r = 3;
        const px = cx * previewCell + ox + pad;
        const py = cy * previewCell + oy + pad;
        const w = previewCell - pad * 2;
        const h = previewCell - pad * 2;
        nextCtx.beginPath();
        nextCtx.roundRect(px, py, w, h, r);
        nextCtx.fillStyle = COLORS[next.name];
        nextCtx.fill();
      });
    }
  }

  function gameLoop(now) {
    if (!running || paused) {
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    // handle line clear animation
    if (animatingLines.length > 0) {
      if (now - animStart > 300) {
        clearLines(animatingLines);
        animatingLines = [];
        fillTextBoard();
        spawnPiece();
      }
      render(now);
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (now - lastDrop > dropInterval) {
      if (!moveDown()) {
        lockAndAdvance();
      }
      lastDrop = now;
    }

    render(now);
    rafId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    createBoard();
    fillTextBoard();
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 800;
    gameOver = false;
    paused = false;
    running = true;
    current = null;
    next = null;
    scoreEl.textContent = "0";
    linesEl.textContent = "0";
    levelEl.textContent = "1";
    overlay.classList.add("hidden");
    startBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
    pauseBtn.textContent = "Pause Proceedings";
    spawnPiece();
    lastDrop = performance.now();
    if (!rafId) rafId = requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (gameOver) return;
    paused = !paused;
    if (paused) {
      overlayText.textContent = "PROCEEDINGS SUSPENDED";
      overlay.classList.remove("hidden");
      pauseBtn.textContent = "Resume Proceedings";
    } else {
      overlay.classList.add("hidden");
      pauseBtn.textContent = "Pause Proceedings";
      lastDrop = performance.now();
    }
  }

  startBtn.addEventListener("click", startGame);
  pauseBtn.addEventListener("click", togglePause);

  document.addEventListener("keydown", (e) => {
    if (!running || gameOver || animatingLines.length > 0) return;
    if (paused && e.key !== "Escape" && e.key !== "p") return;
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        moveLeft();
        break;
      case "ArrowRight":
        e.preventDefault();
        moveRight();
        break;
      case "ArrowDown":
        e.preventDefault();
        moveDown();
        score += 1;
        scoreEl.textContent = score;
        break;
      case "ArrowUp":
        e.preventDefault();
        rotate();
        break;
      case " ":
        e.preventDefault();
        hardDrop();
        break;
      case "p":
      case "Escape":
        togglePause();
        break;
    }
  });

  // initial render
  createBoard();
  fillTextBoard();
  render(performance.now());
  overlayText.textContent = "AWAITING COMPLIANCE";
  overlay.classList.remove("hidden");

  /* ─── Form 27-B canvas ─── */
  const formCanvas = document.getElementById("form27bCanvas");
  const fctx = formCanvas.getContext("2d");
  const nameInput = document.getElementById("form27bName");
  const reasonInput = document.getElementById("form27bReason");
  const emergencyInput = document.getElementById("form27bEmergency");

  const boilerplate = "WHEREAS the undersigned party hereby acknowledges that all emergencies, whether real, imagined, sequined, or raccoon-adjacent, fall under the jurisdiction of the Department of Ridiculous Internet. FURTHERMORE, the applicant agrees that all filed paperwork shall be processed in an order determined by institutional whim, ambient lighting, and the prevailing emotional state of the nearest bureaucrat. BE IT KNOWN that this form, once submitted, cannot be unsubmitted, unfiled, or emotionally reversed. The Department reserves the right to interpret all responses as performance art. SECTION 14(b): In the event of existential doubt, the applicant is advised to consult the nearest disco pigeon. ADDENDUM: All staplers referenced in this document are assumed sentient until proven otherwise. The Department maintains no liability for paperwork that achieves consciousness.";

  function wrapText(context, text, x, y, maxWidth, lineHeight, obstacles) {
    const words = text.split(" ");
    let line = "";
    let currentY = y;
    const lines = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? " " : "") + words[i];
      const metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        lines.push({ text: line, x, y: currentY });
        line = words[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push({ text: line, x, y: currentY });
    return lines;
  }

  function getObstacleRects() {
    const rects = [];
    const vals = [nameInput.value, reasonInput.value, emergencyInput.value];
    const labels = ["FULL CEREMONIAL NAME", "REASON FOR EXISTING", "EMERGENCY DECLARATION"];
    const yStarts = [60, 180, 300];
    vals.forEach((val, i) => {
      if (val.trim()) {
        const w = Math.min(360, fctx.measureText(val).width + 40);
        rects.push({ x: 380, y: yStarts[i], w, h: 50, label: labels[i], value: val });
      }
    });
    return rects;
  }

  function renderForm() {
    const w = formCanvas.width;
    const h = formCanvas.height;
    fctx.clearRect(0, 0, w, h);

    // background
    fctx.fillStyle = "rgba(255,249,239,0.6)";
    fctx.fillRect(0, 0, w, h);

    // watermark
    fctx.save();
    fctx.translate(w / 2, h / 2);
    fctx.rotate(-0.35);
    fctx.font = "800 72px 'Outfit', sans-serif";
    fctx.fillStyle = "rgba(20,33,61,0.04)";
    fctx.textAlign = "center";
    fctx.fillText("FORM 27-B", 0, 0);
    fctx.restore();

    // header
    fctx.font = "700 18px 'Outfit', sans-serif";
    fctx.fillStyle = "rgba(20,33,61,0.82)";
    fctx.textAlign = "left";
    fctx.fillText("OFFICIAL NONSENSE FORM 27-B", 20, 30);

    fctx.font = "11px 'IBM Plex Mono', monospace";
    fctx.fillStyle = "rgba(20,33,61,0.4)";
    fctx.fillText("DEPARTMENT OF RIDICULOUS INTERNET  ·  FILING REF: DRI-27B-" + new Date().getFullYear(), 20, 46);

    // draw obstacles (filled form fields)
    const obstacles = getObstacleRects();
    obstacles.forEach((ob) => {
      fctx.fillStyle = "rgba(216,255,62,0.22)";
      fctx.beginPath();
      fctx.roundRect(ob.x - 8, ob.y - 18, ob.w + 16, ob.h + 22, 8);
      fctx.fill();
      fctx.strokeStyle = "rgba(20,33,61,0.15)";
      fctx.lineWidth = 1;
      fctx.stroke();

      fctx.font = "600 9px 'IBM Plex Mono', monospace";
      fctx.fillStyle = "rgba(20,33,61,0.45)";
      fctx.fillText(ob.label, ob.x, ob.y - 4);

      fctx.font = "italic 400 15px 'Crimson Pro', serif";
      fctx.fillStyle = "rgba(20,33,61,0.88)";
      fctx.fillText(ob.value, ob.x, ob.y + 20);
    });

    // draw boilerplate text flowing around obstacles
    fctx.font = "400 13px 'Crimson Pro', serif";
    fctx.fillStyle = "rgba(20,33,61,0.28)";

    const margin = 20;
    const lineHeight = 18;
    const startY = 70;
    const endY = h - 20;
    let currentY = startY;
    const words = boilerplate.split(" ");
    let wordIdx = 0;

    while (currentY < endY && wordIdx < words.length) {
      let lineX = margin;
      let lineMaxWidth = w - margin * 2;

      // check if this line intersects an obstacle
      obstacles.forEach((ob) => {
        const lineTop = currentY - 12;
        const lineBottom = currentY + 4;
        const obTop = ob.y - 18;
        const obBottom = ob.y + ob.h + 4;
        if (lineBottom > obTop && lineTop < obBottom) {
          if (lineX < ob.x + ob.w + 16 && lineX + lineMaxWidth > ob.x - 16) {
            if (ob.x - 16 - margin > 100) {
              lineMaxWidth = ob.x - 16 - margin;
            } else {
              lineMaxWidth = 0;
            }
          }
        }
      });

      if (lineMaxWidth < 60) {
        currentY += lineHeight;
        continue;
      }

      let line = "";
      while (wordIdx < words.length) {
        const testLine = line + (line ? " " : "") + words[wordIdx];
        if (fctx.measureText(testLine).width > lineMaxWidth && line) break;
        line = testLine;
        wordIdx++;
      }

      if (line) {
        fctx.fillText(line, lineX, currentY);
      }
      currentY += lineHeight;
    }

    // stamp in corner
    fctx.save();
    fctx.translate(w - 90, h - 60);
    fctx.rotate(-0.15);
    fctx.strokeStyle = "rgba(157,23,23,0.25)";
    fctx.lineWidth = 2;
    fctx.strokeRect(-40, -20, 80, 40);
    fctx.font = "700 11px 'IBM Plex Mono', monospace";
    fctx.fillStyle = "rgba(157,23,23,0.3)";
    fctx.textAlign = "center";
    fctx.fillText("PENDING", 0, 4);
    fctx.restore();
  }

  [nameInput, reasonInput, emergencyInput].forEach((input) => {
    input.addEventListener("input", renderForm);
  });

  renderForm();
})();
