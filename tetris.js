/* Bureaucratic Tetris — the Constitution reflows around pieces via @chenglou/pretext */
(async function () {
  /* ─── Pretext loading ─── */
  let ptPrepare = null, ptLayoutNext = null;
  try {
    const pt = await import("https://esm.sh/@chenglou/pretext@0.0.3");
    ptPrepare = pt.prepareWithSegments;
    ptLayoutNext = pt.layoutNextLine;
  } catch (e) { console.warn("pretext unavailable, using fallback text", e); }
  console.log("pretext loaded:", !!ptPrepare, !!ptLayoutNext);

  /* ─── Constants ─── */
  const COLS = 10, ROWS = 20, CELL = 30;
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
  const section = document.querySelector(".tetris-arena");
  const boardWrap = document.querySelector(".tetris-board-wrap");

  const COLORS = {
    I: "#4a90c4", O: "#d4a017", T: "#8b5ea0", S: "#5a9e4b",
    Z: "#c41e3a", L: "#d4a017", J: "#1a3a6b",
  };
  const SHAPES = {
    I: [[0,0],[1,0],[2,0],[3,0]], O: [[0,0],[1,0],[0,1],[1,1]],
    T: [[0,0],[1,0],[2,0],[1,1]], S: [[1,0],[2,0],[0,1],[1,1]],
    Z: [[0,0],[1,0],[1,1],[2,1]], L: [[0,0],[0,1],[0,2],[1,2]],
    J: [[1,0],[1,1],[1,2],[0,2]],
  };
  const PIECE_NAMES = Object.keys(SHAPES);

  const CONSTITUTION = "We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America. ARTICLE I. Section 1. All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives. Section 2. The House of Representatives shall be composed of Members chosen every second Year by the People of the several States, and the Electors in each State shall have the Qualifications requisite for Electors of the most numerous Branch of the State Legislature. No Person shall be a Representative who shall not have attained to the Age of twenty five Years, and been seven Years a Citizen of the United States. Representatives and direct Taxes shall be apportioned among the several States which may be included within this Union, according to their respective Numbers. The actual Enumeration shall be made within three Years after the first Meeting of the Congress of the United States. The Number of Representatives shall not exceed one for every thirty Thousand, but each State shall have at Least one Representative. Section 3. The Senate of the United States shall be composed of two Senators from each State, chosen by the Legislature thereof, for six Years; and each Senator shall have one Vote. The Vice President of the United States shall be President of the Senate, but shall have no Vote, unless they be equally divided. The Senate shall have the sole Power to try all Impeachments. When the President of the United States is tried, the Chief Justice shall preside. Section 4. The Times, Places and Manner of holding Elections for Senators and Representatives, shall be prescribed in each State by the Legislature thereof; but the Congress may at any time by Law make or alter such Regulations. Section 5. Each House shall be the Judge of the Elections, Returns and Qualifications of its own Members. Section 6. The Senators and Representatives shall receive a Compensation for their Services, to be ascertained by Law. Section 7. All Bills for raising Revenue shall originate in the House of Representatives; but the Senate may propose or concur with Amendments as on other Bills. Every Bill which shall have passed the House of Representatives and the Senate, shall, before it become a Law, be presented to the President of the United States. AMENDMENT I. Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press. AMENDMENT II. A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed. AMENDMENT IV. The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated.";

  /* ─── Background text canvas ─── */
  const bgCanvas = document.createElement("canvas");
  bgCanvas.className = "tetris-bg-canvas";
  section.style.position = "relative";
  section.insertBefore(bgCanvas, section.firstChild);
  const bgCtx = bgCanvas.getContext("2d");
  let bgDirty = true;
  let preparedText = null;

  function sizeBgCanvas() {
    bgCanvas.width = section.offsetWidth;
    bgCanvas.height = section.offsetHeight;
    bgDirty = true;
  }
  sizeBgCanvas();
  window.addEventListener("resize", sizeBgCanvas);

  function getBoardRect() {
    if (!boardWrap || !section) return { x: 0, y: 0, w: 300, h: 600 };
    const sr = section.getBoundingClientRect();
    const br = boardWrap.getBoundingClientRect();
    return { x: br.left - sr.left, y: br.top - sr.top, w: br.width, h: br.height };
  }

  function getOccupiedRangesAtRow(boardRect, screenY) {
    // convert screen Y to board row
    const localY = screenY - boardRect.y;
    const row = Math.floor(localY / CELL);
    if (row < 0 || row >= ROWS) return [];
    // build a merged view of locked cells + current falling piece
    const rowCells = new Array(COLS);
    for (let c = 0; c < COLS; c++) rowCells[c] = board[row][c] !== null;
    if (current) {
      current.cells.forEach(([cx, cy]) => {
        const nx = cx + current.x, ny = cy + current.y;
        if (ny === row && nx >= 0 && nx < COLS) rowCells[nx] = true;
      });
    }
    const ranges = [];
    let inBlock = false, startC = 0;
    for (let c = 0; c <= COLS; c++) {
      const filled = c < COLS && rowCells[c];
      if (filled && !inBlock) { inBlock = true; startC = c; }
      if (!filled && inBlock) {
        ranges.push({
          x: boardRect.x + startC * CELL,
          w: (c - startC) * CELL,
        });
        inBlock = false;
      }
    }
    return ranges;
  }

  function renderBgText() {
    const w = bgCanvas.width, h = bgCanvas.height;
    bgCtx.clearRect(0, 0, w, h);
    const FONT = '400 11px "Crimson Pro", serif';
    const LH = 14;
    const PAD = 12;
    const br = getBoardRect();

    if (ptPrepare && ptLayoutNext) {
      // ─── Pretext path: variable-width line layout ───
      if (!preparedText) preparedText = ptPrepare(CONSTITUTION, FONT);
      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      let y = PAD + 11;
      bgCtx.font = FONT;
      bgCtx.fillStyle = "rgba(20,33,61,0.14)";
      bgCtx.textAlign = "left";
      bgCtx.textBaseline = "alphabetic";
      let passes = 0;

      while (y < h - PAD && passes < 800) {
        passes++;
        const inBoardY = y >= br.y && y < br.y + br.h;

        if (inBoardY) {
          // get piece obstacles at this y
          const obstacles = getOccupiedRangesAtRow(br, y);
          // text to the LEFT of board
          const leftW = br.x - PAD * 2;
          if (leftW > 40) {
            const line = ptLayoutNext(preparedText, cursor, leftW);
            if (!line) { cursor = { segmentIndex: 0, graphemeIndex: 0 }; preparedText = ptPrepare(CONSTITUTION, FONT); continue; }
            bgCtx.fillText(line.text, PAD, y);
            cursor = line.end;
          }
          // text to the RIGHT of board
          const rightX = br.x + br.w + PAD;
          const rightW = w - rightX - PAD;
          if (rightW > 40) {
            const line = ptLayoutNext(preparedText, cursor, rightW);
            if (!line) { cursor = { segmentIndex: 0, graphemeIndex: 0 }; preparedText = ptPrepare(CONSTITUTION, FONT); continue; }
            bgCtx.fillText(line.text, rightX, y);
            cursor = line.end;
          }
          // Also render text inside empty board columns
          // Find contiguous empty column ranges in this row
          const boardRow = Math.floor((y - br.y) / CELL);
          if (boardRow >= 0 && boardRow < ROWS) {
            // build merged view: locked cells + current falling piece
            const mergedRow = new Array(COLS);
            for (let mc = 0; mc < COLS; mc++) mergedRow[mc] = board[boardRow]?.[mc] !== null;
            if (current) {
              current.cells.forEach(([cx, cy]) => {
                const nx = cx + current.x, ny = cy + current.y;
                if (ny === boardRow && nx >= 0 && nx < COLS) mergedRow[nx] = true;
              });
            }
            let emptyStart = -1;
            for (let c = 0; c <= COLS; c++) {
              const empty = c < COLS && !mergedRow[c];
              if (empty && emptyStart < 0) emptyStart = c;
              if ((!empty || c === COLS) && emptyStart >= 0) {
                const ex = br.x + emptyStart * CELL + 2;
                const ew = (c - emptyStart) * CELL - 4;
                if (ew > 20) {
                  const line = ptLayoutNext(preparedText, cursor, ew);
                  if (!line) { cursor = { segmentIndex: 0, graphemeIndex: 0 }; preparedText = ptPrepare(CONSTITUTION, FONT); emptyStart = -1; continue; }
                  bgCtx.fillText(line.text, ex, y);
                  cursor = line.end;
                }
                emptyStart = -1;
              }
            }
          }
        } else {
          // full-width line
          const fullW = w - PAD * 2;
          const line = ptLayoutNext(preparedText, cursor, fullW);
          if (!line) { cursor = { segmentIndex: 0, graphemeIndex: 0 }; preparedText = ptPrepare(CONSTITUTION, FONT); continue; }
          bgCtx.fillText(line.text, PAD, y);
          cursor = line.end;
        }
        y += LH;
      }
    } else {
      // ─── Fallback: simple word-wrap with reflow around board + pieces ───
      bgCtx.font = FONT;
      bgCtx.fillStyle = "rgba(20,33,61,0.14)";
      bgCtx.textAlign = "left";
      const words = CONSTITUTION.split(" ");
      let wi = 0, y = PAD + 11;

      function fillLine(startX, maxW) {
        if (maxW < 30) return;
        let line = "";
        while (wi < words.length) {
          const test = line + (line ? " " : "") + words[wi];
          if (bgCtx.measureText(test).width > maxW && line) break;
          line = test; wi++;
        }
        if (line) bgCtx.fillText(line, startX, y);
      }

      while (y < h - PAD && wi < words.length) {
        const inBoardY = y >= br.y && y < br.y + br.h;
        if (inBoardY) {
          // left of board
          fillLine(PAD, br.x - PAD * 2);
          // right of board
          const rightX = br.x + br.w + PAD;
          fillLine(rightX, w - rightX - PAD);
          // inside empty board columns
          const boardRow = Math.floor((y - br.y) / CELL);
          if (boardRow >= 0 && boardRow < ROWS) {
            const mergedRow = new Array(COLS);
            for (let mc = 0; mc < COLS; mc++) mergedRow[mc] = board[boardRow]?.[mc] !== null;
            if (current) {
              current.cells.forEach(([cx, cy]) => {
                const nx = cx + current.x, ny = cy + current.y;
                if (ny === boardRow && nx >= 0 && nx < COLS) mergedRow[nx] = true;
              });
            }
            let emptyStart = -1;
            for (let c = 0; c <= COLS; c++) {
              const empty = c < COLS && !mergedRow[c];
              if (empty && emptyStart < 0) emptyStart = c;
              if ((!empty || c === COLS) && emptyStart >= 0) {
                const ex = br.x + emptyStart * CELL + 2;
                const ew = (c - emptyStart) * CELL - 4;
                fillLine(ex, ew);
                emptyStart = -1;
              }
            }
          }
        } else {
          fillLine(PAD, w - PAD * 2);
        }
        y += LH;
        if (wi >= words.length) wi = 0; // loop text
      }
    }
  }

  /* ─── Game state ─── */
  let board = [], current = null, next = null;
  let score = 0, lines = 0, level = 1;
  let gameOver = false, paused = false, running = false;
  let dropInterval = 800, lastDrop = 0;
  let animatingLines = [], animStart = 0, rafId = null;

  function createBoard() { board = Array.from({ length: ROWS }, () => Array(COLS).fill(null)); }
  function randomPiece() {
    const name = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
    return { name, cells: SHAPES[name].map(([x, y]) => [x, y]), x: Math.floor(COLS / 2) - 1, y: 0 };
  }
  function rotatePiece(p) {
    const cx = p.cells.reduce((s, c) => s + c[0], 0) / p.cells.length;
    const cy = p.cells.reduce((s, c) => s + c[1], 0) / p.cells.length;
    return p.cells.map(([x, y]) => [Math.round(cx - (y - cy)), Math.round(cy + (x - cx))]);
  }
  function collides(cells, ox, oy) {
    return cells.some(([cx, cy]) => { const nx = cx + ox, ny = cy + oy; return nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && board[ny][nx]); });
  }
  function lockPiece() {
    current.cells.forEach(([cx, cy]) => { const nx = cx + current.x, ny = cy + current.y; if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) board[ny][nx] = current.name; });
    bgDirty = true;
  }
  function findFullLines() { const f = []; for (let r = 0; r < ROWS; r++) { if (board[r].every(c => c !== null)) f.push(r); } return f; }
  function clearLines(rows) {
    rows.sort((a, b) => b - a).forEach(r => { board.splice(r, 1); board.unshift(Array(COLS).fill(null)); });
    const pts = [0, 100, 300, 500, 800][rows.length] || 800;
    score += pts * level; lines += rows.length; level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 800 - (level - 1) * 70);
    scoreEl.textContent = score; linesEl.textContent = lines; levelEl.textContent = level;
    bgDirty = true;
  }
  function spawnPiece() {
    current = next || randomPiece(); next = randomPiece();
    if (collides(current.cells, current.x, current.y)) {
      gameOver = true; running = false;
      overlayText.textContent = `COMPLIANCE FAILURE — ${score} pts`;
      overlay.classList.remove("hidden"); startBtn.textContent = "Retry Compliance";
      startBtn.classList.remove("hidden"); pauseBtn.classList.add("hidden");
    }
  }
  function moveLeft() { if (current && !collides(current.cells, current.x - 1, current.y)) current.x--; }
  function moveRight() { if (current && !collides(current.cells, current.x + 1, current.y)) current.x++; }
  function moveDown() { if (current && !collides(current.cells, current.x, current.y + 1)) { current.y++; return true; } return false; }
  function hardDrop() { if (!current) return; while (!collides(current.cells, current.x, current.y + 1)) { current.y++; score += 2; } scoreEl.textContent = score; lockAndAdvance(); }
  function rotate() {
    if (!current) return;
    const r = rotatePiece(current);
    if (!collides(r, current.x, current.y)) current.cells = r;
    else if (!collides(r, current.x + 1, current.y)) { current.cells = r; current.x++; }
    else if (!collides(r, current.x - 1, current.y)) { current.cells = r; current.x--; }
  }
  function lockAndAdvance() {
    lockPiece(); const full = findFullLines();
    if (full.length > 0) { animatingLines = full; animStart = performance.now(); } else spawnPiece();
  }

  /* ─── Rendering ─── */
  function drawCell(context, x, y, color, size) {
    const pad = 1, r = 4, cx = x * size + pad, cy = y * size + pad, w = size - pad * 2, h = size - pad * 2;
    context.beginPath(); context.roundRect(cx, cy, w, h, r); context.fillStyle = color; context.fill();
    context.fillStyle = "rgba(255,255,255,0.18)"; context.fillRect(cx + 2, cy + 2, w - 4, 3);
  }

  function render(now) {
    // background text — reflow every frame while running so text wraps around falling piece
    if (bgDirty) { preparedText = null; bgDirty = false; }
    if (running || !preparedText) { renderBgText(); }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // semi-transparent board so bg text shows through
    ctx.fillStyle = "rgba(255,251,243,0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // subtle grid
    ctx.strokeStyle = "rgba(20,33,61,0.05)";
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, ROWS * CELL); ctx.stroke(); }
    for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(COLS * CELL, r * CELL); ctx.stroke(); }

    // placed pieces
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (!board[r][c]) continue;
      if (animatingLines.includes(r)) {
        ctx.globalAlpha = 1 - Math.min(1, (now - animStart) / 300);
        drawCell(ctx, c, r, COLORS[board[r][c]], CELL);
        ctx.globalAlpha = 1;
      } else drawCell(ctx, c, r, COLORS[board[r][c]], CELL);
    }

    // ghost + current piece
    if (current && !gameOver) {
      let gy = current.y;
      while (!collides(current.cells, current.x, gy + 1)) gy++;
      if (gy !== current.y) {
        ctx.globalAlpha = 0.18;
        current.cells.forEach(([cx, cy]) => drawCell(ctx, cx + current.x, cy + gy, COLORS[current.name], CELL));
        ctx.globalAlpha = 1;
      }
      current.cells.forEach(([cx, cy]) => { if (cy + current.y >= 0) drawCell(ctx, cx + current.x, cy + current.y, COLORS[current.name], CELL); });
    }

    // next piece preview
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextCtx.fillStyle = "rgba(255,251,243,0.4)"; nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (next) {
      const pc = 24;
      const minX = Math.min(...next.cells.map(c => c[0])), maxX = Math.max(...next.cells.map(c => c[0]));
      const minY = Math.min(...next.cells.map(c => c[1])), maxY = Math.max(...next.cells.map(c => c[1]));
      const ox = (nextCanvas.width - (maxX - minX + 1) * pc) / 2 - minX * pc;
      const oy = (nextCanvas.height - (maxY - minY + 1) * pc) / 2 - minY * pc;
      next.cells.forEach(([cx, cy]) => { nextCtx.beginPath(); nextCtx.roundRect(cx * pc + ox + 1, cy * pc + oy + 1, pc - 2, pc - 2, 3); nextCtx.fillStyle = COLORS[next.name]; nextCtx.fill(); });
    }
  }

  /* ─── Game loop ─── */
  function gameLoop(now) {
    if (!running || paused) { rafId = requestAnimationFrame(gameLoop); return; }
    if (animatingLines.length > 0) {
      if (now - animStart > 300) { clearLines(animatingLines); animatingLines = []; spawnPiece(); }
      render(now); rafId = requestAnimationFrame(gameLoop); return;
    }
    if (now - lastDrop > dropInterval) { if (!moveDown()) lockAndAdvance(); lastDrop = now; }
    render(now); rafId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    createBoard(); score = 0; lines = 0; level = 1; dropInterval = 800;
    gameOver = false; paused = false; running = true; current = null; next = null;
    scoreEl.textContent = "0"; linesEl.textContent = "0"; levelEl.textContent = "1";
    overlay.classList.add("hidden"); startBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden"); pauseBtn.textContent = "Pause Proceedings";
    bgDirty = true; spawnPiece(); lastDrop = performance.now();
    if (!rafId) rafId = requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (gameOver) return;
    paused = !paused;
    if (paused) { overlayText.textContent = "PROCEEDINGS SUSPENDED"; overlay.classList.remove("hidden"); pauseBtn.textContent = "Resume Proceedings"; }
    else { overlay.classList.add("hidden"); pauseBtn.textContent = "Pause Proceedings"; lastDrop = performance.now(); }
  }

  /* ─── Keyboard controls ─── */
  startBtn.addEventListener("click", startGame);
  pauseBtn.addEventListener("click", togglePause);
  document.addEventListener("keydown", (e) => {
    if (!running || gameOver || animatingLines.length > 0) return;
    if (paused && e.key !== "Escape" && e.key !== "p") return;
    switch (e.key) {
      case "ArrowLeft": e.preventDefault(); moveLeft(); break;
      case "ArrowRight": e.preventDefault(); moveRight(); break;
      case "ArrowDown": e.preventDefault(); moveDown(); score += 1; scoreEl.textContent = score; break;
      case "ArrowUp": e.preventDefault(); rotate(); break;
      case " ": e.preventDefault(); hardDrop(); break;
      case "p": case "Escape": togglePause(); break;
    }
  });

  /* ─── Mobile swipe & tap controls ─── */
  let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
  const SWIPE_THRESHOLD = 30;
  const TAP_THRESHOLD = 15;

  canvas.addEventListener("touchstart", (e) => {
    if (!running || gameOver || paused) return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchStartTime = Date.now();
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchend", (e) => {
    if (!running || gameOver || paused || animatingLines.length > 0) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const dt = Date.now() - touchStartTime;
    const dist = Math.sqrt(dx * dx + dy * dy);
    e.preventDefault();

    if (dist < TAP_THRESHOLD) {
      // tap = rotate
      rotate();
    } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      // horizontal swipe
      if (dx < 0) moveLeft(); else moveRight();
    } else if (dy > SWIPE_THRESHOLD) {
      // swipe down
      if (dy > 100 || dt < 200) {
        hardDrop();
      } else {
        moveDown(); score += 1; scoreEl.textContent = score;
      }
    }
  }, { passive: false });

  // also keep button controls as fallback
  const touchWrap = document.createElement("div");
  touchWrap.className = "mobile-controls";
  touchWrap.innerHTML = `
    <button class="mobile-btn" data-act="left">&larr;</button>
    <button class="mobile-btn" data-act="down">&darr;</button>
    <button class="mobile-btn" data-act="rotate">&#x21BB;</button>
    <button class="mobile-btn" data-act="right">&rarr;</button>
    <button class="mobile-btn mobile-btn-wide" data-act="drop">DROP</button>
  `;
  if (boardWrap) boardWrap.parentNode.insertBefore(touchWrap, boardWrap.nextSibling);
  touchWrap.addEventListener("pointerdown", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (!act || !running || gameOver || paused || animatingLines.length > 0) return;
    e.preventDefault();
    if (act === "left") moveLeft();
    else if (act === "right") moveRight();
    else if (act === "down") { moveDown(); score += 1; scoreEl.textContent = score; }
    else if (act === "rotate") rotate();
    else if (act === "drop") hardDrop();
  });

  /* ─── Init ─── */
  createBoard();
  bgDirty = true;
  renderBgText();
  render(performance.now());
  overlayText.textContent = "AWAITING COMPLIANCE";
  overlay.classList.remove("hidden");

  /* ─── Form 27-B canvas ─── */
  const formCanvas = document.getElementById("form27bCanvas");
  if (formCanvas) {
    const fctx = formCanvas.getContext("2d");
    const nameInput = document.getElementById("form27bName");
    const reasonInput = document.getElementById("form27bReason");
    const emergencyInput = document.getElementById("form27bEmergency");
    const boilerplate = "WHEREAS the undersigned party hereby acknowledges that all emergencies, whether real, imagined, sequined, or raccoon-adjacent, fall under the jurisdiction of the Department of Ridiculous. FURTHERMORE, the applicant agrees that all filed paperwork shall be processed in an order determined by institutional whim, ambient lighting, and the prevailing emotional state of the nearest bureaucrat. BE IT KNOWN that this form, once submitted, cannot be unsubmitted, unfiled, or emotionally reversed. The Department reserves the right to interpret all responses as performance art. SECTION 14(b): In the event of existential doubt, the applicant is advised to consult the nearest disco pigeon. ADDENDUM: All staplers referenced in this document are assumed sentient until proven otherwise. The Department maintains no liability for paperwork that achieves consciousness.";

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
      const w = formCanvas.width, h = formCanvas.height;
      fctx.clearRect(0, 0, w, h);
      fctx.fillStyle = "rgba(255,251,243,0.6)"; fctx.fillRect(0, 0, w, h);
      fctx.save(); fctx.translate(w / 2, h / 2); fctx.rotate(-0.35);
      fctx.font = "800 72px 'Outfit', sans-serif"; fctx.fillStyle = "rgba(20,33,61,0.04)";
      fctx.textAlign = "center"; fctx.fillText("FORM 27-B", 0, 0); fctx.restore();
      fctx.font = "700 18px 'Outfit', sans-serif"; fctx.fillStyle = "rgba(20,33,61,0.82)"; fctx.textAlign = "left";
      fctx.fillText("OFFICIAL NONSENSE FORM 27-B", 20, 30);
      fctx.font = "11px 'IBM Plex Mono', monospace"; fctx.fillStyle = "rgba(20,33,61,0.4)";
      fctx.fillText("DEPARTMENT OF RIDICULOUS INTERNET  ·  FILING REF: DRI-27B-" + new Date().getFullYear(), 20, 46);
      const obstacles = getObstacleRects();
      obstacles.forEach((ob) => {
        fctx.fillStyle = "rgba(212,160,23,0.22)"; fctx.beginPath();
        fctx.roundRect(ob.x - 8, ob.y - 18, ob.w + 16, ob.h + 22, 8); fctx.fill();
        fctx.strokeStyle = "rgba(20,33,61,0.15)"; fctx.lineWidth = 1; fctx.stroke();
        fctx.font = "600 9px 'IBM Plex Mono', monospace"; fctx.fillStyle = "rgba(20,33,61,0.45)"; fctx.fillText(ob.label, ob.x, ob.y - 4);
        fctx.font = "italic 400 15px 'Crimson Pro', serif"; fctx.fillStyle = "rgba(20,33,61,0.88)"; fctx.fillText(ob.value, ob.x, ob.y + 20);
      });
      fctx.font = "400 13px 'Crimson Pro', serif"; fctx.fillStyle = "rgba(20,33,61,0.28)";
      const margin = 20, lineHeight = 18, endY = h - 20;
      let currentY = 70; const words = boilerplate.split(" "); let wordIdx = 0;
      while (currentY < endY && wordIdx < words.length) {
        let lineX = margin, lineMaxWidth = w - margin * 2;
        obstacles.forEach((ob) => {
          const lt = currentY - 12, lb = currentY + 4, ot = ob.y - 18, obB = ob.y + ob.h + 4;
          if (lb > ot && lt < obB && lineX < ob.x + ob.w + 16 && lineX + lineMaxWidth > ob.x - 16) {
            lineMaxWidth = ob.x - 16 - margin > 100 ? ob.x - 16 - margin : 0;
          }
        });
        if (lineMaxWidth < 60) { currentY += lineHeight; continue; }
        let line = "";
        while (wordIdx < words.length) { const t = line + (line ? " " : "") + words[wordIdx]; if (fctx.measureText(t).width > lineMaxWidth && line) break; line = t; wordIdx++; }
        if (line) fctx.fillText(line, lineX, currentY);
        currentY += lineHeight;
      }
      fctx.save(); fctx.translate(w - 90, h - 60); fctx.rotate(-0.15);
      fctx.strokeStyle = "rgba(157,23,23,0.25)"; fctx.lineWidth = 2; fctx.strokeRect(-40, -20, 80, 40);
      fctx.font = "700 11px 'IBM Plex Mono', monospace"; fctx.fillStyle = "rgba(157,23,23,0.3)";
      fctx.textAlign = "center"; fctx.fillText("PENDING", 0, 4); fctx.restore();
    }
    [nameInput, reasonInput, emergencyInput].forEach((input) => input.addEventListener("input", renderForm));
    renderForm();
  }
})();
