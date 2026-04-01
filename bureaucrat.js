/* Feed the Bureaucrat — tap to feed coins, watch the budget fill up,
   then get reset by an administration change at 99%. */
(function () {
  let shell, canvas, ctx, rafId = null;
  const W = 420, H = 520;

  /* ─── State ─── */
  let budget = 0;           // 0–100
  let coins = [];            // falling coin particles
  let tieColor = "#1a3a6b"; // starts blue
  let adminChanges = 0;
  let gameState = "ready";   // ready | playing | changing
  let changeTimer = 0;
  let changeFlashCount = 0;
  let lastTime = 0;
  let shakeX = 0, shakeY = 0;
  let feedCount = 0;

  const COIN_LABELS = ["$1K", "$5K", "$10K", "$50K", "$100K", "PORK", "GRANT", "SUBSIDY", "EARMARK", "SLUSH"];

  function init() {
    budget = 0;
    coins = [];
    tieColor = adminChanges % 2 === 0 ? "#1a3a6b" : "#c41e3a";
    gameState = "playing";
    changeTimer = 0;
    changeFlashCount = 0;
    feedCount = 0;
    shakeX = 0; shakeY = 0;
  }

  function feedCoin() {
    if (gameState !== "playing") return;
    feedCount++;
    // random coin value between 0.5 and 3
    const value = 0.5 + Math.random() * 2.5;
    budget = Math.min(99.4, budget + value);

    // spawn coin particle — arcs toward the bureaucrat's pocket
    const pocketX = W / 2 + 18; // jacket breast pocket
    const pocketY = 228;        // chest height
    const startX = W / 2 + (Math.random() - 0.5) * 200;
    const startY = H - 60;
    coins.push({
      x: startX, y: startY,
      startX, startY,
      targetX: pocketX + (Math.random() - 0.5) * 10,
      targetY: pocketY + (Math.random() - 0.5) * 8,
      t: 0, // 0→1 animation progress
      label: COIN_LABELS[Math.floor(Math.random() * COIN_LABELS.length)],
    });

    // screen shake
    shakeX = (Math.random() - 0.5) * 4;
    shakeY = (Math.random() - 0.5) * 4;

    // check for administration change
    if (budget >= 99) {
      gameState = "changing";
      changeTimer = 0;
      changeFlashCount = 0;
    }
  }

  function update(dt) {
    // settle shake
    shakeX *= 0.9;
    shakeY *= 0.9;

    // update coin particles — arc toward pocket
    coins.forEach(c => {
      c.t = Math.min(1, c.t + dt * 0.0025);
      const ease = c.t * c.t * (3 - 2 * c.t); // smoothstep
      const arcY = -180 * Math.sin(c.t * Math.PI); // parabolic arc upward
      c.x = c.startX + (c.targetX - c.startX) * ease;
      c.y = c.startY + (c.targetY - c.startY) * ease + arcY;
    });
    coins = coins.filter(c => c.t < 1);

    // idle coin drift toward bureaucrat
    if (gameState === "playing" && budget > 0) {
      // slowly drain if not feeding
      // (optional: keep budget stable)
    }

    // administration change animation
    if (gameState === "changing") {
      changeTimer += dt;
      changeFlashCount = Math.floor(changeTimer / 150);

      if (changeTimer > 2500) {
        adminChanges++;
        init();
      }
    }
  }

  function drawBureaucrat(cx, cy) {
    // body (suit jacket)
    ctx.fillStyle = "#2d3436";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 48, 50, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // head
    ctx.fillStyle = "#f5c6a0";
    ctx.beginPath();
    ctx.arc(cx, cy - 20, 32, 0, Math.PI * 2);
    ctx.fill();

    // eyes
    const eyeY = cy - 24;
    ctx.fillStyle = "#14213d";
    ctx.beginPath(); ctx.arc(cx - 10, eyeY, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 10, eyeY, 3, 0, Math.PI * 2); ctx.fill();

    // mouth — gets wider/happier as budget fills
    const mouthWidth = 4 + (budget / 100) * 16;
    ctx.strokeStyle = "#14213d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy - 8, mouthWidth, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // glasses
    ctx.strokeStyle = "#14213d";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.rect(cx - 18, eyeY - 6, 14, 10); ctx.stroke();
    ctx.beginPath(); ctx.rect(cx + 4, eyeY - 6, 14, 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 4, eyeY); ctx.lineTo(cx + 4, eyeY); ctx.stroke();

    // TIE — the key visual!
    ctx.fillStyle = tieColor;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 10);
    ctx.lineTo(cx + 6, cy + 10);
    ctx.lineTo(cx + 4, cy + 50);
    ctx.lineTo(cx, cy + 56);
    ctx.lineTo(cx - 4, cy + 50);
    ctx.closePath();
    ctx.fill();
    // tie knot
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + 8);
    ctx.lineTo(cx + 8, cy + 8);
    ctx.lineTo(cx + 6, cy + 14);
    ctx.lineTo(cx - 6, cy + 14);
    ctx.closePath();
    ctx.fill();

    // breast pocket (coin target)
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(cx + 10, cy + 18, 22, 16, 3); ctx.stroke();
    // pocket square
    ctx.fillStyle = tieColor;
    ctx.beginPath();
    ctx.moveTo(cx + 14, cy + 18);
    ctx.lineTo(cx + 18, cy + 24);
    ctx.lineTo(cx + 22, cy + 18);
    ctx.closePath();
    ctx.fill();

    // hair
    ctx.fillStyle = "#636e72";
    ctx.beginPath();
    ctx.ellipse(cx, cy - 44, 28, 12, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // name badge
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(cx - 28, cy + 28, 56, 16);
    ctx.fillStyle = "#14213d";
    ctx.font = "bold 8px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BUREAUCRAT", cx, cy + 36);
  }

  function drawProgressBar(x, y, w, h) {
    // background
    ctx.fillStyle = "rgba(20,33,61,0.12)";
    ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();

    // fill
    const fillW = (budget / 100) * w;
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, "#d4a017");
    grad.addColorStop(1, budget > 90 ? "#c41e3a" : "#f0d060");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.roundRect(x, y, Math.max(h, fillW), h, h / 2); ctx.fill();

    // percentage text
    ctx.fillStyle = "#14213d";
    ctx.font = "bold 14px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(Math.floor(budget) + "% FUNDED", x + w / 2, y + h / 2);
  }

  function render(now) {
    if (!lastTime) lastTime = now;
    const dt = now - lastTime;
    lastTime = now;

    update(dt);

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(shakeX, shakeY);

    // background
    ctx.fillStyle = "#fff8ef";
    ctx.fillRect(0, 0, W, H);

    // title
    ctx.fillStyle = "#14213d";
    ctx.font = "bold 18px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FEED THE BUREAUCRAT", W / 2, 30);

    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(20,33,61,0.5)";
    ctx.fillText("TAP TO INSERT COINS · REACH 100% TO FUND", W / 2, 50);

    // admin change counter
    if (adminChanges > 0) {
      ctx.fillStyle = "rgba(196,30,58,0.6)";
      ctx.font = "bold 10px 'IBM Plex Mono', monospace";
      ctx.fillText("ADMINISTRATION CHANGES: " + adminChanges, W / 2, 68);
    }

    // progress bar
    drawProgressBar(40, 80, W - 80, 28);

    // bureaucrat
    const bx = W / 2, by = 200;
    drawBureaucrat(bx, by);

    // desk
    ctx.fillStyle = "#5c3a1e";
    ctx.beginPath(); ctx.roundRect(bx - 80, by + 76, 160, 14, 4); ctx.fill();
    ctx.fillStyle = "#8b6914";
    ctx.fillRect(bx - 76, by + 78, 152, 2);

    // coin stack on desk (grows with budget)
    const stackHeight = Math.floor(budget / 10);
    for (let i = 0; i < stackHeight; i++) {
      ctx.fillStyle = "#d4a017";
      ctx.beginPath();
      ctx.ellipse(bx + 50, by + 72 - i * 4, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#b8860b";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // flying coin particles — arc toward pocket
    coins.forEach(c => {
      const fade = c.t > 0.8 ? 1 - (c.t - 0.8) / 0.2 : 1; // fade out near pocket
      const scale = 1 - c.t * 0.4; // shrink as it lands
      ctx.globalAlpha = fade;
      ctx.fillStyle = "#d4a017";
      ctx.beginPath();
      ctx.arc(c.x, c.y, 12 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#14213d";
      ctx.font = `bold ${Math.round(7 * scale)}px 'IBM Plex Mono', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c.label, c.x, c.y);
      ctx.globalAlpha = 1;
    });

    // feed counter
    ctx.fillStyle = "rgba(20,33,61,0.3)";
    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("COINS FED: " + feedCount, W / 2, by + 110);

    // tap hint
    if (gameState === "playing" && budget < 10) {
      ctx.fillStyle = "rgba(212,160,23,0.6)";
      ctx.font = "bold 14px 'Outfit', sans-serif";
      ctx.textAlign = "center";
      const pulse = 0.7 + Math.sin(now / 300) * 0.3;
      ctx.globalAlpha = pulse;
      ctx.fillText("TAP / CLICK TO FEED", W / 2, H - 40);
      ctx.globalAlpha = 1;
    }

    // big percentage display at bottom
    if (budget > 50) {
      ctx.fillStyle = budget > 90 ? "rgba(196,30,58,0.15)" : "rgba(212,160,23,0.1)";
      ctx.font = "bold 72px 'Outfit', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(Math.floor(budget) + "%", W / 2, H - 60);
    }

    // ADMINISTRATION CHANGE overlay
    if (gameState === "changing") {
      const flash = changeFlashCount % 2 === 0;
      ctx.fillStyle = flash ? "rgba(196,30,58,0.85)" : "rgba(26,58,107,0.85)";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 28px 'Outfit', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ADMINISTRATION", W / 2, H / 2 - 30);
      ctx.fillText("CHANGE", W / 2, H / 2 + 10);

      ctx.font = "13px 'IBM Plex Mono', monospace";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText("ALL PROGRESS RESET TO 0%", W / 2, H / 2 + 50);

      // show tie swap
      const nextTie = adminChanges % 2 === 0 ? "#c41e3a" : "#1a3a6b";
      const nextLabel = adminChanges % 2 === 0 ? "RED" : "BLUE";
      ctx.fillStyle = nextTie;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 12, H / 2 + 80);
      ctx.lineTo(W / 2 + 12, H / 2 + 80);
      ctx.lineTo(W / 2 + 8, H / 2 + 120);
      ctx.lineTo(W / 2, H / 2 + 128);
      ctx.lineTo(W / 2 - 8, H / 2 + 120);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px 'IBM Plex Mono', monospace";
      ctx.fillText("NEW TIE: " + nextLabel, W / 2, H / 2 + 150);
    }

    // ready overlay
    if (gameState === "ready") {
      ctx.fillStyle = "rgba(10,14,26,0.6)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#d4a017";
      ctx.font = "bold 24px 'Outfit', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("FEED THE BUREAUCRAT", W / 2, H / 2 - 20);
      ctx.fillStyle = "#fff";
      ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.fillText("TAP TO INSERT COINS", W / 2, H / 2 + 8);
      ctx.fillText("REACH 100% TO FUND THE BUDGET", W / 2, H / 2 + 28);
    }

    ctx.restore();

    rafId = requestAnimationFrame(render);
  }

  /* ─── DOM setup ─── */
  function initDOM() {
    shell = document.createElement("div");
    shell.className = "pacman-shell hidden";
    shell.setAttribute("aria-hidden", "true");

    const backdrop = document.createElement("div");
    backdrop.className = "pacman-backdrop";
    backdrop.addEventListener("click", close);

    const card = document.createElement("div");
    card.className = "pacman-card";
    card.style.maxWidth = W + 40 + "px";

    const header = document.createElement("div");
    header.className = "pacman-header";
    header.innerHTML = `
      <div>
        <p class="panel-kicker" style="color:rgba(255,255,255,0.5)">Fiscal feeding exercise</p>
        <h2 style="font-family:'Bungee',cursive;font-size:clamp(1.2rem,3vw,1.6rem);color:#ffd93d">FEED THE BUREAUCRAT</h2>
      </div>
      <button class="composer-close" aria-label="Close game">X</button>
    `;
    header.querySelector("button").addEventListener("click", close);

    canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = W + "px";
    canvas.style.borderRadius = "0.8rem";
    canvas.style.cursor = "pointer";
    ctx = canvas.getContext("2d");

    // click/tap to feed
    canvas.addEventListener("click", () => {
      if (gameState === "ready") { init(); return; }
      feedCoin();
    });

    card.appendChild(header);
    card.appendChild(canvas);
    shell.appendChild(backdrop);
    shell.appendChild(card);
    document.body.appendChild(shell);
  }

  function open() {
    if (!shell) initDOM();
    shell.classList.remove("hidden");
    shell.setAttribute("aria-hidden", "false");
    init();
    lastTime = 0;
    if (!rafId) rafId = requestAnimationFrame(render);
  }

  function close() {
    if (shell) {
      shell.classList.add("hidden");
      shell.setAttribute("aria-hidden", "true");
    }
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    lastTime = 0;
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && shell && !shell.classList.contains("hidden")) close();
    if (e.key === " " && shell && !shell.classList.contains("hidden")) { e.preventDefault(); feedCoin(); }
  });

  window.openPacman = open; // keep same global name for compatibility
})();
