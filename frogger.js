/* Frogger — Release the Frogs: navigate across the active webpage */
(function () {
  let shell, canvas, ctx, rafId, gameState;
  let frog, lanes, score, lives;
  const FROG_SIZE = 32;
  const LANE_H = 50;
  const NUM_LANES = 8;
  const VEHICLE_LABELS = [
    "FILING CABINET", "RED TAPE", "MEMO TRUCK", "STAMP ROLLER",
    "AUDIT VAN", "BUDGET BUS", "TAX FORM", "REGULATION RIG",
  ];
  const VEHICLE_COLORS = ["#8b5e3c", "#c41e3a", "#1a3a6b", "#d4a017", "#5c3a1e", "#2d5016", "#7a3b8f", "#1a3a6b"];

  function initDOM() {
    shell = document.createElement("div");
    shell.className = "frogger-shell hidden";
    shell.innerHTML = `
      <div class="frogger-hud">
        <span class="frogger-hud-item" id="frogScore">SCORE: 0</span>
        <span class="frogger-hud-item" id="frogLives">LIVES: 3</span>
        <button class="frogger-close-btn" id="frogClose">X CLOSE</button>
      </div>
    `;
    canvas = document.createElement("canvas");
    canvas.className = "frogger-canvas";
    shell.appendChild(canvas);
    // mobile controls
    const mobileCtrl = document.createElement("div");
    mobileCtrl.className = "frogger-mobile-controls";
    mobileCtrl.innerHTML = `
      <button class="mobile-btn" data-dir="up">&uarr;</button>
      <div class="frogger-mobile-row">
        <button class="mobile-btn" data-dir="left">&larr;</button>
        <button class="mobile-btn" data-dir="down">&darr;</button>
        <button class="mobile-btn" data-dir="right">&rarr;</button>
      </div>
    `;
    shell.appendChild(mobileCtrl);
    document.body.appendChild(shell);
    ctx = canvas.getContext("2d");
    document.getElementById("frogClose").addEventListener("click", closeFrogger);
    mobileCtrl.addEventListener("pointerdown", (e) => {
      const dir = e.target.closest("[data-dir]")?.dataset.dir;
      if (!dir || gameState !== "playing") return;
      e.preventDefault();
      moveFrog(dir);
    });
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function buildLanes() {
    lanes = [];
    const h = canvas.height;
    const startY = h - LANE_H; // bottom safe zone
    for (let i = 0; i < NUM_LANES; i++) {
      const y = startY - (i + 1) * LANE_H;
      const speed = (1.5 + Math.random() * 2.5) * (i % 2 === 0 ? 1 : -1);
      const count = 2 + Math.floor(Math.random() * 3);
      const vehicles = [];
      const vw = 100 + Math.random() * 80;
      for (let j = 0; j < count; j++) {
        vehicles.push({
          x: j * (canvas.width / count) + Math.random() * 60,
          w: vw,
          label: VEHICLE_LABELS[i % VEHICLE_LABELS.length],
          color: VEHICLE_COLORS[i % VEHICLE_COLORS.length],
        });
      }
      lanes.push({ y, speed, vehicles });
    }
  }

  function resetFrog() {
    frog = {
      x: canvas.width / 2 - FROG_SIZE / 2,
      y: canvas.height - LANE_H / 2 - FROG_SIZE / 2,
      size: FROG_SIZE,
    };
  }

  function moveFrog(dir) {
    if (dir === "up") frog.y -= LANE_H;
    else if (dir === "down") frog.y = Math.min(canvas.height - LANE_H / 2 - FROG_SIZE / 2, frog.y + LANE_H);
    else if (dir === "left") frog.x = Math.max(0, frog.x - LANE_H);
    else if (dir === "right") frog.x = Math.min(canvas.width - FROG_SIZE, frog.x + LANE_H);
    // reached top?
    if (frog.y < LANE_H / 2) {
      score += 100;
      document.getElementById("frogScore").textContent = "SCORE: " + score;
      resetFrog();
    }
  }

  function checkCollision() {
    const fx = frog.x, fy = frog.y, fs = frog.size;
    for (const lane of lanes) {
      for (const v of lane.vehicles) {
        if (fy + fs > lane.y && fy < lane.y + LANE_H &&
            fx + fs > v.x && fx < v.x + v.w) {
          return true;
        }
      }
    }
    return false;
  }

  function update() {
    lanes.forEach((lane) => {
      lane.vehicles.forEach((v) => {
        v.x += lane.speed;
        if (lane.speed > 0 && v.x > canvas.width + 20) v.x = -v.w - 20;
        if (lane.speed < 0 && v.x + v.w < -20) v.x = canvas.width + 20;
      });
    });
    if (checkCollision()) {
      lives--;
      document.getElementById("frogLives").textContent = "LIVES: " + lives;
      if (lives <= 0) gameState = "dead";
      else resetFrog();
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // safe zones
    ctx.fillStyle = "rgba(76, 175, 80, 0.15)";
    ctx.fillRect(0, 0, canvas.width, LANE_H);
    ctx.fillRect(0, canvas.height - LANE_H, canvas.width, LANE_H);
    // goal label
    ctx.fillStyle = "rgba(26,58,107,0.3)";
    ctx.font = "bold 14px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SAFETY ZONE", canvas.width / 2, LANE_H / 2 + 5);
    // lanes
    lanes.forEach((lane, i) => {
      ctx.fillStyle = i % 2 === 0 ? "rgba(20,33,61,0.06)" : "rgba(20,33,61,0.03)";
      ctx.fillRect(0, lane.y, canvas.width, LANE_H);
      lane.vehicles.forEach((v) => {
        ctx.fillStyle = v.color;
        ctx.beginPath();
        ctx.roundRect(v.x, lane.y + 6, v.w, LANE_H - 12, 6);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px 'IBM Plex Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(v.label, v.x + v.w / 2, lane.y + LANE_H / 2);
      });
    });
    // frog
    ctx.fillStyle = "#4caf50";
    ctx.beginPath();
    ctx.arc(frog.x + frog.size / 2, frog.y + frog.size / 2, frog.size / 2, 0, Math.PI * 2);
    ctx.fill();
    // eyes
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(frog.x + 10, frog.y + 10, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(frog.x + 22, frog.y + 10, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#14213d";
    ctx.beginPath(); ctx.arc(frog.x + 11, frog.y + 10, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(frog.x + 23, frog.y + 10, 2, 0, Math.PI * 2); ctx.fill();

    if (gameState === "dead") {
      ctx.fillStyle = "rgba(20,33,61,0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#c41e3a";
      ctx.font = "bold 28px 'Outfit', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("FLATTENED BY BUREAUCRACY", canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = "#fff";
      ctx.font = "14px 'Outfit', sans-serif";
      ctx.fillText("Score: " + score + " — Click to retry", canvas.width / 2, canvas.height / 2 + 20);
    }
  }

  function gameLoop() {
    if (!shell || shell.classList.contains("hidden")) { rafId = null; return; }
    if (gameState === "playing") update();
    render();
    rafId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    resizeCanvas();
    buildLanes();
    score = 0; lives = 3; gameState = "playing";
    resetFrog();
    document.getElementById("frogScore").textContent = "SCORE: 0";
    document.getElementById("frogLives").textContent = "LIVES: 3";
    if (!rafId) rafId = requestAnimationFrame(gameLoop);
  }

  function openFrogger() {
    if (!shell) initDOM();
    shell.classList.remove("hidden");
    startGame();
  }

  function closeFrogger() {
    if (shell) shell.classList.add("hidden");
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  document.addEventListener("keydown", (e) => {
    if (!shell || shell.classList.contains("hidden")) return;
    if (gameState !== "playing") return;
    if (e.key === "ArrowUp") { e.preventDefault(); moveFrog("up"); }
    else if (e.key === "ArrowDown") { e.preventDefault(); moveFrog("down"); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); moveFrog("left"); }
    else if (e.key === "ArrowRight") { e.preventDefault(); moveFrog("right"); }
    else if (e.key === "Escape") closeFrogger();
  });

  document.addEventListener("click", (e) => {
    if (shell && !shell.classList.contains("hidden") && gameState === "dead") startGame();
  });

  window.openFrogger = openFrogger;
})();
