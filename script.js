const missions = [
  {
    title: "Escort the ceremonial fog machine to parliament.",
    text: "Your responsibilities include announcing everyone's dramatic entrance and protecting the glitter budget from practical people.",
    urgency: "Urgency: Sparkly",
    agency: "Issued by: Bureau of Loud Carpets",
  },
  {
    title: "Negotiate a peace treaty between espresso and bedtime.",
    text: "Bring charts, a velvet chair, and one witness willing to describe the moon as a stakeholder.",
    urgency: "Urgency: Caffeinated",
    agency: "Issued by: Ministry of Late Decisions",
  },
  {
    title: "Audit the nation's emergency kazoo reserves.",
    text: "If any ceremonial kazoos are out of tune, file a respectful but flamboyant incident report.",
    urgency: "Urgency: Toot-based",
    agency: "Issued by: Office of Brass Feelings",
  },
  {
    title: "Train the disco pigeon for a state visit.",
    text: "Feathers should shimmer, diplomacy should dazzle, and nobody should ask where the tiny sunglasses came from.",
    urgency: "Urgency: Feather-critical",
    agency: "Issued by: Embassy of Immaculate Swagger",
  },
];

const hotlineScripts = [
  "\"Thank you for calling. If your staircase is becoming emotionally distant, please stay on the line.\"",
  "\"For unexpected jazz hands in your neighborhood, press 4 and face east with confidence.\"",
  "\"If your soup has begun offering financial advice, do not interrupt. Document everything.\"",
  "\"All agents are currently assisting other emergencies involving sequins, fog, and avoidable fanfare.\"",
];

const warnings = [
  "Please remain calm if your inbox begins humming show tunes.",
  "A parade may form around you with very little notice. Hydrate accordingly.",
  "Citizens are advised not to challenge the decorative curtains to a duel.",
  "Do not feed strategic glitter to any unlicensed motivational speakers.",
];

const tickerItems = [
  "BREAKING: A tactical pastry has entered the decision-making process.",
  "NOTICE: The escalator now believes in destiny.",
  "ALERT: Eight suspiciously glamorous geese have formed a committee.",
  "URGENT: The ceremonial saxophone refuses to be rushed.",
  "LIVE: Someone has replaced the minutes with interpretive dance notes.",
  "UPDATE: National morale up 6% after introduction of victory capes.",
];

const vibes = [
  "Velvet panic",
  "Executive confetti",
  "Deluxe nonsense",
  "Feral cabaret",
  "Administrative glitterstorm",
];

const risks = [
  "Mildly theatrical",
  "Vividly unnecessary",
  "Operationally chaotic",
  "Legally flamboyant",
  "Heroically overcommitted",
];

const stickers = ["🦝", "🪩", "🦆", "🎺", "✨", "🕺", "💥", "🌈", "🍌", "🎈"];

let chaos = 73;
let discoEnabled = false;
let trumpetCount = 14;
let gooseCount = 5;
let capeCount = 29;

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

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function updateMission() {
  const mission = pickRandom(missions);
  missionTitle.textContent = mission.title;
  missionText.textContent = mission.text;
  missionUrgency.textContent = mission.urgency;
  missionAgency.textContent = mission.agency;
  hotlineText.textContent = pickRandom(hotlineScripts);
  warningText.textContent = pickRandom(warnings);
}

function updateChaosUI() {
  chaosValue.textContent = `${chaos}%`;
  chaosBar.style.width = `${chaos}%`;
  riskLabel.textContent = risks[Math.min(risks.length - 1, Math.floor(chaos / 20))];
  vibeLabel.textContent = pickRandom(vibes);

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
  chaos = Math.min(100, chaos + 7);
  updateChaosUI();
  inflateMetrics(2);
  spawnStickerBurst(8);
}

document.getElementById("missionBtn").addEventListener("click", () => {
  updateMission();
  spawnStickerBurst(6);
});

document.getElementById("discoBtn").addEventListener("click", () => {
  discoEnabled = !discoEnabled;
  document.body.classList.toggle("disco", discoEnabled);
  spawnStickerBurst(discoEnabled ? 14 : 6);
});

document.getElementById("chaosBtn").addEventListener("click", increaseChaos);

document.getElementById("raccoonBtn").addEventListener("click", () => {
  gooseCount += 3;
  inflateMetrics(1);
  warningText.textContent = "Raccoons released successfully. Nobody is in charge anymore.";
  spawnStickerBurst(16);
});

document.getElementById("shuffleBtn").addEventListener("click", () => {
  chaos = 48 + Math.floor(Math.random() * 53);
  updateMission();
  remixTicker();
  updateChaosUI();
  inflateMetrics(3);
  spawnStickerBurst(12);
});

updateMission();
updateChaosUI();
remixTicker();
