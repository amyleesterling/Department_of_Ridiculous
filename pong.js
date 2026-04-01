/* Pong — Bipartisan Lobby: THE BILL bounces between parties forever */
(function () {
  const canvas = document.getElementById("pongCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const startBtn = document.getElementById("pongStartBtn");
  const W = canvas.width, H = canvas.height;

  const PAD_W = 14, PAD_H = 70, BALL_R = 10;
  let leftY, rightY, ball, leftScore, rightScore, gameState, rallyCount;
  let aiSpeed = 2.8;

  function init() {
    leftY = H / 2 - PAD_H / 2;
    rightY = H / 2 - PAD_H / 2;
    ball = { x: W / 2, y: H / 2, dx: 3.5 * (Math.random() > 0.5 ? 1 : -1), dy: 2 * (Math.random() - 0.5) };
    leftScore = 0; rightScore = 0; rallyCount = 0;
    gameState = "ready";
  }

  function resetBall() {
    ball.x = W / 2; ball.y = H / 2;
    ball.dx = 3.5 * (ball.dx > 0 ? -1 : 1);
    ball.dy = 2 * (Math.random() - 0.5);
    rallyCount = 0;
  }

  let playerY = null; // null = AI plays both, otherwise player controls left

  function update() {
    // ball
    ball.x += ball.dx; ball.y += ball.dy;
    if (ball.y - BALL_R < 0 || ball.y + BALL_R > H) ball.dy *= -1;

    // left paddle (player or AI)
    if (playerY !== null) {
      leftY = Math.max(0, Math.min(H - PAD_H, playerY - PAD_H / 2));
    } else {
      const lt = leftY + PAD_H / 2;
      if (lt < ball.y - 10) leftY += aiSpeed;
      if (lt > ball.y + 10) leftY -= aiSpeed;
    }

    // right paddle AI
    const rt = rightY + PAD_H / 2;
    if (rt < ball.y - 8) rightY += aiSpeed;
    if (rt > ball.y + 8) rightY -= aiSpeed;

    // paddle collisions
    if (ball.x - BALL_R < PAD_W + 16 && ball.y > leftY && ball.y < leftY + PAD_H && ball.dx < 0) {
      ball.dx = Math.abs(ball.dx) * 1.02;
      ball.dy += (ball.y - (leftY + PAD_H / 2)) * 0.1;
      rallyCount++;
    }
    if (ball.x + BALL_R > W - PAD_W - 16 && ball.y > rightY && ball.y < rightY + PAD_H && ball.dx > 0) {
      ball.dx = -Math.abs(ball.dx) * 1.02;
      ball.dy += (ball.y - (rightY + PAD_H / 2)) * 0.1;
      rallyCount++;
    }

    // scoring
    if (ball.x < 0) { rightScore++; resetBall(); }
    if (ball.x > W) { leftScore++; resetBall(); }

    // cap speed
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    if (speed > 8) { ball.dx *= 8 / speed; ball.dy *= 8 / speed; }
  }

  function render() {
    // dark background
    ctx.fillStyle = "#0a0e1a"; ctx.fillRect(0, 0, W, H);
    // center line
    ctx.setLineDash([6, 8]); ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
    // left label
    ctx.fillStyle = "rgba(26,58,107,0.5)"; ctx.font = "bold 48px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("LEFT", W * 0.25, H / 2 + 16);
    ctx.fillStyle = "rgba(196,30,58,0.5)";
    ctx.fillText("RIGHT", W * 0.75, H / 2 + 16);
    // paddles
    ctx.fillStyle = "#1a3a6b";
    ctx.beginPath(); ctx.roundRect(16, leftY, PAD_W, PAD_H, 4); ctx.fill();
    ctx.fillStyle = "#c41e3a";
    ctx.beginPath(); ctx.roundRect(W - 16 - PAD_W, rightY, PAD_W, PAD_H, 4); ctx.fill();
    // ball
    ctx.fillStyle = "#d4a017";
    ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#14213d"; ctx.font = "bold 7px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("BILL", ball.x, ball.y + 0.5);
    // scores
    ctx.fillStyle = "#fff"; ctx.font = "bold 32px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText(leftScore, W * 0.25, 50);
    ctx.fillText(rightScore, W * 0.75, 50);
    // rally counter
    if (rallyCount > 3) {
      ctx.fillStyle = "rgba(212,160,23,0.7)"; ctx.font = "bold 14px 'Outfit', sans-serif";
      ctx.fillText("RALLY: " + rallyCount, W / 2, 30);
    }
    if (rallyCount > 10) {
      ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.fillText("FILIBUSTER IN PROGRESS", W / 2, 50);
    }
    // ready overlay
    if (gameState === "ready") {
      ctx.fillStyle = "rgba(10,14,26,0.6)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#d4a017"; ctx.font = "bold 24px 'Outfit', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("THE LOBBY", W / 2, H / 2 - 24);
      ctx.fillStyle = "#fff"; ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.fillText("THE BILL BOUNCES BETWEEN PARTIES", W / 2, H / 2);
      ctx.fillText("MOUSE/TOUCH TO PLAY LEFT · CLICK TO START", W / 2, H / 2 + 20);
    }
  }

  let rafId = null;
  function gameLoop() {
    if (gameState === "playing") update();
    render();
    rafId = requestAnimationFrame(gameLoop);
  }

  function start() { init(); if (!rafId) rafId = requestAnimationFrame(gameLoop); }

  startBtn.addEventListener("click", () => {
    if (gameState === "ready") gameState = "playing";
    else { init(); gameState = "playing"; }
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    playerY = (e.clientY - rect.top) * (H / rect.height);
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    playerY = (e.touches[0].clientY - rect.top) * (H / rect.height);
  }, { passive: false });

  canvas.addEventListener("click", () => {
    if (gameState === "ready") gameState = "playing";
  });

  canvas.addEventListener("mouseleave", () => { playerY = null; });

  start();
})();
