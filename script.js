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
const raccoonField = document.getElementById("raccoonField");

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
  releaseRaccoons(9);
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
