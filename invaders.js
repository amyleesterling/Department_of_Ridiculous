/* Space Invaders — Defend the Homeland: stamp DENIED on descending budget items */
(function () {
  const canvas = document.getElementById("invadersCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const startBtn = document.getElementById("invadersStartBtn");
  const W = canvas.width, H = canvas.height;
  const ALIEN_LABELS = ["EXPENSE", "AUDIT FEE", "PORK", "OVERTIME", "CONSULT"];
  const ALIEN_COLORS = ["#c41e3a", "#d4a017", "#1a3a6b", "#8b5e3c", "#7a3b8f"];
  const GOLD = "#d4a017";

  let player, bullets, aliens, alienBullets, alienDir, alienTimer, dropNext;
  let score, gameState, lastTime;

  function init() {
    player = { x: W / 2 - 20, y: H - 40, w: 40, h: 16 };
    bullets = []; alienBullets = [];
    aliens = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        aliens.push({
          x: 30 + col * 54, y: 30 + row * 36, w: 48, h: 22,
          label: ALIEN_LABELS[row % ALIEN_LABELS.length],
          color: ALIEN_COLORS[row % ALIEN_COLORS.length],
          alive: true,
        });
      }
    }
    alienDir = 1; alienTimer = 0; dropNext = false;
    score = 0; gameState = "playing"; lastTime = 0;
  }

  function shoot() {
    if (bullets.length < 3) bullets.push({ x: player.x + player.w / 2 - 2, y: player.y - 6, w: 4, h: 10 });
  }

  function update(dt) {
    // player bullets
    bullets.forEach(b => b.y -= 6);
    bullets = bullets.filter(b => b.y > -10);
    // alien bullets
    alienBullets.forEach(b => b.y += 3.5);
    alienBullets = alienBullets.filter(b => b.y < H + 10);
    // alien movement
    alienTimer += dt;
    if (alienTimer > 600 - Math.min(400, (32 - aliens.filter(a => a.alive).length) * 12)) {
      alienTimer = 0;
      const liveAliens = aliens.filter(a => a.alive);
      if (dropNext) {
        liveAliens.forEach(a => a.y += 18);
        dropNext = false;
      } else {
        let edge = false;
        liveAliens.forEach(a => { a.x += 14 * alienDir; if (a.x + a.w > W - 10 || a.x < 10) edge = true; });
        if (edge) { alienDir *= -1; dropNext = true; }
      }
      // random alien shoot
      if (liveAliens.length > 0) {
        const shooter = liveAliens[Math.floor(Math.random() * liveAliens.length)];
        alienBullets.push({ x: shooter.x + shooter.w / 2 - 2, y: shooter.y + shooter.h, w: 4, h: 8 });
      }
    }
    // bullet-alien collision
    bullets.forEach(b => {
      aliens.forEach(a => {
        if (a.alive && b.x < a.x + a.w && b.x + b.w > a.x && b.y < a.y + a.h && b.y + b.h > a.y) {
          a.alive = false; b.y = -99; score += 50;
        }
      });
    });
    // alien bullet-player collision
    alienBullets.forEach(b => {
      if (b.x < player.x + player.w && b.x + b.w > player.x && b.y < player.y + player.h && b.y + b.h > player.y) {
        gameState = "dead";
      }
    });
    // aliens reach bottom
    if (aliens.some(a => a.alive && a.y + a.h >= player.y)) gameState = "dead";
    // win
    if (aliens.every(a => !a.alive)) gameState = "win";
  }

  function render() {
    ctx.fillStyle = "#0a0e1a"; ctx.fillRect(0, 0, W, H);
    // stars
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i < 40; i++) { ctx.fillRect((i * 97) % W, (i * 53) % H, 1, 1); }
    // player
    ctx.fillStyle = GOLD;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillRect(player.x + player.w / 2 - 3, player.y - 8, 6, 8);
    // bullets
    ctx.fillStyle = "#fff";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
    // alien bullets
    ctx.fillStyle = "#c41e3a";
    alienBullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
    // aliens
    aliens.forEach(a => {
      if (!a.alive) return;
      ctx.fillStyle = a.color;
      ctx.beginPath(); ctx.roundRect(a.x, a.y, a.w, a.h, 4); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 7px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(a.label, a.x + a.w / 2, a.y + a.h / 2);
    });
    // score
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px 'Outfit', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("DENIED: $" + score, 10, H - 10);
    // overlays
    if (gameState === "dead") {
      ctx.fillStyle = "rgba(10,14,26,0.75)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#c41e3a"; ctx.font = "bold 24px 'Outfit', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("BUDGET BREACH", W / 2, H / 2 - 18);
      ctx.fillStyle = "#fff"; ctx.font = "13px 'Outfit', sans-serif";
      ctx.fillText("$" + score + " denied — the Strait of Hormuz remains closed.", W / 2, H / 2 + 6);
      ctx.font = "11px 'Outfit', sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("Gas is now $" + (4.29 + score * 0.03).toFixed(2) + "/gal. The Department sends its thoughts.", W / 2, H / 2 + 24);
    }
    if (gameState === "win") {
      ctx.fillStyle = "rgba(10,14,26,0.75)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = GOLD; ctx.font = "bold 24px 'Outfit', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("HOMELAND SECURED", W / 2, H / 2 - 10);
      ctx.fillStyle = "#fff"; ctx.font = "13px 'Outfit', sans-serif";
      ctx.fillText("$" + score + " in cuts — click Start for next wave", W / 2, H / 2 + 14);
    }
    if (gameState === "ready") {
      ctx.fillStyle = "rgba(10,14,26,0.6)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = GOLD; ctx.font = "bold 22px 'Outfit', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("DEFEND THE HOMELAND", W / 2, H / 2 - 20);
      ctx.fillStyle = "#fff"; ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.fillText("ARROWS TO MOVE · SPACE TO STAMP DENIED", W / 2, H / 2 + 8);
    }
  }

  let keys = {};
  let rafId = null;

  function gameLoop(now) {
    if (!lastTime) lastTime = now;
    const dt = Math.min(now - lastTime, 50);
    lastTime = now;
    if (gameState === "playing") {
      if (keys.ArrowLeft) player.x = Math.max(0, player.x - 4);
      if (keys.ArrowRight) player.x = Math.min(W - player.w, player.x + 4);
      update(dt);
    }
    render();
    rafId = requestAnimationFrame(gameLoop);
  }

  function start() { init(); gameState = "ready"; lastTime = 0; if (!rafId) rafId = requestAnimationFrame(gameLoop); }

  startBtn.addEventListener("click", () => { if (gameState === "ready" || gameState === "dead" || gameState === "win") { init(); gameState = "playing"; } else start(); });

  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " " && gameState === "playing") { e.preventDefault(); shoot(); }
    if (e.key === " " && (gameState === "ready")) { e.preventDefault(); gameState = "playing"; }
    if (e.key === " " && (gameState === "dead" || gameState === "win")) { e.preventDefault(); init(); gameState = "playing"; }
  });
  document.addEventListener("keyup", (e) => { keys[e.key] = false; });

  // mobile controls
  const wrap = document.createElement("div");
  wrap.className = "mobile-controls";
  wrap.innerHTML = `
    <button class="mobile-btn" data-act="left">&larr;</button>
    <button class="mobile-btn" data-act="shoot">DENY</button>
    <button class="mobile-btn" data-act="right">&rarr;</button>
  `;
  canvas.parentNode.appendChild(wrap);
  let mobileInterval = null;
  wrap.addEventListener("pointerdown", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (!act || gameState !== "playing") return;
    e.preventDefault();
    if (act === "shoot") shoot();
    else {
      const move = () => { if (act === "left") player.x = Math.max(0, player.x - 6); else player.x = Math.min(W - player.w, player.x + 6); };
      move();
      mobileInterval = setInterval(move, 80);
    }
  });
  wrap.addEventListener("pointerup", () => { clearInterval(mobileInterval); });
  wrap.addEventListener("pointerleave", () => { clearInterval(mobileInterval); });

  start();
})();
