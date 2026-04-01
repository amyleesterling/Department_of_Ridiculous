/* Breakout — Department HQ Demolition: smash through layers of bureaucracy */
(function () {
  const canvas = document.getElementById("breakoutCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const startBtn = document.getElementById("breakoutStartBtn");
  const W = canvas.width, H = canvas.height;

  const HIERARCHY = [
    { label: "SECRETARY", color: "#c41e3a" },
    { label: "DEPUTY", color: "#1a3a6b" },
    { label: "DIRECTOR", color: "#7a3b8f" },
    { label: "MANAGER", color: "#d4a017" },
    { label: "ANALYST", color: "#5c3a1e" },
    { label: "INTERN", color: "#2d6b3f" },
  ];

  const PAD_W = 70, PAD_H = 12, BALL_R = 6;
  const BRICK_ROWS = 6, BRICK_COLS = 8;
  const BRICK_W = (W - 40) / BRICK_COLS, BRICK_H = 22, BRICK_PAD = 3;

  let paddle, ball, bricks, score, gameState, lives;

  function init() {
    paddle = { x: W / 2 - PAD_W / 2, y: H - 36 };
    ball = { x: W / 2, y: H - 52, dx: 3 * (Math.random() > 0.5 ? 1 : -1), dy: -3.5 };
    bricks = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: 20 + c * BRICK_W + BRICK_PAD,
          y: 40 + r * (BRICK_H + BRICK_PAD),
          w: BRICK_W - BRICK_PAD * 2,
          h: BRICK_H,
          alive: true,
          ...HIERARCHY[r % HIERARCHY.length],
        });
      }
    }
    score = 0; lives = 3; gameState = "ready";
  }

  function resetBall() {
    ball.x = paddle.x + PAD_W / 2;
    ball.y = paddle.y - 16;
    ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -3.5;
  }

  function update() {
    ball.x += ball.dx; ball.y += ball.dy;
    // walls
    if (ball.x - BALL_R < 0 || ball.x + BALL_R > W) ball.dx *= -1;
    if (ball.y - BALL_R < 0) ball.dy = Math.abs(ball.dy);
    // paddle
    if (ball.dy > 0 && ball.y + BALL_R > paddle.y && ball.y + BALL_R < paddle.y + PAD_H + 4 &&
        ball.x > paddle.x && ball.x < paddle.x + PAD_W) {
      ball.dy = -Math.abs(ball.dy);
      ball.dx += (ball.x - (paddle.x + PAD_W / 2)) * 0.08;
    }
    // bricks
    bricks.forEach(b => {
      if (!b.alive) return;
      if (ball.x + BALL_R > b.x && ball.x - BALL_R < b.x + b.w &&
          ball.y + BALL_R > b.y && ball.y - BALL_R < b.y + b.h) {
        b.alive = false; ball.dy *= -1; score += 20;
      }
    });
    // bottom
    if (ball.y > H + 10) {
      lives--;
      if (lives <= 0) gameState = "dead";
      else resetBall();
    }
    // win
    if (bricks.every(b => !b.alive)) gameState = "win";
    // speed cap
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    if (speed > 7) { ball.dx *= 7 / speed; ball.dy *= 7 / speed; }
  }

  function render() {
    ctx.fillStyle = "#0a0e1a"; ctx.fillRect(0, 0, W, H);
    // bricks
    bricks.forEach(b => {
      if (!b.alive) return;
      ctx.fillStyle = b.color;
      ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 3); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 7px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2);
    });
    // paddle
    ctx.fillStyle = "#d4a017";
    ctx.beginPath(); ctx.roundRect(paddle.x, paddle.y, PAD_W, PAD_H, 4); ctx.fill();
    // ball
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2); ctx.fill();
    // HUD
    ctx.fillStyle = "#fff"; ctx.font = "bold 13px 'Outfit', sans-serif"; ctx.textAlign = "left";
    ctx.fillText("DEMOLISHED: " + score, 10, H - 8);
    ctx.textAlign = "right";
    ctx.fillText("LIVES: " + lives, W - 10, H - 8);
    // overlays
    if (gameState === "dead") {
      ctx.fillStyle = "rgba(10,14,26,0.75)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#c41e3a"; ctx.font = "bold 24px 'Outfit', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("STRUCTURALLY DEFEATED", W / 2, H / 2 - 10);
      ctx.fillStyle = "#fff"; ctx.font = "13px 'Outfit', sans-serif";
      ctx.fillText(score + " demolished — click Start to rebuild", W / 2, H / 2 + 14);
    }
    if (gameState === "win") {
      ctx.fillStyle = "rgba(10,14,26,0.75)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#d4a017"; ctx.font = "bold 24px 'Outfit', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("ORG CHART DEMOLISHED", W / 2, H / 2 - 10);
      ctx.fillStyle = "#fff"; ctx.font = "13px 'Outfit', sans-serif";
      ctx.fillText(score + " positions eliminated — click Start again", W / 2, H / 2 + 14);
    }
    if (gameState === "ready") {
      ctx.fillStyle = "rgba(10,14,26,0.6)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#d4a017"; ctx.font = "bold 22px 'Outfit', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("HQ DEMOLITION", W / 2, H / 2 - 20);
      ctx.fillStyle = "#fff"; ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.fillText("BREAK THROUGH THE ORG CHART", W / 2, H / 2);
      ctx.fillText("MOUSE/TOUCH TO MOVE · CLICK TO START", W / 2, H / 2 + 20);
    }
  }

  let rafId = null;
  function gameLoop() { if (gameState === "playing") update(); render(); rafId = requestAnimationFrame(gameLoop); }
  function start() { init(); if (!rafId) rafId = requestAnimationFrame(gameLoop); }

  startBtn.addEventListener("click", () => {
    if (gameState === "ready") gameState = "playing";
    else { init(); gameState = "playing"; }
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    paddle.x = Math.max(0, Math.min(W - PAD_W, (e.clientX - rect.left) * (W / rect.width) - PAD_W / 2));
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    paddle.x = Math.max(0, Math.min(W - PAD_W, (e.touches[0].clientX - rect.left) * (W / rect.width) - PAD_W / 2));
  }, { passive: false });

  canvas.addEventListener("click", () => { if (gameState === "ready") gameState = "playing"; });

  // mobile controls for paddle
  const wrap = document.createElement("div");
  wrap.className = "mobile-controls";
  wrap.innerHTML = `
    <button class="mobile-btn" data-act="left">&larr;</button>
    <button class="mobile-btn mobile-btn-wide" data-act="launch">LAUNCH</button>
    <button class="mobile-btn" data-act="right">&rarr;</button>
  `;
  canvas.parentNode.appendChild(wrap);
  let mobileInterval = null;
  wrap.addEventListener("pointerdown", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (!act) return;
    e.preventDefault();
    if (act === "launch" && gameState === "ready") { gameState = "playing"; return; }
    const move = () => { if (act === "left") paddle.x = Math.max(0, paddle.x - 8); else if (act === "right") paddle.x = Math.min(W - PAD_W, paddle.x + 8); };
    move();
    mobileInterval = setInterval(move, 50);
  });
  wrap.addEventListener("pointerup", () => clearInterval(mobileInterval));
  wrap.addEventListener("pointerleave", () => clearInterval(mobileInterval));

  start();
})();
