/* Bureaucratic Tetris — the Constitution rearranges as institutional gravity takes hold */
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
    I: "#53e0d7", O: "#ffd93d", T: "#c584ff", S: "#c8e64e",
    Z: "#ff3b30", L: "#ff8e5e", J: "#5b8fff",
  };
  const SHAPES = {
    I: [[0,0],[1,0],[2,0],[3,0]], O: [[0,0],[1,0],[0,1],[1,1]],
    T: [[0,0],[1,0],[2,0],[1,1]], S: [[1,0],[2,0],[0,1],[1,1]],
    Z: [[0,0],[1,0],[1,1],[2,1]], L: [[0,0],[0,1],[0,2],[1,2]],
    J: [[1,0],[1,1],[1,2],[0,2]],
  };
  const PIECE_NAMES = Object.keys(SHAPES);

  const CONSTITUTION = "We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America. ARTICLE I. Section 1. All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives. Section 2. The House of Representatives shall be composed of Members chosen every second Year by the People of the several States, and the Electors in each State shall have the Qualifications requisite for Electors of the most numerous Branch of the State Legislature. No Person shall be a Representative who shall not have attained to the Age of twenty five Years, and been seven Years a Citizen of the United States, and who shall not, when elected, be an Inhabitant of that State in which he shall be chosen. Representatives and direct Taxes shall be apportioned among the several States which may be included within this Union, according to their respective Numbers. The actual Enumeration shall be made within three Years after the first Meeting of the Congress of the United States, and within every subsequent Term of ten Years, in such Manner as they shall by Law direct. The Number of Representatives shall not exceed one for every thirty Thousand, but each State shall have at Least one Representative. Section 3. The Senate of the United States shall be composed of two Senators from each State, chosen by the Legislature thereof, for six Years; and each Senator shall have one Vote. Immediately after they shall be assembled in Consequence of the first Election, they shall be divided as equally as may be into three Classes. The Vice President of the United States shall be President of the Senate, but shall have no Vote, unless they be equally divided. The Senate shall choose their other Officers, and also a President pro tempore, in the Absence of the Vice President, or when he shall exercise the Office of President of the United States. The Senate shall have the sole Power to try all Impeachments. When sitting for that Purpose, they shall be on Oath or Affirmation. When the President of the United States is tried, the Chief Justice shall preside: And no Person shall be convicted without the Concurrence of two thirds of the Members present. Judgment in Cases of Impeachment shall not extend further than to removal from Office, and disqualification to hold and enjoy any Office of honor, Trust or Profit under the United States: but the Party convicted shall nevertheless be liable and subject to Indictment, Trial, Judgment and Punishment, according to Law. Section 4. The Times, Places and Manner of holding Elections for Senators and Representatives, shall be prescribed in each State by the Legislature thereof; but the Congress may at any time by Law make or alter such Regulations, except as to the Places of chusing Senators. The Congress shall assemble at least once in every Year, and such Meeting shall be on the first Monday in December, unless they shall by Law appoint a different Day. Section 5. Each House shall be the Judge of the Elections, Returns and Qualifications of its own Members, and a Majority of each shall constitute a Quorum to do Business; but a smaller Number may adjourn from day to day, and may be authorized to compel the Attendance of absent Members, in such Manner, and under such Penalties as each House may provide. Each House may determine the Rules of its Proceedings, punish its Members for disorderly Behaviour, and, with the Concurrence of two thirds, expel a Member. Section 6. The Senators and Representatives shall receive a Compensation for their Services, to be ascertained by Law, and paid out of the Treasury of the United States. They shall in all Cases, except Treason, Felony and Breach of the Peace, be privileged from Arrest during their Attendance at the Session of their respective Houses, and in going to and returning from the same; and for any Speech or Debate in either House, they shall not be questioned in any other Place. Section 7. All Bills for raising Revenue shall originate in the House of Representatives; but the Senate may propose or concur with Amendments as on other Bills. Every Bill which shall have passed the House of Representatives and the Senate, shall, before it become a Law, be presented to the President of the United States; If he approve he shall sign it, but if not he shall return it, with his Objections to that House in which it shall have originated.";

  let board = [], current = null, next = null;
  let score = 0, lines = 0, level = 1;
  let gameOver = false, paused = false, running = false;
  let dropInterval = 800, lastDrop = 0;
  let animatingLines = [], animStart = 0, rafId = null;

  // pre-compute constitution line layout for the background
  let textLines = [];
  function computeTextLayout() {
    const fontSize = 8;
    const lineH = 10;
    const pad = 4;
    ctx.font = `400 ${fontSize}px 'Crimson Pro', serif`;
    textLines = [];
    const words = CONSTITUTION.split(" ");
    let wordIdx = 0;
    let y = pad + fontSize;
    const maxW = canvas.width - pad * 2;
    while (y < canvas.height && wordIdx < words.length) {
      let line = "";
      while (wordIdx < words.length) {
        const test = line + (line ? " " : "") + words[wordIdx];
        if (ctx.measureText(test).width > maxW && line) break;
        line = test;
        wordIdx++;
      }
      if (line) textLines.push({ text: line, x: pad, y });
      y += lineH;
    }
  }

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
  }
  function findFullLines() { const f = []; for (let r = 0; r < ROWS; r++) { if (board[r].every(c => c !== null)) f.push(r); } return f; }
  function clearLines(rows) {
    rows.sort((a, b) => b - a).forEach(r => { board.splice(r, 1); board.unshift(Array(COLS).fill(null)); });
    const pts = [0, 100, 300, 500, 800][rows.length] || 800;
    score += pts * level; lines += rows.length; level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 800 - (level - 1) * 70);
    scoreEl.textContent = score; linesEl.textContent = lines; levelEl.textContent = level;
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
  function moveLeft() { if (!collides(current.cells, current.x - 1, current.y)) current.x--; }
  function moveRight() { if (!collides(current.cells, current.x + 1, current.y)) current.x++; }
  function moveDown() { if (!collides(current.cells, current.x, current.y + 1)) { current.y++; return true; } return false; }
  function hardDrop() { while (!collides(current.cells, current.x, current.y + 1)) { current.y++; score += 2; } scoreEl.textContent = score; lockAndAdvance(); }
  function rotate() {
    const r = rotatePiece(current);
    if (!collides(r, current.x, current.y)) current.cells = r;
    else if (!collides(r, current.x + 1, current.y)) { current.cells = r; current.x++; }
    else if (!collides(r, current.x - 1, current.y)) { current.cells = r; current.x--; }
  }
  function lockAndAdvance() {
    lockPiece(); const full = findFullLines();
    if (full.length > 0) { animatingLines = full; animStart = performance.now(); } else spawnPiece();
  }

  function drawCell(context, x, y, color, size) {
    const pad = 1, r = 4, cx = x * size + pad, cy = y * size + pad, w = size - pad * 2, h = size - pad * 2;
    context.beginPath(); context.roundRect(cx, cy, w, h, r); context.fillStyle = color; context.fill();
    context.fillStyle = "rgba(255,255,255,0.18)"; context.fillRect(cx + 2, cy + 2, w - 4, 3);
  }

  function render(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // warm background
    ctx.fillStyle = "rgba(255,249,239,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw constitution text across entire background
    ctx.save();
    // build a clipping mask of empty cells only
    ctx.beginPath();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!board[r][c]) ctx.rect(c * CELL, r * CELL, CELL, CELL);
      }
    }
    ctx.clip();
    ctx.font = "400 8px 'Crimson Pro', serif";
    ctx.fillStyle = "rgba(20,33,61,0.18)";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    textLines.forEach(({ text, x, y }) => ctx.fillText(text, x, y));
    ctx.restore();

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
    nextCtx.fillStyle = "rgba(255,249,239,0.4)";
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (next) {
      const pc = 24;
      const minX = Math.min(...next.cells.map(c => c[0])), maxX = Math.max(...next.cells.map(c => c[0]));
      const minY = Math.min(...next.cells.map(c => c[1])), maxY = Math.max(...next.cells.map(c => c[1]));
      const ox = (nextCanvas.width - (maxX - minX + 1) * pc) / 2 - minX * pc;
      const oy = (nextCanvas.height - (maxY - minY + 1) * pc) / 2 - minY * pc;
      next.cells.forEach(([cx, cy]) => { nextCtx.beginPath(); nextCtx.roundRect(cx * pc + ox + 1, cy * pc + oy + 1, pc - 2, pc - 2, 3); nextCtx.fillStyle = COLORS[next.name]; nextCtx.fill(); });
    }
  }

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
    spawnPiece(); lastDrop = performance.now();
    if (!rafId) rafId = requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (gameOver) return;
    paused = !paused;
    if (paused) { overlayText.textContent = "PROCEEDINGS SUSPENDED"; overlay.classList.remove("hidden"); pauseBtn.textContent = "Resume Proceedings"; }
    else { overlay.classList.add("hidden"); pauseBtn.textContent = "Pause Proceedings"; lastDrop = performance.now(); }
  }

  // keyboard
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

  // mobile touch controls
  const touchWrap = document.createElement("div");
  touchWrap.className = "mobile-controls";
  touchWrap.innerHTML = `
    <button class="mobile-btn" data-act="left">&larr;</button>
    <button class="mobile-btn" data-act="down">&darr;</button>
    <button class="mobile-btn" data-act="rotate">&circlearrowright;</button>
    <button class="mobile-btn" data-act="right">&rarr;</button>
    <button class="mobile-btn mobile-btn-wide" data-act="drop">DROP</button>
  `;
  const boardWrap = document.querySelector(".tetris-board-wrap");
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

  // init
  createBoard();
  computeTextLayout();
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
    fctx.fillStyle = "rgba(255,249,239,0.6)"; fctx.fillRect(0, 0, w, h);
    // watermark
    fctx.save(); fctx.translate(w / 2, h / 2); fctx.rotate(-0.35);
    fctx.font = "800 72px 'Outfit', sans-serif"; fctx.fillStyle = "rgba(20,33,61,0.04)";
    fctx.textAlign = "center"; fctx.fillText("FORM 27-B", 0, 0); fctx.restore();
    // header
    fctx.font = "700 18px 'Outfit', sans-serif"; fctx.fillStyle = "rgba(20,33,61,0.82)"; fctx.textAlign = "left";
    fctx.fillText("OFFICIAL NONSENSE FORM 27-B", 20, 30);
    fctx.font = "11px 'IBM Plex Mono', monospace"; fctx.fillStyle = "rgba(20,33,61,0.4)";
    fctx.fillText("DEPARTMENT OF RIDICULOUS INTERNET  ·  FILING REF: DRI-27B-" + new Date().getFullYear(), 20, 46);
    // obstacles
    const obstacles = getObstacleRects();
    obstacles.forEach((ob) => {
      fctx.fillStyle = "rgba(200,230,78,0.22)"; fctx.beginPath();
      fctx.roundRect(ob.x - 8, ob.y - 18, ob.w + 16, ob.h + 22, 8); fctx.fill();
      fctx.strokeStyle = "rgba(20,33,61,0.15)"; fctx.lineWidth = 1; fctx.stroke();
      fctx.font = "600 9px 'IBM Plex Mono', monospace"; fctx.fillStyle = "rgba(20,33,61,0.45)"; fctx.fillText(ob.label, ob.x, ob.y - 4);
      fctx.font = "italic 400 15px 'Crimson Pro', serif"; fctx.fillStyle = "rgba(20,33,61,0.88)"; fctx.fillText(ob.value, ob.x, ob.y + 20);
    });
    // boilerplate
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
    // stamp
    fctx.save(); fctx.translate(w - 90, h - 60); fctx.rotate(-0.15);
    fctx.strokeStyle = "rgba(157,23,23,0.25)"; fctx.lineWidth = 2; fctx.strokeRect(-40, -20, 80, 40);
    fctx.font = "700 11px 'IBM Plex Mono', monospace"; fctx.fillStyle = "rgba(157,23,23,0.3)";
    fctx.textAlign = "center"; fctx.fillText("PENDING", 0, 4); fctx.restore();
  }
  [nameInput, reasonInput, emergencyInput].forEach((input) => input.addEventListener("input", renderForm));
  renderForm();
})();
