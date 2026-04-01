const missions = [
  { title: "Escort the ceremonial fog machine to parliament.", text: "Your responsibilities include announcing everyone's dramatic entrance and protecting the glitter budget from practical people.", urgency: "Urgency: Sparkly", agency: "Issued by: Bureau of Loud Carpets" },
  { title: "Reassure the public after the canal-blocking cargo ship of destiny has struck again.", text: "Bring a pointer, a crisis blazer, and several slides explaining why global logistics now depend on one stubborn boat and a very apologetic seagull.", urgency: "Urgency: Containerized", agency: "Issued by: Ministry of Sideways Shipping" },
  { title: "Audit the emergency meme-stock morale desk before the opening bell.", text: "If enthusiasm exceeds fundamentals by more than three jazz hands, halt trading, mist the room with lavender, and ask everyone to stop calling themselves visionaries.", urgency: "Urgency: Gamma-ish", agency: "Issued by: Office of Retail Sentiment" },
  { title: "Prepare a statement for the balloon incident while keeping the disco pigeon off camera.", text: "Feathers should shimmer, spokespeople should stay hydrated, and nobody should mention that the briefing notes were written on the back of a brunch menu.", urgency: "Urgency: Airspace-adjacent", agency: "Issued by: Embassy of Immaculate Swagger" },
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
const vibes = ["Velvet panic", "Executive confetti", "Deluxe nonsense", "Feral cabaret", "Administrative glitterstorm"];
const risks = ["Low-float nonsense", "Leveraged pageantry", "Volatility with jazz hands", "Mark-to-manic", "Systemically fabulous"];
const stickers = ["ALAS", "HARK", "GASP", "LUTE", "WOW", "FATE", "ORB", "DRAMA", "VOID", "BANNED"];
const MAX_CHAOS_STAGE = 9;
const WORD_CHAOS_STAGE = 4;
const LETTER_CHAOS_STAGE = 7;
const GOVERNMENT_STAGE = 9;
const EMERGENCY_BANG_STORAGE_KEY = "department_of_ridiculous_bang_history";
const EMERGENCY_SOURCE_TOKEN_KEY = "department_of_ridiculous_source_token";
const API_BASE = (document.querySelector('meta[name="ridiculous-api-base"]')?.content || "").trim().replace(/\/$/, "");
const USE_APPS_SCRIPT_BRIDGE = /script\.google/i.test(API_BASE);

let chaos = 73;
let chaosStage = 0;
let trumpetCount = 14;
let gooseCount = 5;
let capeCount = 29;
let citizenEmergencies = [];
let bangHistory = {};
let discoTimeoutId = null;
let sourceToken = "";
let emergencySyncIntervalId = null;

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
const shareX = document.getElementById("shareX");
const shareFacebook = document.getElementById("shareFacebook");
const shareEmail = document.getElementById("shareEmail");
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
const emergencyNameInput = document.getElementById("emergencyNameInput");
const emergencyTitleInput = document.getElementById("emergencyTitleInput");
const emergencyTextInput = document.getElementById("emergencyTextInput");
const emergencyList = document.getElementById("emergencyList");
const emergencyEmpty = document.getElementById("emergencyEmpty");
const discoShell = document.getElementById("discoShell");
const chaosTextTargets = Array.from(document.querySelectorAll("[data-chaos-text]"));
const chaosBoxTargets = Array.from(document.querySelectorAll("[data-chaos-box]"));

const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
const normalizeWhitespace = (text) => String(text || "").replace(/\s+/g, " ").trim();
const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];
const formatEmergencyTimestamp = (isoString) => new Date(isoString).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
const saveBangHistory = () => { try { window.localStorage.setItem(EMERGENCY_BANG_STORAGE_KEY, JSON.stringify(bangHistory)); } catch {} };
const saveSourceToken = (value) => { try { window.localStorage.setItem(EMERGENCY_SOURCE_TOKEN_KEY, value); } catch {} };
const sanitizeEmergencyEntry = (entry) => {
  if (!entry || typeof entry !== "object") return null;
  const name = normalizeWhitespace(entry.name || entry.reporter || entry.reporterName || "Anonymous Citizen");
  const title = normalizeWhitespace(entry.title);
  const details = normalizeWhitespace(entry.details);
  const createdAt = normalizeWhitespace(entry.createdAt);
  const id = normalizeWhitespace(entry.id || `${Date.now()}-${title}`);
  const bangs = Math.max(0, Number.parseInt(String(entry.bangs ?? 0), 10) || 0);
  return id && title && details && createdAt ? { id, name, title, details, createdAt, bangs, seeded: Boolean(entry.seeded) } : null;
};
const sortEmergencies = (entries) => [...entries].sort((a, b) => (b.bangs - a.bangs) || (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
const mergeEmergencyLists = (...lists) => sortEmergencies(Array.from(lists.flat().reduce((map, entry) => {
  const normalized = sanitizeEmergencyEntry(entry);
  if (!normalized) return map;
  const existing = map.get(normalized.id);
  map.set(normalized.id, existing ? { ...existing, ...normalized, bangs: Math.max(existing.bangs, normalized.bangs), seeded: existing.seeded || normalized.seeded } : normalized);
  return map;
}, new Map()).values()));
const updateEmergencyEntry = (entry) => { citizenEmergencies = mergeEmergencyLists(citizenEmergencies, [entry]); };
const getEmergencyShareUrl = (id) => `${window.location.href.split("#")[0]}#emergency-${id}`;
const getPageShareUrl = () => window.location.href.split("#")[0];
const findEmergencyById = (id) => citizenEmergencies.find((entry) => entry.id === id) || null;

function loadBangHistory() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(EMERGENCY_BANG_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function createSourceToken() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `ridiculous-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getOrCreateSourceToken() {
  try {
    const existing = normalizeWhitespace(window.localStorage.getItem(EMERGENCY_SOURCE_TOKEN_KEY) || "");
    if (existing) return existing;
  } catch {}
  const created = createSourceToken();
  saveSourceToken(created);
  return created;
}

async function requestApi(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  const logicalStatus = Number.parseInt(String(payload.status || response.status || 500), 10) || 500;
  const logicalError = payload && typeof payload === "object" && payload.ok === false;

  if (!response.ok || logicalError) {
    const error = new Error(payload.error || `Request failed: ${logicalStatus}`);
    error.status = logicalStatus;
    error.emergency = payload.emergency || null;
    throw error;
  }

  return payload;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function buildAppsScriptUrl(params = {}) {
  const url = new URL(API_BASE);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function fetchAppsScriptJsonp(params = {}) {
  return new Promise((resolve, reject) => {
    const callbackName = `ridiculousJsonp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const script = document.createElement("script");
    const cleanup = () => {
      delete window[callbackName];
      script.remove();
    };

    window[callbackName] = (payload) => {
      cleanup();
      resolve(payload || {});
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Failed to load shared emergencies."));
    };

    script.src = buildAppsScriptUrl({ ...params, callback: callbackName });
    document.body.appendChild(script);
  });
}

function postAppsScriptForm(params = {}) {
  return new Promise((resolve) => {
    const iframeName = `ridiculousPost_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const iframe = document.createElement("iframe");
    const form = document.createElement("form");

    iframe.name = iframeName;
    iframe.hidden = true;
    form.method = "POST";
    form.action = buildAppsScriptUrl();
    form.target = iframeName;
    form.hidden = true;

    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(iframe);
    document.body.appendChild(form);

    const cleanup = () => {
      form.remove();
      iframe.remove();
    };

    iframe.addEventListener("load", () => {
      window.setTimeout(() => {
        cleanup();
        resolve();
      }, 100);
    }, { once: true });

    form.submit();
  });
}

function findLatestMatchingEmergency(entries, match) {
  return sortEmergencies(entries).find((entry) => (
    entry.name === match.name
    && entry.title === match.title
    && entry.details === match.details
  )) || null;
}

async function fetchSharedEmergencies() {
  if (!API_BASE) return null;
  if (USE_APPS_SCRIPT_BRIDGE) {
    const payload = await fetchAppsScriptJsonp({ action: "list", limit: 50 });
    if (payload && payload.ok === false) {
      const error = new Error(payload.error || "Failed to load emergencies.");
      error.status = payload.status || 500;
      throw error;
    }
    return Array.isArray(payload.emergencies) ? payload.emergencies : [];
  }
  const payload = await requestApi("/api/emergencies", { headers: { Accept: "application/json" } });
  return Array.isArray(payload.emergencies) ? payload.emergencies : [];
}

async function createSharedEmergency(entry) {
  if (!API_BASE) return null;
  if (USE_APPS_SCRIPT_BRIDGE) {
    const payload = await fetchAppsScriptJsonp({
      action: "create",
      name: entry.name,
      title: entry.title,
      details: entry.details,
      sourceToken,
    });
    if (payload && payload.ok === false) {
      const error = new Error(payload.error || "Failed to create emergency.");
      error.status = payload.status || 500;
      throw error;
    }
    if (payload && payload.emergency) return payload.emergency;
    await wait(600);
    const emergencies = await fetchSharedEmergencies();
    return findLatestMatchingEmergency(emergencies || [], entry);
  }
  const payload = await requestApi("/api/emergencies", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ name: entry.name, title: entry.title, details: entry.details, sourceToken }),
  });
  return payload.emergency || null;
}

async function bangSharedEmergency(id) {
  if (USE_APPS_SCRIPT_BRIDGE) {
    const payload = await fetchAppsScriptJsonp({
      action: "bang",
      id,
      sourceToken,
    });
    if (payload && payload.ok === false) {
      const error = new Error(payload.error || "Failed to register reaction.");
      error.status = payload.status || 500;
      if (payload.emergency) error.emergency = payload.emergency;
      throw error;
    }
    if (payload && payload.emergency) return payload.emergency;
    await wait(500);
    const emergencies = await fetchSharedEmergencies();
    return (emergencies || []).find((entry) => entry.id === id) || null;
  }
  const payload = await requestApi(`/api/emergencies/${encodeURIComponent(id)}/bang`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ sourceToken }),
  });
  return payload.emergency || null;
}

function setChaosContent(element, text) {
  const normalized = normalizeWhitespace(text);
  element.dataset.sourceText = normalized;
  element.textContent = normalized;
}

function syncSiteShareLinks() {
  const pageUrl = getPageShareUrl();
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent("The Department of Civic Engagement");
  if (shareX) shareX.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  if (shareFacebook) shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  if (shareEmail) shareEmail.href = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`Take a look at this: ${pageUrl}`)}`;
}

function primeChaosTextTargets() {
  chaosTextTargets.forEach((element) => setChaosContent(element, element.textContent));
}

function renderCitizenEmergencies() {
  emergencyList.innerHTML = "";
  const sortedEmergencies = sortEmergencies(citizenEmergencies).slice(0, 24);
  emergencyEmpty.hidden = sortedEmergencies.length > 0;
  sortedEmergencies.forEach((entry) => {
    const card = document.createElement("article");
    card.className = `ledger-card${entry.seeded ? " is-seeded" : ""}`;
    card.id = `emergency-${entry.id}`;
    const reacted = bangHistory[entry.id];
    card.innerHTML = `
      <div class="ledger-topline">
        <div class="ledger-meta">Filed by ${entry.name} on ${formatEmergencyTimestamp(entry.createdAt)}</div>
      </div>
      <h3></h3>
      <div class="ledger-reporter"></div>
      <p></p>
      <div class="ledger-reactions">
        <button type="button" class="reaction-btn ${reacted ? "reacted" : ""}" data-action="bang" data-emergency-id="${entry.id}" ${reacted ? "disabled" : ""}>
          <span class="reaction-emoji">&#x26A0;&#xFE0F;</span>
          <span class="reaction-count">${entry.bangs || ""}</span>
        </button>
        <button type="button" class="mini-button share-button" data-action="share" data-emergency-id="${entry.id}">Share</button>
      </div>
    `;
    card.querySelector("h3").textContent = entry.title;
    card.querySelector(".ledger-reporter").textContent = `Declared by ${entry.name}`;
    card.querySelector("p").textContent = entry.details;
    emergencyList.appendChild(card);
  });
  highlightEmergencyFromHash(false);
}

async function syncEmergenciesFromApi() {
  if (!API_BASE) {
    citizenEmergencies = [];
    renderCitizenEmergencies();
    return;
  }
  try {
    const sharedEmergencies = await fetchSharedEmergencies();
    citizenEmergencies = mergeEmergencyLists(sharedEmergencies || []);
    renderCitizenEmergencies();
  } catch {
    setChaosContent(warningText, "Shared emergency ledger is temporarily unavailable.");
    applyChaosStage();
  }
}

function startEmergencySyncLoop() {
  if (!API_BASE || emergencySyncIntervalId) return;
  emergencySyncIntervalId = window.setInterval(() => {
    syncEmergenciesFromApi();
  }, 10000);
}

function openComposer() {
  composerShell.classList.remove("hidden");
  composerShell.setAttribute("aria-hidden", "false");
  window.setTimeout(() => emergencyTitleInput.focus(), 0);
}

function closeComposer() {
  composerShell.classList.add("hidden");
  composerShell.setAttribute("aria-hidden", "true");
  emergencyForm.reset();
}

async function submitEmergency(event) {
  event.preventDefault();
  const submitBtn = emergencyForm.querySelector('button[type="submit"]');
  if (submitBtn.disabled) return;
  const name = normalizeWhitespace(emergencyNameInput.value);
  const title = normalizeWhitespace(emergencyTitleInput.value);
  const details = normalizeWhitespace(emergencyTextInput.value);
  if (!name || !title || !details) return;
  if (!API_BASE) {
    setChaosContent(warningText, "Shared emergency API not configured yet.");
    applyChaosStage();
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = "Filing...";
  try {
    const sharedEntry = await createSharedEmergency({ name, title, details });
    if (sharedEntry) updateEmergencyEntry(sharedEntry);
  } catch (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Declare Emergency";
    setChaosContent(warningText, error.message || "Failed to file shared emergency.");
    applyChaosStage();
    return;
  }
  submitBtn.disabled = false;
  submitBtn.textContent = "Declare Emergency";
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
  if (discoTimeoutId) window.clearTimeout(discoTimeoutId);
  discoTimeoutId = null;
}

function startDiscoProtocol() {
  stopDiscoProtocol();
  document.body.classList.add("disco-active");
  discoShell.classList.remove("hidden");
  discoShell.setAttribute("aria-hidden", "false");
  spawnStickerBurst(18);
  discoTimeoutId = window.setTimeout(stopDiscoProtocol, 6000);
}

function seededFactor(seed, stage, spread, min, max) {
  const raw = 1 + Math.sin(seed * 1.37 + stage * 0.91) * spread + Math.cos(seed * 0.73 - stage * 0.49) * (spread * 0.65);
  return clamp(min, raw, max);
}

function renderElementChaos(element, sourceText, index) {
  const fragment = document.createElement("span");
  fragment.className = "chaos-element-fragment";
  fragment.textContent = sourceText;
  fragment.style.fontSize = `${seededFactor(index + 1, chaosStage, 0.13 + chaosStage * 0.04, 0.62, 1.6)}em`;
  fragment.style.transform = `translateY(${Math.sin(index + chaosStage) * 4}px)`;
  fragment.style.letterSpacing = `${Math.sin(index * 0.6 + chaosStage) * 0.03}em`;
  element.appendChild(fragment);
}

function renderWordChaos(element, sourceText, index) {
  sourceText.split(/(\s+)/).forEach((token, tokenIndex) => {
    if (/\s+/.test(token)) return element.appendChild(document.createTextNode(token));
    const fragment = document.createElement("span");
    fragment.className = "word-fragment";
    fragment.textContent = token;
    fragment.style.fontSize = `${seededFactor((index + 1) * 9 + tokenIndex, chaosStage, 0.2 + (chaosStage - 3) * 0.04, 0.45, 1.95)}em`;
    fragment.style.transform = `translateY(${Math.sin(tokenIndex * 1.4 + chaosStage) * 6}px) rotate(${Math.cos(tokenIndex + chaosStage) * 3}deg)`;
    element.appendChild(fragment);
  });
}

function renderLetterChaos(element, sourceText, index) {
  sourceText.split(/(\s+)/).forEach((token, tokenIndex) => {
    if (/\s+/.test(token)) return element.appendChild(document.createTextNode(token));
    [...token].forEach((character, charIndex) => {
      const seed = (index + 1) * 17 + tokenIndex * 5 + charIndex;
      const fragment = document.createElement("span");
      fragment.className = "letter-fragment";
      fragment.textContent = character;
      fragment.style.fontSize = `${seededFactor(seed, chaosStage, 0.24 + (chaosStage - 6) * 0.06, 0.32, 2.25)}em`;
      fragment.style.transform = `translateY(${Math.sin(seed + chaosStage) * 8}px) rotate(${Math.cos(seed * 0.4 + chaosStage) * 6}deg)`;
      element.appendChild(fragment);
    });
  });
}

function renderChaosTextTarget(element, index) {
  const sourceText = element.dataset.sourceText || normalizeWhitespace(element.textContent);
  element.textContent = "";
  if (chaosStage === 0 || chaosStage >= GOVERNMENT_STAGE) return void (element.textContent = sourceText);
  if (chaosStage < WORD_CHAOS_STAGE) return renderElementChaos(element, sourceText, index);
  if (chaosStage < LETTER_CHAOS_STAGE) return renderWordChaos(element, sourceText, index);
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
    element.style.transform = `translate(${Math.cos(index * 0.8 + activeStage) * activeStage * 4}px, ${Math.sin(index * 0.6 + activeStage) * activeStage * 5}px) rotate(${Math.sin(index + activeStage * 0.7) * activeStage * 1.5}deg) scale(${seededFactor(index + 3, activeStage, 0.035 * activeStage, 0.9, 1.16)})`;
    element.style.opacity = `${1 - Math.min(0.12, chaosStage * 0.01)}`;
    element.style.filter = `saturate(${1 + activeStage * 0.08})`;
  });
}

function applyChaosStage() {
  document.body.classList.toggle("government-mode", chaosStage >= GOVERNMENT_STAGE);
  undoBtn.disabled = chaosStage === 0;
  chaosBtn.textContent = chaosStage >= GOVERNMENT_STAGE ? "Further Increase Pending Review" : "Increase Chaos";
  undoBtn.textContent = chaosStage >= GOVERNMENT_STAGE ? "Undo Bureaucracy" : "Undo Chaos";
  chaosTextTargets.forEach((element, index) => renderChaosTextTarget(element, index));
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
  setChaosContent(riskLabel, chaosStage >= GOVERNMENT_STAGE ? "Treasury-grade beige" : risks[Math.min(risks.length - 1, Math.floor(chaos / 20))]);
  setChaosContent(vibeLabel, chaosStage >= GOVERNMENT_STAGE ? "Form 14-B calm" : pickRandom(vibes));
  document.documentElement.style.setProperty("--chaos-tilt", `${(chaos - 50) / 18}deg`);
  document.documentElement.style.setProperty("--chaos-scale", String(Math.min(1.14, 1 + chaos / 500)));
  document.documentElement.style.setProperty("--ticker-duration", `${Math.max(12, 36 - chaos / 3)}s`);
}

function animateMetric(element, nextValue) {
  element.textContent = String(nextValue);
}

function inflateMetrics(multiplier = 1) {
  trumpetCount += multiplier;
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
    window.setTimeout(() => sticker.remove(), 3900);
  }
}

function releaseRaccoons(amount = 7) {
  const raccoonTitles = ["snack inspector", "trash marshal", "velvet bandit", "night mayor", "glitter deputy", "committee chair"];
  for (let index = 0; index < amount; index += 1) {
    const raccoon = document.createElement("div");
    raccoon.className = "raccoon";
    raccoon.style.setProperty("--lane", `${6 + Math.random() * 72}vh`);
    raccoon.style.setProperty("--run-duration", `${4.5 + Math.random() * 2.5}s`);
    raccoon.style.setProperty("--raccoon-scale", `${0.88 + Math.random() * 0.42}`);
    raccoon.style.animationDelay = `${index * 0.16}s`;
    raccoon.innerHTML = `<span class="raccoon-face">MASK</span><span class="raccoon-tag">${pickRandom(raccoonTitles)}</span>`;
    raccoonField.appendChild(raccoon);
    window.setTimeout(() => raccoon.remove(), 7600);
  }
}

function feedTheBureaucrat() {
  const coin = document.createElement("div");
  const chipLabels = ["cafeteria chip", "compliance chip", "queue token", "approval wafer", "delay chip", "form snack"];
  coin.className = "bureaucrat-coin";
  coin.textContent = "$";
  bureaucratField.appendChild(coin);
  window.setTimeout(() => coin.remove(), 1000);
  window.setTimeout(() => {
    for (let index = 0; index < 18; index += 1) {
      const chip = document.createElement("div");
      chip.className = "bureaucrat-chip";
      chip.textContent = pickRandom(chipLabels);
      chip.style.setProperty("--lane", `${8 + Math.random() * 72}vh`);
      chip.style.setProperty("--chip-duration", `${3.6 + Math.random() * 1.8}s`);
      chip.style.animationDelay = `${index * 0.08}s`;
      bureaucratField.appendChild(chip);
      window.setTimeout(() => chip.remove(), 5200);
    }
  }, 430);
}

function launchCeremonialStamp() {
  const labels = ["Approved For Overreaction", "Filed Under Vibes", "Absurdly Urgent", "Ceremonial Use Only", "Panic Endorsed", "Administrative Glitter"];
  const stamp = document.createElement("div");
  stamp.className = "chaos-stamp";
  stamp.textContent = pickRandom(labels);
  stamp.style.left = `${18 + Math.random() * 64}%`;
  stamp.style.top = `${18 + Math.random() * 58}%`;
  stamp.style.setProperty("--stamp-tilt", `${-18 + Math.random() * 36}deg`);
  stampField.appendChild(stamp);
  window.setTimeout(() => stamp.remove(), 1900);
}

function remixTicker() {
  const chosen = Array.from({ length: 8 }, () => pickRandom([...tickerItems, ...warnings, ...hotlineScripts]));
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
  if (chaosStage >= GOVERNMENT_STAGE) setChaosContent(warningText, "Visual enrichment has exceeded acceptable thresholds. This page has been remediated into a compliant information resource.");
  updateChaosUI();
  applyChaosStage();
  inflateMetrics(2);
  spawnStickerBurst(8);
}

function undoChaos() {
  if (chaosStage === 0) return;
  chaosStage = Math.max(0, chaosStage - 1);
  chaos = Math.max(45, chaos - 7);
  if (chaosStage < GOVERNMENT_STAGE) setChaosContent(warningText, pickRandom(warnings));
  updateChaosUI();
  applyChaosStage();
  deflateMetrics(1);
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {}
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "true");
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

async function shareEmergency(id) {
  const entry = findEmergencyById(id);
  if (!entry) return;
  const url = getEmergencyShareUrl(entry.id);
  const payload = { title: entry.title, text: `${entry.title} - ${entry.details}`, url };
  if (navigator.share) {
    try {
      await navigator.share(payload);
      setChaosContent(warningText, `Shared emergency: ${entry.title}.`);
      applyChaosStage();
      return;
    } catch {}
  }
  await copyText(url);
  setChaosContent(warningText, `Copied emergency link for ${entry.title}.`);
  applyChaosStage();
}

async function copyEmergencyLink(id) {
  const entry = findEmergencyById(id);
  if (!entry) return;
  await copyText(getEmergencyShareUrl(entry.id));
  setChaosContent(warningText, `Copied emergency link for ${entry.title}.`);
  applyChaosStage();
}

async function bangEmergency(id) {
  const entry = findEmergencyById(id);
  if (!entry) return;
  if (bangHistory[id]) {
    setChaosContent(warningText, `Your ! has already been counted for ${entry.title}.`);
    return applyChaosStage();
  }
  if (!API_BASE) {
    setChaosContent(warningText, "Shared emergency API not configured yet.");
    return applyChaosStage();
  }
  try {
    const updatedEntry = await bangSharedEmergency(id);
    if (updatedEntry) updateEmergencyEntry(updatedEntry);
    bangHistory[id] = true;
    saveBangHistory();
  } catch (error) {
    if (error.status === 409) {
      if (error.emergency) updateEmergencyEntry(error.emergency);
      bangHistory[id] = true;
      saveBangHistory();
      setChaosContent(warningText, `Your ! was already on file for ${entry.title}.`);
      renderCitizenEmergencies();
      return applyChaosStage();
    }
    setChaosContent(warningText, error.message || "Public ! counter temporarily jammed. Please try again shortly.");
    return applyChaosStage();
  }
  renderCitizenEmergencies();
  setChaosContent(warningText, `Public ! registered for ${entry.title}.`);
  applyChaosStage();
  launchCeremonialStamp();
}

function highlightEmergencyFromHash(shouldScroll = true) {
  document.querySelectorAll(".ledger-card.is-focused").forEach((card) => card.classList.remove("is-focused"));
  if (!window.location.hash.startsWith("#emergency-")) return;
  const target = document.getElementById(window.location.hash.slice(1));
  if (!target) return;
  target.classList.add("is-focused");
  if (shouldScroll) target.scrollIntoView({ behavior: "smooth", block: "center" });
}

missionBtn.addEventListener("click", openComposer);
document.getElementById("discoBtn").addEventListener("click", startDiscoProtocol);
chaosBtn.addEventListener("click", increaseChaos);
undoBtn.addEventListener("click", undoChaos);
document.getElementById("raccoonBtn").addEventListener("click", () => { if (typeof window.openFrogger === "function") { window.openFrogger(); } else { gooseCount += 3; inflateMetrics(1); setChaosContent(warningText, "Frogs released. Navigate at your own risk."); applyChaosStage(); releaseRaccoons(14); } });
document.getElementById("bureaucratBtn").addEventListener("click", () => { if (typeof window.openPacman === "function") { window.openPacman(); } else { setChaosContent(warningText, "Coin accepted. Bureaucrat fed. Chips are now moving through the system."); applyChaosStage(); feedTheBureaucrat(); } });
stampBtn.addEventListener("click", launchCeremonialStamp);
document.getElementById("shuffleBtn").addEventListener("click", () => { chaos = 48 + Math.floor(Math.random() * 53); chaosStage = clamp(0, Math.floor((chaos - 48) / 6), MAX_CHAOS_STAGE); updateMission(); remixTicker(); updateChaosUI(); applyChaosStage(); inflateMetrics(3); spawnStickerBurst(12); });
ledgerBtn.addEventListener("click", openComposer);
composerClose.addEventListener("click", closeComposer);
composerCancel.addEventListener("click", closeComposer);
composerBackdrop.addEventListener("click", closeComposer);
emergencyForm.addEventListener("submit", submitEmergency);
emergencyList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, emergencyId } = button.dataset;
  if (action === "bang") return bangEmergency(emergencyId);
  if (action === "share") return shareEmergency(emergencyId);
  if (action === "copy-link") return copyEmergencyLink(emergencyId);
});
window.addEventListener("keydown", (event) => { if (event.key === "Escape" && !composerShell.classList.contains("hidden")) closeComposer(); });
window.addEventListener("hashchange", () => { highlightEmergencyFromHash(true); syncSiteShareLinks(); });

primeChaosTextTargets();
syncSiteShareLinks();
sourceToken = getOrCreateSourceToken();
bangHistory = loadBangHistory();
citizenEmergencies = [];
renderCitizenEmergencies();
syncEmergenciesFromApi();
startEmergencySyncLoop();
updateMission();
updateChaosUI();
remixTicker();
applyChaosStage();

/* ─── Citizen Quiz ─── */
(function initCitizenQuiz() {
  const quizQuestions = [
    {
      text: "A raccoon has entered your office. Do you:",
      options: [
        { text: "File a noise complaint", type: "bureaucrat" },
        { text: "Offer it a promotion", type: "raccoon" },
        { text: "Start a parade", type: "maximalist" },
        { text: "Fill out the form ironically", type: "anarchist" },
      ],
    },
    {
      text: "Your bridge is vibrating at the frequency of light jazz. This is:",
      options: [
        { text: "A structural concern requiring Form 7-B", type: "bureaucrat" },
        { text: "An improvement", type: "raccoon" },
        { text: "Evidence of feelings", type: "maximalist" },
        { text: "Not my department", type: "anarchist" },
      ],
    },
    {
      text: "The disco protocol has been activated. You:",
      options: [
        { text: "Request an environmental impact study", type: "bureaucrat" },
        { text: "Negotiate disco terms with the raccoons", type: "raccoon" },
        { text: "Were already dancing", type: "maximalist" },
        { text: "Comply, but only ironically", type: "anarchist" },
      ],
    },
    {
      text: 'A new emergency has been declared: "Unlicensed Sky Orbs." Your response:',
      options: [
        { text: "Convene a subcommittee", type: "bureaucrat" },
        { text: "Befriend the orb", type: "raccoon" },
        { text: "Throw a gala in its honor", type: "maximalist" },
        { text: "Ignore it and see what happens", type: "anarchist" },
      ],
    },
    {
      text: "The Department requires your reason for existing. You write:",
      options: [
        { text: "\u2018To ensure all forms are filed in triplicate\u2019", type: "bureaucrat" },
        { text: "\u2018The raccoons need me\u2019", type: "raccoon" },
        { text: "\u2018To bring maximum pageantry to minimum situations\u2019", type: "maximalist" },
        { text: "\u2018I was told there would be snacks\u2019", type: "anarchist" },
      ],
    },
  ];

  const archetypes = {
    bureaucrat: {
      emoji: "\uD83C\uDFDB\uFE0F",
      title: "The Bureaucratic Visionary",
      desc: "You see red tape not as an obstacle but as a decorative ribbon. Your filing cabinet has a filing cabinet.",
    },
    raccoon: {
      emoji: "\uD83E\uDD9D",
      title: "The Raccoon Diplomat",
      desc: "Your methods are unorthodox. Your allies are furry. Your conviction is unshakeable.",
    },
    maximalist: {
      emoji: "\uD83C\uDFBA",
      title: "The Ceremonial Maximalist",
      desc: "No event is too small for a brass section. You have never attended a \u201ccasual\u201d anything.",
    },
    anarchist: {
      emoji: "\uD83D\uDCCB",
      title: "The Compliant Anarchist",
      desc: "You\u2019ll fill out the form, but only to prove a point. Your compliance is a form of protest.",
    },
  };

  let currentQuestion = 0;
  const scores = { bureaucrat: 0, raccoon: 0, maximalist: 0, anarchist: 0 };

  const quizBody = document.getElementById("quizBody");
  const quizResult = document.getElementById("quizResult");
  const quizQuestion = document.getElementById("quizQuestion");
  const quizOptions = document.getElementById("quizOptions");
  const quizCurrent = document.getElementById("quizCurrent");
  const quizResultEmoji = document.getElementById("quizResultEmoji");
  const quizResultTitle = document.getElementById("quizResultTitle");
  const quizResultDesc = document.getElementById("quizResultDesc");
  const quizStamp = document.getElementById("quizStamp");
  const quizRetakeBtn = document.getElementById("quizRetakeBtn");

  function renderQuestion() {
    const q = quizQuestions[currentQuestion];
    quizCurrent.textContent = currentQuestion + 1;
    quizQuestion.textContent = q.text;
    quizOptions.innerHTML = "";
    var shuffled = q.options.slice().sort(function () { return Math.random() - 0.5; });
    shuffled.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "quiz-option-btn";
      btn.textContent = opt.text;
      btn.addEventListener("click", function () { selectAnswer(opt.type); });
      quizOptions.appendChild(btn);
    });
  }

  function selectAnswer(type) {
    scores[type]++;
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    var winner = Object.keys(scores).reduce(function (a, b) { return scores[a] >= scores[b] ? a : b; });
    var arch = archetypes[winner];
    quizBody.classList.add("hidden");
    quizResult.classList.remove("hidden");
    quizResultEmoji.textContent = arch.emoji;
    quizResultTitle.textContent = arch.title;
    quizResultDesc.textContent = arch.desc;
    quizStamp.style.animation = "none";
    void quizStamp.offsetHeight;
    quizStamp.style.animation = "";
  }

  function resetQuiz() {
    currentQuestion = 0;
    Object.keys(scores).forEach(function (k) { scores[k] = 0; });
    quizBody.classList.remove("hidden");
    quizResult.classList.add("hidden");
    renderQuestion();
  }

  quizRetakeBtn.addEventListener("click", resetQuiz);
  renderQuestion();
})();
