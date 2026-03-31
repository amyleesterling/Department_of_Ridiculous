const decrees = [
  {
    title: "The moon shall no longer subtweet the republic.",
    text: "Instead, it will speak plainly into the gilded microphone and take questions only from poets and lightly supervised accountants.",
  },
  {
    title: "No emperor may call a mood board foreign policy.",
    text: "Any throne seeking legitimacy must now provide a budget, a balcony speech, and one decent reason for the satin banners.",
  },
  {
    title: "All public shame must arrive better dressed.",
    text: "The age of casual scandal is over. If we are to be humiliated, we will at least be color-coordinated.",
  },
];

const stars = [
  {
    title: "Mars wants better posture from the empire.",
    text: "The constellations report a rising pressure system of vanity, tenderness, and decorative doom.",
  },
  {
    title: "Venus is editing everyone's apology.",
    text: "Affection remains possible, but only after the metaphors are reduced by thirty percent and the candles stop grandstanding.",
  },
  {
    title: "Saturn has entered boundary enforcement.",
    text: "Anyone attempting to confuse charisma with accountability will be rotated politely into the consequences column.",
  },
];

const choruses = [
  {
    title: "Citizens continue singing through it.",
    text: "A choir of worried fabulists has entered from stage left carrying receipts, lilies, and one very expensive lantern.",
  },
  {
    title: "The public has achieved synchronized side-eye.",
    text: "Witnesses report a disciplined harmony of disbelief, concern, and surprisingly elegant outerwear.",
  },
  {
    title: "Someone brought a lute to the hearing.",
    text: "This has not improved the evidence, but it has dramatically upgraded the ambience of accountability.",
  },
];

const pick = (items) => items[Math.floor(Math.random() * items.length)];

function setBlock(prefix, entry) {
  document.getElementById(`${prefix}Title`).textContent = entry.title;
  document.getElementById(`${prefix}Text`).textContent = entry.text;
}

document.getElementById("decreeBtn").addEventListener("click", () => {
  setBlock("decree", pick(decrees));
});

document.getElementById("starsBtn").addEventListener("click", () => {
  setBlock("stars", pick(stars));
});

document.getElementById("chorusBtn").addEventListener("click", () => {
  setBlock("chorus", pick(choruses));
});
