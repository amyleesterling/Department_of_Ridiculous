const missions = [
  {
    title: "Escort the ceremonial fog machine to parliament.",
    text: "Your responsibilities include announcing everyone's dramatic entrance and protecting the glitter budget from practical people.",
    urgency: "Urgency: Sparkly",
    agency: "Issued by: Bureau of Loud Carpets",
  },
  {
    title: "Reassure the public after the canal-blocking cargo ship of destiny has struck again.",
    text: "Bring a pointer, a crisis blazer, and several slides explaining why global logistics now depend on one stubborn boat and a very apologetic seagull.",
    urgency: "Urgency: Containerized",
    agency: "Issued by: Ministry of Sideways Shipping",
  },
  {
    title: "Audit the emergency meme-stock morale desk before the opening bell.",
    text: "If enthusiasm exceeds fundamentals by more than three jazz hands, halt trading, mist the room with lavender, and ask everyone to stop calling themselves visionaries.",
    urgency: "Urgency: Gamma-ish",
    agency: "Issued by: Office of Retail Sentiment",
  },
  {
    title: "Prepare a statement for the balloon incident while keeping the disco pigeon off camera.",
    text: "Feathers should shimmer, spokespeople should stay hydrated, and nobody should mention that the briefing notes were written on the back of a brunch menu.",
    urgency: "Urgency: Airspace-adjacent",
    agency: "Issued by: Embassy of Immaculate Swagger",
  },
];

const hotlineScripts = [
  "\"Thank you for calling. If your staircase is becoming emotionally distant, please stay on the line.\"",
  "\"For unexpected jazz hands in your neighborhood, press 4 and face east with confidence.\"",
  "\"If your soup has begun offering financial advice during a regional banking wobble, do not interrupt. Document everything.\"",
  "\"All agents are currently assisting other emergencies involving sequins, fog, avoidable fanfare, and one incredibly compromised supply chain.\"",
];

const warnings = [
  "Please remain calm if your inbox begins humming show tunes.",
  "A parade may form around you with very little notice. Hydrate accordingly.",
  "Citizens are advised not to challenge the decorative curtains to a duel during periods of elevated meme-stock enthusiasm.",
  "Do not feed strategic glitter to any unlicensed motivational speakers, crisis podcasters, or canal traffic analysts.",
  "If a single vessel blocks global commerce again, please clap supportively and reroute with dignity.",
];

const tickerItems = [
  "BREAKING: A tactical pastry has entered the decision-making process.",
  "NOTICE: The escalator now believes in destiny.",
  "ALERT: Eight suspiciously glamorous geese have formed a committee.",
  "URGENT: The ceremonial saxophone refuses to be rushed during the latest inflation panic.",
  "LIVE: Someone has replaced the minutes with interpretive dance notes and a risk disclosure.",
  "UPDATE: National morale up 6% after introduction of victory capes and post-canal contingency planning.",
  "FLASH: Balloon-watch desk requests calmer fonts and fewer lasers.",
];

const vibes = [
  "Velvet panic",
  "Executive confetti",
  "Deluxe nonsense",
  "Feral cabaret",
  "Administrative glitterstorm",
];

const risks = [
  "Low-float nonsense",
  "Leveraged pageantry",
  "Volatility with jazz hands",
  "Mark-to-manic",
  "Systemically fabulous",
];

const stickers = ["🦝", "🪩", "🦆", "🎺", "✨", "🕺", "💥", "🌈", "🍌", "🎈"];

const MAX_CHAOS_STAGE = 9;
const WORD_CHAOS_STAGE = 4;
const LETTER_CHAOS_STAGE = 7;
const GOVERNMENT_STAGE = 9;
const EMERGENCY_STORAGE_KEY = "department_of_ridiculous_emergencies";
const API_BASE = (document.querySelector('meta[name="ridiculous-api-base"]')?.content || "").trim().replace(/\/$/, "");

let chaos = 73;
let chaosStage = 0;
let trumpetCount = 14;
let gooseCount = 5;
let capeCount = 29;
let citizenEmergencies = [];
let discoTimeoutId = null;

const missionTitle = document.getElementById("missionTitle");
const missionText = document.getElementById("missionText");
const missionUrgency = document.getElementById("missionUrgency");
const missionAgency = document.getElementById("missionAgency");
const hotlineText = document.getElementById("hotlineText");
const warningText = document.getElementById("warningText");
const chaosValue = document.getElementById("chaosValue");
const chaosBar = document.getElementById("chaosBar");
const riskLabel = document.getElementById("riskLabel");
const vibeLabel = document.getElementById("vibeLabel");
const trumpetCountEl = document.getElementById("trumpetCount");
const gooseCountEl = document.getElementById("gooseCount");
const capeCountEl = document.getElementById("capeCount");
const tickerTrack = document.getElementById("tickerTrack");
const stickerField = document.getElementById("stickerField");
const raccoonField = document.getElementById("raccoonField");
const bureaucratField = document.getElementById("bureaucratField");
const stampField = document.getElementById("stampField");
const chaosBtn = document.getElementById("chaosBtn");
const undoBtn = document.getElementById("undoBtn");
const stampBtn = document.getElementById("stampBtn");
const missionBtn = document.getElementById("missionBtn");
const ledgerBtn = document.getElementById("ledgerBtn");
const composerShell = document.getElementById("composerShell");
const composerBackdrop = document.getElementById("composerBackdrop");
const composerClose = document.getElementById("composerClose");
const composerCancel = document.getElementById("composerCancel");
const emergencyForm = document.getElementById("emergencyForm");
const emergencyTitleInput = document.getElementById("emergencyTitleInput");
const emergencyTextInput = document.getElementById("emergencyTextInput");
const emergencyList = document.getElementById("emergencyList");
const emergencyEmpty = document.getElementById("emergencyEmpty");
const discoShell = document.getElementById("discoShell");

const chaosTextTargets = Array.from(document.querySelectorAll("[data-chaos-text]"));
const chaosBoxTargets = Array.from(document.querySelectorAll("[data-chaos-box]"));

function clamp(min, value, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatEmergencyTimestamp(isoString) {
  return new Date(isoString).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function loadCitizenEmergencies() {
  try {
    const raw = window.localStorage.getItem(EMERGENCY_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry) => entry && typeof entry.title === "string" && typeof entry.details === "string" && typeof entry.createdAt === "string");
  } catch {
    return [];
  }
}

function saveCitizenEmergencies() {
  try {
    window.localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(citizenEmergencies));
  } catch {
    // Best effort only for static hosting environments.
  }
}

async function fetchSharedEmergencies() {
  if (!API_BASE) {
    return null;
  }

  const response = await fetch(`${API_BASE}/api/emergencies`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load emergencies: ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload.emergencies) ? payload.emergencies : [];
}

async function createSharedEmergency(entry) {
  if (!API_BASE) {
    return null;
  }

  const response = await fetch(`${API_BASE}/api/emergencies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: entry.title,
      details: entry.details,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create emergency: ${response.status}`);
  }

  const payload = await response.json();
  return payload.emergency || null;
}

function renderCitizenEmergencies() {
  emergencyList.innerHTML = "";
  emergencyEmpty.hidden = citizenEmergencies.length > 0;

  citizenEmergencies.forEach((entry) => {
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const details = document.createElement("p");
    const timestamp = document.createElement("div");

    card.className = "ledger-card";
    title.textContent = entry.title;
    details.textContent = entry.details;
    timestamp.className = "ledger-meta";
    timestamp.textContent = `Filed ${formatEmergencyTimestamp(entry.createdAt)}`;

    card.appendChild(title);
    card.appendChild(details);
    card.appendChild(timestamp);
    emergencyList.appendChild(card);
  });
}

async function syncEmergenciesFromApi() {
  try {
    const sharedEmergencies = await fetchSharedEmergencies();

    if (!sharedEmergencies) {
      return;
    }

    citizenEmergencies = sharedEmergencies;
    renderCitizenEmergencies();
  } catch {
    // If the tiny backend is unavailable, the site keeps working locally.
  }
}

function openComposer() {
  composerShell.classList.remove("hidden");
  composerShell.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    emergencyTitleInput.focus();
  }, 0);
}

function closeComposer() {
  composerShell.classList.add("hidden");
  composerShell.setAttribute("aria-hidden", "true");
  emergencyForm.reset();
}

async function submitEmergency(event) {
  event.preventDefault();

  const title = normalizeWhitespace(emergencyTitleInput.value);
  const details = normalizeWhitespace(emergencyTextInput.value);

  if (!title || !details) {
    return;
  }

  const nextEntry = {
    id: `${Date.now()}`,
    title,
    details,
    createdAt: new Date().toISOString(),
  };

  if (API_BASE) {
    try {
      const sharedEntry = await createSharedEmergency(nextEntry);
      if (sharedEntry) {
        citizenEmergencies.unshift(sharedEntry);
      }
    } catch {
      citizenEmergencies.unshift(nextEntry);
      saveCitizenEmergencies();
    }
  } else {
    citizenEmergencies.unshift(nextEntry);
    saveCitizenEmergencies();
  }

  citizenEmergencies = citizenEmergencies.slice(0, 18);
  renderCitizenEmergencies();
  setChaosContent(warningText, `New statewide emergency filed: ${title}. Public confusion expected shortly.`);
  applyChaosStage();
  closeComposer();
  spawnStickerBurst(10);
}

function stopDiscoProtocol() {
  document.body.classList.remove("disco-active");
  discoShell.classList.add("hidden");
  discoShell.setAttribute("aria-hidden", "true");

  if (discoTimeoutId) {
    window.clearTimeout(discoTimeoutId);
    discoTimeoutId = null;
  }
}

function startDiscoProtocol() {
  stopDiscoProtocol();
  document.body.classList.add("disco-active");
  discoShell.classList.remove("hidden");
  discoShell.setAttribute("aria-hidden", "false");
  spawnStickerBurst(18);

  discoTimeoutId = window.setTimeout(() => {
    stopDiscoProtocol();
  }, 6000);
}

function setChaosContent(element, text) {
  const normalized = normalizeWhitespace(text);
  element.dataset.sourceText = normalized;
  element.textContent = normalized;
}

function primeChaosTextTargets() {
  chaosTextTargets.forEach((element) => {
    const normalized = normalizeWhitespace(element.textContent);
    element.dataset.sourceText = normalized;
    element.textContent = normalized;
  });
}

function seededFactor(seed, stage, spread, min, max) {
  const raw =
    1
    + Math.sin(seed * 1.37 + stage * 0.91) * spread
    + Math.cos(seed * 0.73 - stage * 0.49) * (spread * 0.65);
  return clamp(min, raw, max);
}

function renderElementChaos(element, sourceText, index) {
  const fragment = document.createElement("span");
  const factor = seededFactor(index + 1, chaosStage, 0.13 + chaosStage * 0.04, 0.62, 1.6);

  fragment.className = "chaos-element-fragment";
  fragment.textContent = sourceText;
  fragment.style.fontSize = `${factor}em`;
  fragment.style.transform = `translateY(${Math.sin(index + chaosStage) * 4}px)`;
  fragment.style.letterSpacing = `${Math.sin(index * 0.6 + chaosStage) * 0.03}em`;

  element.appendChild(fragment);
}

function renderWordChaos(element, sourceText, index) {
  const tokens = sourceText.split(/(\s+)/);

  tokens.forEach((token, tokenIndex) => {
    if (/\s+/.test(token)) {
      element.appendChild(document.createTextNode(token));
      return;
    }

    const fragment = document.createElement("span");
    const factor = seededFactor((index + 1) * 9 + tokenIndex, chaosStage, 0.2 + (chaosStage - 3) * 0.04, 0.45, 1.95);
    const nudge = Math.sin(tokenIndex * 1.4 + chaosStage) * 6;
    const rotation = Math.cos(tokenIndex + chaosStage) * 3;

    fragment.className = "word-fragment";
    fragment.textContent = token;
    fragment.style.fontSize = `${factor}em`;
    fragment.style.transform = `translateY(${nudge}px) rotate(${rotation}deg)`;

    element.appendChild(fragment);
  });
}

function renderLetterChaos(element, sourceText, index) {
  const tokens = sourceText.split(/(\s+)/);

  tokens.forEach((token, tokenIndex) => {
    if (/\s+/.test(token)) {
      element.appendChild(document.createTextNode(token));
      return;
    }

    [...token].forEach((character, charIndex) => {
      const fragment = document.createElement("span");
      const seed = (index + 1) * 17 + tokenIndex * 5 + charIndex;
      const factor = seededFactor(seed, chaosStage, 0.24 + (chaosStage - 6) * 0.06, 0.32, 2.25);
      const nudge = Math.sin(seed + chaosStage) * 8;
      const rotation = Math.cos(seed * 0.4 + chaosStage) * 6;

      fragment.className = "letter-fragment";
      fragment.textContent = character;
      fragment.style.fontSize = `${factor}em`;
      fragment.style.transform = `translateY(${nudge}px) rotate(${rotation}deg)`;

      element.appendChild(fragment);
    });
  });
}

function renderChaosTextTarget(element, index) {
  const sourceText = element.dataset.sourceText || normalizeWhitespace(element.textContent);

  element.textContent = "";

  if (chaosStage === 0 || chaosStage >= GOVERNMENT_STAGE) {
    element.textContent = sourceText;
    return;
  }

  if (chaosStage < WORD_CHAOS_STAGE) {
    renderElementChaos(element, sourceText, index);
    return;
  }

  if (chaosStage < LETTER_CHAOS_STAGE) {
    renderWordChaos(element, sourceText, index);
    return;
  }

  renderLetterChaos(element, sourceText, index);
}

function applyBoxChaos() {
  chaosBoxTargets.forEach((element, index) => {
    if (chaosStage === 0 || chaosStage >= GOVERNMENT_STAGE) {
      element.style.transform = "";
      element.style.opacity = "";
      element.style.filter = "";
      return;
    }

    const activeStage = Math.min(chaosStage, 3);
    const scale = seededFactor(index + 3, activeStage, 0.035 * activeStage, 0.9, 1.16);
    const rotation = Math.sin(index + activeStage * 0.7) * activeStage * 1.5;
    const nudgeX = Math.cos(index * 0.8 + activeStage) * activeStage * 4;
    const nudgeY = Math.sin(index * 0.6 + activeStage) * activeStage * 5;

    element.style.transform = `translate(${nudgeX}px, ${nudgeY}px) rotate(${rotation}deg) scale(${scale})`;
    element.style.opacity = `${1 - Math.min(0.12, chaosStage * 0.01)}`;
    element.style.filter = `saturate(${1 + activeStage * 0.08})`;
  });
}

function applyChaosStage() {
  document.body.classList.toggle("government-mode", chaosStage >= GOVERNMENT_STAGE);
  undoBtn.disabled = chaosStage === 0;
  chaosBtn.textContent = chaosStage >= GOVERNMENT_STAGE
    ? "Further Increase Pending Review"
    : "Increase Chaos";
  undoBtn.textContent = chaosStage >= GOVERNMENT_STAGE
    ? "Undo Bureaucracy"
    : "Undo Chaos";

  chaosTextTargets.forEach((element, index) => {
    renderChaosTextTarget(element, index);
  });

  applyBoxChaos();
}

function updateMission() {
  const mission = pickRandom(missions);

  setChaosContent(missionTitle, mission.title);
  setChaosContent(missionText, mission.text);
  setChaosContent(missionUrgency, mission.urgency);
  setChaosContent(missionAgency, mission.agency);
  setChaosContent(hotlineText, pickRandom(hotlineScripts));
  setChaosContent(warningText, pickRandom(warnings));
}

function updateChaosUI() {
  chaosValue.textContent = `${chaos}%`;
  chaosBar.style.width = `${chaos}%`;

  if (chaosStage >= GOVERNMENT_STAGE) {
    setChaosContent(riskLabel, "Treasury-grade beige");
    setChaosContent(vibeLabel, "Form 14-B calm");
  } else {
    setChaosContent(riskLabel, risks[Math.min(risks.length - 1, Math.floor(chaos / 20))]);
    setChaosContent(vibeLabel, pickRandom(vibes));
  }

  const tilt = `${(chaos - 50) / 18}deg`;
  const scale = Math.min(1.14, 1 + chaos / 500);
  document.documentElement.style.setProperty("--chaos-tilt", tilt);
  document.documentElement.style.setProperty("--chaos-scale", String(scale));
  document.documentElement.style.setProperty("--ticker-duration", `${Math.max(12, 36 - chaos / 3)}s`);
}

function animateMetric(element, nextValue) {
  element.textContent = String(nextValue);
}

function inflateMetrics(multiplier = 1) {
  trumpetCount += 1 * multiplier;
  gooseCount += Math.max(1, Math.round(Math.random() * multiplier));
  capeCount += 2 * multiplier;

  animateMetric(trumpetCountEl, trumpetCount);
  animateMetric(gooseCountEl, gooseCount);
  animateMetric(capeCountEl, capeCount);
}

function deflateMetrics(multiplier = 1) {
  trumpetCount = Math.max(8, trumpetCount - multiplier);
  gooseCount = Math.max(2, gooseCount - Math.max(1, Math.round(Math.random() * multiplier)));
  capeCount = Math.max(15, capeCount - 2 * multiplier);

  animateMetric(trumpetCountEl, trumpetCount);
  animateMetric(gooseCountEl, gooseCount);
  animateMetric(capeCountEl, capeCount);
}

function spawnStickerBurst(amount = 10) {
  for (let index = 0; index < amount; index += 1) {
    const sticker = document.createElement("div");

    sticker.className = "sticker";
    sticker.textContent = pickRandom(stickers);
    sticker.style.left = `${Math.random() * 100}%`;
    sticker.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 30}vw`);
    sticker.style.setProperty("--spin", `${(Math.random() - 0.5) * 260}deg`);
    sticker.style.animationDelay = `${Math.random() * 0.25}s`;
    stickerField.appendChild(sticker);

    window.setTimeout(() => {
      sticker.remove();
    }, 3900);
  }
}

function releaseRaccoons(amount = 7) {
  const raccoonTitles = [
    "snack inspector",
    "trash marshal",
    "velvet bandit",
    "night mayor",
    "glitter deputy",
    "committee chair",
  ];

  for (let index = 0; index < amount; index += 1) {
    const raccoon = document.createElement("div");
    const face = document.createElement("span");
    const tag = document.createElement("span");

    raccoon.className = "raccoon";
    raccoon.style.setProperty("--lane", `${6 + Math.random() * 72}vh`);
    raccoon.style.setProperty("--run-duration", `${4.5 + Math.random() * 2.5}s`);
    raccoon.style.setProperty("--raccoon-scale", `${0.88 + Math.random() * 0.42}`);
    raccoon.style.animationDelay = `${index * 0.16}s`;

    face.className = "raccoon-face";
    face.textContent = "🦝";

    tag.className = "raccoon-tag";
    tag.textContent = pickRandom(raccoonTitles);

    raccoon.appendChild(face);
    raccoon.appendChild(tag);
    raccoonField.appendChild(raccoon);

    window.setTimeout(() => {
      raccoon.remove();
    }, 7600);
  }
}

function feedTheBureaucrat() {
  const coin = document.createElement("div");
  const chipLabels = [
    "cafeteria chip",
    "compliance chip",
    "queue token",
    "approval wafer",
    "delay chip",
    "form snack",
  ];

  coin.className = "bureaucrat-coin";
  coin.textContent = "$";
  bureaucratField.appendChild(coin);

  window.setTimeout(() => {
    coin.remove();
  }, 1000);

  window.setTimeout(() => {
    for (let index = 0; index < 18; index += 1) {
      const chip = document.createElement("div");

      chip.className = "bureaucrat-chip";
      chip.textContent = pickRandom(chipLabels);
      chip.style.setProperty("--lane", `${8 + Math.random() * 72}vh`);
      chip.style.setProperty("--chip-duration", `${3.6 + Math.random() * 1.8}s`);
      chip.style.animationDelay = `${index * 0.08}s`;
      bureaucratField.appendChild(chip);

      window.setTimeout(() => {
        chip.remove();
      }, 5200);
    }
  }, 430);
}

function launchCeremonialStamp() {
  const labels = [
    "Approved For Overreaction",
    "Filed Under Vibes",
    "Absurdly Urgent",
    "Ceremonial Use Only",
    "Panic Endorsed",
    "Administrative Glitter",
  ];
  const stamp = document.createElement("div");

  stamp.className = "chaos-stamp";
  stamp.textContent = pickRandom(labels);
  stamp.style.left = `${18 + Math.random() * 64}%`;
  stamp.style.top = `${18 + Math.random() * 58}%`;
  stamp.style.setProperty("--stamp-tilt", `${-18 + Math.random() * 36}deg`);
  stampField.appendChild(stamp);

  window.setTimeout(() => {
    stamp.remove();
  }, 1900);
}

function remixTicker() {
  const items = [...tickerItems, ...warnings, ...hotlineScripts];
  const chosen = Array.from({ length: 8 }, () => pickRandom(items));

  tickerTrack.innerHTML = "";

  chosen.concat(chosen).forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.replaceAll("\"", "");
    tickerTrack.appendChild(span);
  });
}

function increaseChaos() {
  chaosStage = Math.min(MAX_CHAOS_STAGE, chaosStage + 1);
  chaos = Math.min(100, chaos + 7);

  if (chaosStage >= GOVERNMENT_STAGE) {
    setChaosContent(warningText, "Visual enrichment has exceeded acceptable thresholds. This page has been remediated into a compliant information resource.");
  }

  updateChaosUI();
  applyChaosStage();
  inflateMetrics(2);
  spawnStickerBurst(8);
}

function undoChaos() {
  if (chaosStage === 0) {
    return;
  }

  chaosStage = Math.max(0, chaosStage - 1);
  chaos = Math.max(45, chaos - 7);

  if (chaosStage < GOVERNMENT_STAGE) {
    setChaosContent(warningText, pickRandom(warnings));
  }

  updateChaosUI();
  applyChaosStage();
  deflateMetrics(1);
}

document.getElementById("missionBtn").addEventListener("click", () => {
  openComposer();
});

document.getElementById("discoBtn").addEventListener("click", startDiscoProtocol);

chaosBtn.addEventListener("click", increaseChaos);
undoBtn.addEventListener("click", undoChaos);

document.getElementById("raccoonBtn").addEventListener("click", () => {
  gooseCount += 3;
  inflateMetrics(1);
  setChaosContent(warningText, "Raccoons released successfully. Nobody is in charge anymore.");
  applyChaosStage();
  releaseRaccoons(14);
});

document.getElementById("bureaucratBtn").addEventListener("click", () => {
  setChaosContent(warningText, "Coin accepted. Bureaucrat fed. Chips are now moving through the system.");
  applyChaosStage();
  feedTheBureaucrat();
});

stampBtn.addEventListener("click", launchCeremonialStamp);

document.getElementById("shuffleBtn").addEventListener("click", () => {
  chaos = 48 + Math.floor(Math.random() * 53);
  chaosStage = clamp(0, Math.floor((chaos - 48) / 6), MAX_CHAOS_STAGE);
  updateMission();
  remixTicker();
  updateChaosUI();
  applyChaosStage();
  inflateMetrics(3);
  spawnStickerBurst(12);
});

ledgerBtn.addEventListener("click", openComposer);
composerClose.addEventListener("click", closeComposer);
composerCancel.addEventListener("click", closeComposer);
composerBackdrop.addEventListener("click", closeComposer);
emergencyForm.addEventListener("submit", submitEmergency);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !composerShell.classList.contains("hidden")) {
    closeComposer();
  }
});

primeChaosTextTargets();
citizenEmergencies = loadCitizenEmergencies();
renderCitizenEmergencies();
syncEmergenciesFromApi();
updateMission();
updateChaosUI();
remixTicker();
applyChaosStage();
