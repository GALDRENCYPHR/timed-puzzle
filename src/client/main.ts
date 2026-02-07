import * as THREE from "three";

type PuzzleHint = {
  emoji: string;
  label: string;
  color: string;
  lockEmoji?: boolean;
};

type Puzzle = {
  word: string;
  hints: PuzzleHint[];
};

let puzzles: Puzzle[] = [];

type EmojiApiItem = {
  name?: string;
  unicode?: string[];
};

const LOCAL_EMOJI_CATALOG: EmojiApiItem[] = [
  { name: "rainbow", unicode: ["🌈"] },
  { name: "umbrella", unicode: ["☔"] },
  { name: "sun", unicode: ["☀️"] },
  { name: "palette", unicode: ["🎨"] },
  { name: "cloud", unicode: ["☁️"] },
  { name: "rain", unicode: ["🌧️"] },
  { name: "snow", unicode: ["🌨️"] },
  { name: "lightning", unicode: ["⚡"] },
  { name: "wind", unicode: ["💨"] },
  { name: "droplet", unicode: ["💧"] },
  { name: "snowman", unicode: ["⛄"] },
  { name: "scarf", unicode: ["🧣"] },
  { name: "carrot", unicode: ["🥕"] },
  { name: "snowflake", unicode: ["❄️"] },
  { name: "monkey", unicode: ["🐒"] },
  { name: "leaves", unicode: ["🌿"] },
  { name: "snake", unicode: ["🐍"] },
  { name: "parrot", unicode: ["🦜"] },
  { name: "fire", unicode: ["🔥"] },
  { name: "camping", unicode: ["⛺"] },
  { name: "night sky", unicode: ["🌌"] },
  { name: "tree", unicode: ["🌲"] },
  { name: "mountain", unicode: ["🏔️"] },
  { name: "beach", unicode: ["🏖️"] },
  { name: "island", unicode: ["🏝️"] },
  { name: "desert", unicode: ["🏜️"] },
  { name: "palm", unicode: ["🌴"] },
  { name: "volcano", unicode: ["🌋"] },
  { name: "city", unicode: ["🏙️"] },
  { name: "bridge", unicode: ["🌉"] },
  { name: "tent", unicode: ["⛺"] },
  { name: "compass", unicode: ["🧭"] },
  { name: "pizza", unicode: ["🍕"] },
  { name: "burger", unicode: ["🍔"] },
  { name: "fries", unicode: ["🍟"] },
  { name: "taco", unicode: ["🌮"] },
  { name: "sushi", unicode: ["🍣"] },
  { name: "ramen", unicode: ["🍜"] },
  { name: "steak", unicode: ["🥩"] },
  { name: "salad", unicode: ["🥗"] },
  { name: "cheese", unicode: ["🧀"] },
  { name: "bread", unicode: ["🍞"] },
  { name: "egg", unicode: ["🥚"] },
  { name: "milk", unicode: ["🥛"] },
  { name: "coffee", unicode: ["☕"] },
  { name: "tea", unicode: ["🍵"] },
  { name: "cake", unicode: ["🍰"] },
  { name: "donut", unicode: ["🍩"] },
  { name: "cookie", unicode: ["🍪"] },
  { name: "candy", unicode: ["🍬"] },
  { name: "chocolate", unicode: ["🍫"] },
  { name: "ice cream", unicode: ["🍨"] },
  { name: "popsicle", unicode: ["🍧"] },
  { name: "honey", unicode: ["🍯"] },
  { name: "soccer", unicode: ["⚽"] },
  { name: "basketball", unicode: ["🏀"] },
  { name: "tennis", unicode: ["🎾"] },
  { name: "baseball", unicode: ["⚾"] },
  { name: "football", unicode: ["🏈"] },
  { name: "golf", unicode: ["⛳"] },
  { name: "boxing", unicode: ["🥊"] },
  { name: "medal", unicode: ["🏅"] },
  { name: "trophy", unicode: ["🏆"] },
  { name: "guitar", unicode: ["🎸"] },
  { name: "drum", unicode: ["🥁"] },
  { name: "piano", unicode: ["🎹"] },
  { name: "microphone", unicode: ["🎤"] },
  { name: "headphones", unicode: ["🎧"] },
  { name: "violin", unicode: ["🎻"] },
  { name: "music", unicode: ["🎵"] },
  { name: "rocket", unicode: ["🚀"] },
  { name: "airplane", unicode: ["✈️"] },
  { name: "train", unicode: ["🚆"] },
  { name: "car", unicode: ["🚗"] },
  { name: "bicycle", unicode: ["🚲"] },
  { name: "bus", unicode: ["🚌"] },
  { name: "ship", unicode: ["🚢"] },
  { name: "subway", unicode: ["🚇"] },
  { name: "motorcycle", unicode: ["🏍️"] },
  { name: "fuel", unicode: ["⛽"] },
  { name: "house", unicode: ["🏠"] },
  { name: "castle", unicode: ["🏰"] },
  { name: "school", unicode: ["🏫"] },
  { name: "book", unicode: ["📘"] },
  { name: "pencil", unicode: ["✏️"] },
  { name: "painting", unicode: ["🖼️"] },
  { name: "camera", unicode: ["📷"] },
  { name: "phone", unicode: ["📱"] },
  { name: "computer", unicode: ["💻"] },
  { name: "clock", unicode: ["⏰"] },
  { name: "gift", unicode: ["🎁"] },
  { name: "balloon", unicode: ["🎈"] },
  { name: "party", unicode: ["🎉"] },
  { name: "heart", unicode: ["❤️"] },
  { name: "star", unicode: ["⭐"] },
  { name: "moon", unicode: ["🌙"] },
  { name: "planet", unicode: ["🪐"] },
  { name: "sparkles", unicode: ["✨"] },
  { name: "comet", unicode: ["☄️"] },
  { name: "flower", unicode: ["🌸"] },
  { name: "rose", unicode: ["🌹"] },
  { name: "sunflower", unicode: ["🌻"] },
  { name: "apple", unicode: ["🍎"] },
  { name: "banana", unicode: ["🍌"] },
  { name: "grapes", unicode: ["🍇"] },
  { name: "cherry", unicode: ["🍒"] },
  { name: "lemon", unicode: ["🍋"] },
  { name: "watermelon", unicode: ["🍉"] },
  { name: "avocado", unicode: ["🥑"] },
  { name: "broccoli", unicode: ["🥦"] },
  { name: "corn", unicode: ["🌽"] },
  { name: "tomato", unicode: ["🍅"] },
  { name: "pepper", unicode: ["🌶️"] },
  { name: "mushroom", unicode: ["🍄"] },
  { name: "garlic", unicode: ["🧄"] },
  { name: "onion", unicode: ["🧅"] },
  { name: "potato", unicode: ["🥔"] },
  { name: "carrot", unicode: ["🥕"] },
  { name: "fish", unicode: ["🐟"] },
  { name: "shrimp", unicode: ["🦐"] },
  { name: "crab", unicode: ["🦀"] },
  { name: "lobster", unicode: ["🦞"] },
  { name: "shell", unicode: ["🐚"] },
  { name: "dog", unicode: ["🐶"] },
  { name: "cat", unicode: ["🐱"] },
  { name: "rabbit", unicode: ["🐰"] },
  { name: "bear", unicode: ["🐻"] },
  { name: "lion", unicode: ["🦁"] },
  { name: "tiger", unicode: ["🐯"] },
  { name: "horse", unicode: ["🐴"] },
  { name: "cow", unicode: ["🐮"] },
  { name: "pig", unicode: ["🐷"] },
  { name: "chicken", unicode: ["🐔"] },
  { name: "frog", unicode: ["🐸"] },
  { name: "whale", unicode: ["🐋"] },
  { name: "dolphin", unicode: ["🐬"] },
  { name: "owl", unicode: ["🦉"] },
  { name: "penguin", unicode: ["🐧"] },
  { name: "butterfly", unicode: ["🦋"] },
  { name: "bee", unicode: ["🐝"] },
  { name: "spider", unicode: ["🕷️"] },
  { name: "octopus", unicode: ["🐙"] },
  { name: "turtle", unicode: ["🐢"] },
  { name: "dragon", unicode: ["🐉"] },
  { name: "unicorn", unicode: ["🦄"] },
  { name: "panda", unicode: ["🐼"] },
  { name: "koala", unicode: ["🐨"] },
  { name: "sloth", unicode: ["🦥"] },
  { name: "fox", unicode: ["🦊"] },
  { name: "wolf", unicode: ["🐺"] },
  { name: "deer", unicode: ["🦌"] },
  { name: "camel", unicode: ["🐫"] },
  { name: "elephant", unicode: ["🐘"] },
  { name: "giraffe", unicode: ["🦒"] },
  { name: "kangaroo", unicode: ["🦘"] },
  { name: "rhino", unicode: ["🦏"] },
  { name: "hippo", unicode: ["🦛"] },
  { name: "crocodile", unicode: ["🐊"] },
  { name: "lizard", unicode: ["🦎"] },
  { name: "snail", unicode: ["🐌"] },
  { name: "ladybug", unicode: ["🐞"] },
  { name: "ant", unicode: ["🐜"] },
  { name: "spider web", unicode: ["🕸️"] },
  { name: "seedling", unicode: ["🌱"] },
  { name: "herb", unicode: ["🌿"] },
  { name: "shamrock", unicode: ["☘️"] },
  { name: "cactus", unicode: ["🌵"] },
  { name: "pine", unicode: ["🌲"] },
  { name: "maple", unicode: ["🍁"] },
  { name: "leaf", unicode: ["🍃"] },
  { name: "mushroom", unicode: ["🍄"] },
  { name: "crystal", unicode: ["🔮"] },
  { name: "gem", unicode: ["💎"] },
  { name: "crown", unicode: ["👑"] },
  { name: "ring", unicode: ["💍"] },
  { name: "key", unicode: ["🔑"] },
  { name: "lock", unicode: ["🔒"] },
  { name: "flashlight", unicode: ["🔦"] },
  { name: "magnet", unicode: ["🧲"] },
  { name: "gear", unicode: ["⚙️"] },
  { name: "tools", unicode: ["🛠️"] },
  { name: "hammer", unicode: ["🔨"] },
  { name: "wrench", unicode: ["🔧"] },
  { name: "paint", unicode: ["🧑‍🎨"] },
  { name: "chef", unicode: ["🧑‍🍳"] },
  { name: "pilot", unicode: ["🧑‍✈️"] },
  { name: "doctor", unicode: ["🧑‍⚕️"] },
  { name: "student", unicode: ["🧑‍🎓"] },
  { name: "artist", unicode: ["🎭"] },
  { name: "movie", unicode: ["🎬"] },
  { name: "ticket", unicode: ["🎫"] },
  { name: "game", unicode: ["🎮"] },
  { name: "dice", unicode: ["🎲"] },
  { name: "puzzle", unicode: ["🧩"] },
  { name: "magic", unicode: ["🪄"] },
  { name: "robot", unicode: ["🤖"] },
  { name: "alien", unicode: ["👽"] },
  { name: "ghost", unicode: ["👻"] },
  { name: "skull", unicode: ["💀"] },
  { name: "pumpkin", unicode: ["🎃"] },
  { name: "clown", unicode: ["🤡"] },
  { name: "party popper", unicode: ["🎉"] },
  { name: "sparkler", unicode: ["🎇"] },
  { name: "fireworks", unicode: ["🎆"] },
  { name: "camera", unicode: ["📷"] },
  { name: "video", unicode: ["🎥"] },
  { name: "alarm", unicode: ["⏰"] },
  { name: "calendar", unicode: ["📅"] },
  { name: "map", unicode: ["🗺️"] },
  { name: "globe", unicode: ["🌍"] },
  { name: "flag", unicode: ["🚩"] },
  { name: "mail", unicode: ["✉️"] },
  { name: "package", unicode: ["📦"] },
  { name: "shopping", unicode: ["🛍️"] },
  { name: "wallet", unicode: ["👛"] },
  { name: "money", unicode: ["💵"] },
  { name: "bank", unicode: ["🏦"] },
  { name: "hospital", unicode: ["🏥"] },
  { name: "factory", unicode: ["🏭"] },
  { name: "stadium", unicode: ["🏟️"] },
  { name: "museum", unicode: ["🏛️"] },
  { name: "church", unicode: ["⛪"] },
  { name: "mosque", unicode: ["🕌"] },
  { name: "temple", unicode: ["🛕"] },
  { name: "rocket ship", unicode: ["🚀"] },
  { name: "satellite", unicode: ["🛰️"] },
  { name: "telescope", unicode: ["🔭"] },
  { name: "microscope", unicode: ["🔬"] },
  { name: "atom", unicode: ["⚛️"] },
  { name: "dna", unicode: ["🧬"] },
  { name: "virus", unicode: ["🦠"] },
  { name: "pill", unicode: ["💊"] },
  { name: "syringe", unicode: ["💉"] },
  { name: "stethoscope", unicode: ["🩺"] },
  { name: "mask", unicode: ["😷"] },
  { name: "sleep", unicode: ["😴"] },
  { name: "thinking", unicode: ["🤔"] },
  { name: "laugh", unicode: ["😂"] },
  { name: "smile", unicode: ["😄"] },
  { name: "cool", unicode: ["😎"] },
  { name: "love", unicode: ["😍"] }
];

let emojiCatalog: EmojiApiItem[] = [...LOCAL_EMOJI_CATALOG];
let emojiCatalogLoaded = true;
const TARGET_PUZZLE_COUNT = 20;
const COLOR_PALETTE = ["#7c3aed", "#2563eb", "#f59e0b", "#db2777", "#22c55e", "#f97316", "#38bdf8", "#a855f7"];
const STOP_WORDS = new Set([
  "with",
  "and",
  "the",
  "of",
  "face",
  "skin",
  "tone",
  "light",
  "medium",
  "dark"
]);
const THEMES: Array<{ word: string; keywords: string[] }> = [
  { word: "RAINBOW", keywords: ["rainbow", "sun", "rain", "cloud"] },
  { word: "SNOWMAN", keywords: ["snowman", "snow", "scarf", "carrot"] },
  { word: "JUNGLE", keywords: ["monkey", "snake", "parrot", "leaves"] },
  { word: "CAMPFIRE", keywords: ["fire", "camping", "tree", "night sky"] },
  { word: "PIZZA", keywords: ["pizza", "cheese", "tomato", "bread"] },
  { word: "DESSERT", keywords: ["cake", "donut", "ice cream", "candy"] },
  { word: "SPORTS", keywords: ["soccer", "basketball", "tennis", "trophy"] },
  { word: "MUSIC", keywords: ["guitar", "drum", "piano", "microphone"] },
  { word: "TRAVEL", keywords: ["airplane", "train", "car", "map"] },
  { word: "OCEAN", keywords: ["whale", "dolphin", "fish", "shell"] },
  { word: "GARDEN", keywords: ["flower", "rose", "sunflower", "leaf"] },
  { word: "FRUIT", keywords: ["apple", "banana", "grapes", "cherry"] },
  { word: "ANIMALS", keywords: ["dog", "cat", "rabbit", "bear"] },
  { word: "SPACE", keywords: ["rocket", "planet", "star", "moon"] },
  { word: "SCIENCE", keywords: ["microscope", "atom", "dna", "telescope"] },
  { word: "MAGIC", keywords: ["magic", "crystal", "ghost", "pumpkin"] },
  { word: "CITY", keywords: ["city", "bridge", "camera", "night sky"] },
  { word: "TOOLS", keywords: ["hammer", "wrench", "tools", "gear"] },
  { word: "SCHOOL", keywords: ["book", "pencil", "school", "clock"] },
  { word: "CELEBRATE", keywords: ["party", "balloon", "gift", "sparkles"] },
  { word: "WEATHER", keywords: ["cloud", "rain", "snow", "lightning"] },
  { word: "WILDLIFE", keywords: ["lion", "tiger", "elephant", "giraffe"] },
  { word: "INSECTS", keywords: ["bee", "butterfly", "ladybug", "spider"] },
  { word: "FARM", keywords: ["cow", "pig", "horse", "chicken"] },
  { word: "RELAX", keywords: ["coffee", "tea", "sleep", "book"] }
];

const timerEl = document.getElementById("timer") as HTMLElement;
const scoreEl = document.getElementById("score") as HTMLElement;
const messageEl = document.getElementById("message") as HTMLElement;
const emojiStringEl = document.getElementById("emoji-string") as HTMLElement;
const wordLengthEl = document.getElementById("word-length") as HTMLElement;
const guessInput = document.getElementById("guess-input") as HTMLInputElement;
const submitBtn = document.getElementById("submit") as HTMLButtonElement;
const nextBtn = document.getElementById("next") as HTMLButtonElement;
const restartBtn = document.getElementById("restart") as HTMLButtonElement;
const canvas = document.getElementById("scene") as HTMLCanvasElement;

let score = 0;
let remaining = 30;
let activePuzzleIndex = 0;
let roundActive = false;
let deadline = 0;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog("#0b0a1e", 8, 22);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
camera.position.set(0, 0.6, 6.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0b0a1e, 0);

const ambient = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(3, 5, 4);
scene.add(keyLight);

const fillLight = new THREE.PointLight(0x8b5cf6, 1, 20);
fillLight.position.set(-4, -2, 6);
scene.add(fillLight);

const cardsGroup = new THREE.Group();
scene.add(cardsGroup);

const cardMeshes: THREE.Mesh[] = [];
const cardGeometry = new THREE.PlaneGeometry(2.2, 2.2, 1, 1);

const positions = [
  new THREE.Vector3(-1.35, 1.25, 0),
  new THREE.Vector3(1.35, 1.25, 0),
  new THREE.Vector3(-1.35, -1.25, 0),
  new THREE.Vector3(1.35, -1.25, 0)
];

positions.forEach((pos) => {
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.1
  });
  const mesh = new THREE.Mesh(cardGeometry, material);
  mesh.position.copy(pos);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  cardMeshes.push(mesh);
  cardsGroup.add(mesh);
});

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(6.5, 64),
  new THREE.MeshStandardMaterial({ color: 0x141024, roughness: 0.9, metalness: 0 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.3;
floor.receiveShadow = true;
scene.add(floor);

function resizeRenderer() {
  const { clientWidth, clientHeight } = canvas;
  if (clientWidth === 0 || clientHeight === 0) return;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}

function createHintTexture(hint: PuzzleHint): THREE.Texture {
  const size = 512;
  const hintCanvas = document.createElement("canvas");
  hintCanvas.width = size;
  hintCanvas.height = size;
  const ctx = hintCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create 2D context for texture");
  }

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, hint.color);
  gradient.addColorStop(1, "#0f172a");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fillRect(24, 24, size - 48, size - 48);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 180px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(hint.emoji, size / 2, size / 2 - 30);

  ctx.font = "600 46px 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillText(hint.label.toUpperCase(), size / 2, size / 2 + 130);

  const texture = new THREE.CanvasTexture(hintCanvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function shuffleArray<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function normalizeToken(token: string) {
  return token.toLowerCase().replace(/[^a-z]/g, "");
}

function formatLabel(label?: string) {
  if (!label) return "Emoji";
  const words = label.split(/\s|-/).filter(Boolean).slice(0, 2).join(" ");
  return words.length > 16 ? words.slice(0, 16) : words;
}

function findEmojiByKeyword(keyword: string) {
  const normalized = keyword.toLowerCase();
  const match = emojiCatalog.find((item) => item.name?.toLowerCase() === normalized);
  if (match?.unicode?.[0]) return match.unicode[0];
  const partial = emojiCatalog.find((item) => item.name?.toLowerCase().includes(normalized));
  return partial?.unicode?.[0] ?? "";
}

function getEmojiFromCatalog(keyword: string) {
  if (!emojiCatalogLoaded || emojiCatalog.length === 0) return "";
  const normalized = keyword.toLowerCase();
  const matches = emojiCatalog.filter((item) => item.name?.toLowerCase().includes(normalized));
  const pool = matches.length > 0 ? matches : emojiCatalog;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return pick?.unicode?.[0] ?? "";
}

async function loadEmojiCatalog() {
  emojiCatalog = [...LOCAL_EMOJI_CATALOG];
  emojiCatalogLoaded = true;
}

function buildPuzzlesFromCatalog(targetCount: number) {
  if (!emojiCatalogLoaded || emojiCatalog.length === 0) return [];
  const themed: Puzzle[] = [];
  THEMES.forEach((theme) => {
    const hints: PuzzleHint[] = theme.keywords.slice(0, 4).map((keyword, index) => {
      const emoji = findEmojiByKeyword(keyword) || getEmojiFromCatalog(keyword) || "❓";
      return {
        emoji,
        label: formatLabel(keyword),
        color: COLOR_PALETTE[index % COLOR_PALETTE.length],
        lockEmoji: true
      };
    });
    if (hints.every((hint) => hint.emoji !== "❓")) {
      themed.push({ word: theme.word.toUpperCase(), hints });
    }
  });

  if (themed.length >= targetCount) {
    return shuffleArray(themed).slice(0, targetCount);
  }

  const tokenMap = new Map<string, EmojiApiItem[]>();

  emojiCatalog.forEach((item) => {
    const name = item.name ?? "";
    const unicode = item.unicode?.[0];
    if (!unicode) return;
    const tokens = name.split(/\s|-/).map(normalizeToken).filter(Boolean);
    tokens.forEach((token) => {
      if (token.length < 4 || STOP_WORDS.has(token)) return;
      const current = tokenMap.get(token) ?? [];
      current.push(item);
      tokenMap.set(token, current);
    });
  });

  const candidates = Array.from(tokenMap.entries())
    .filter(([, items]) => items.length >= 4)
    .map(([token, items]) => ({ token, items }));

  shuffleArray(candidates);
  const generated: Puzzle[] = [];
  const usedTokens = new Set<string>();

  for (const entry of candidates) {
    if (usedTokens.has(entry.token)) continue;
    const picks = shuffleArray([...entry.items]).slice(0, 4);
    const hints: PuzzleHint[] = picks.map((item, index) => ({
      emoji: item.unicode?.[0] ?? "❓",
      label: formatLabel(item.name),
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
      lockEmoji: true
    }));
    generated.push({ word: entry.token.toUpperCase(), hints });
    usedTokens.add(entry.token);
    if (generated.length >= targetCount) break;
  }

  return generated;
}

function applyPuzzle(puzzle: Puzzle) {
  const shuffledHints = shuffleArray([...puzzle.hints]).map((hint) => {
    if (hint.lockEmoji) {
      return hint;
    }
    const apiEmoji = getEmojiFromCatalog(hint.label.split(" ")[0]);
    return {
      ...hint,
      emoji: apiEmoji || hint.emoji
    };
  });
  shuffledHints.forEach((hint, index) => {
    const texture = createHintTexture(hint);
    const material = cardMeshes[index].material as THREE.MeshStandardMaterial;
    material.map = texture;
    material.needsUpdate = true;
  });
  wordLengthEl.textContent = `Word length: ${puzzle.word.length}`;
  emojiStringEl.textContent = shuffledHints.map((hint) => hint.emoji).join(" ");
}

function sanitizeGuess(value: string) {
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function setMessage(text: string, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? "#fca5a5" : "rgba(255, 255, 255, 0.85)";
}

function startRound() {
  if (puzzles.length === 0) {
    setMessage("Loading puzzles. Try again in a moment.", true);
    guessInput.disabled = true;
    submitBtn.disabled = true;
    nextBtn.disabled = true;
    restartBtn.disabled = true;
    return;
  }
  roundActive = true;
  remaining = 30;
  deadline = performance.now() + remaining * 1000;
  timerEl.textContent = remaining.toString();
  guessInput.value = "";
  guessInput.disabled = false;
  submitBtn.disabled = false;
  nextBtn.disabled = true;
  setMessage("String together the four emojis and guess the word.");
  applyPuzzle(puzzles[activePuzzleIndex]);
  guessInput.focus();
}

function endRound(message: string, isError = false) {
  roundActive = false;
  guessInput.disabled = true;
  submitBtn.disabled = true;
  nextBtn.disabled = false;
  setMessage(message, isError);
}

function checkGuess() {
  if (!roundActive) return;
  const guess = sanitizeGuess(guessInput.value);
  if (!guess) {
    setMessage("Type a guess before submitting.", true);
    return;
  }

  const answer = puzzles[activePuzzleIndex].word.toUpperCase();
  if (guess === answer) {
    score += Math.max(1, remaining);
    scoreEl.textContent = score.toString();
    endRound(`Correct! The word was ${answer}.`, false);
  } else {
    setMessage("Not quite. Try another guess.", true);
  }
}

function nextPuzzle() {
  activePuzzleIndex = (activePuzzleIndex + 1) % puzzles.length;
  startRound();
}

function restartPuzzle() {
  if (puzzles.length === 0) {
    startRound();
    return;
  }
  shuffleArray(puzzles);
  activePuzzleIndex = 0;
  startRound();
}

function updateTimer() {
  if (!roundActive) return;
  const now = performance.now();
  const secondsLeft = Math.max(0, Math.ceil((deadline - now) / 1000));
  if (secondsLeft !== remaining) {
    remaining = secondsLeft;
    timerEl.textContent = remaining.toString();
    if (remaining <= 5) {
      timerEl.style.color = "#fca5a5";
    } else {
      timerEl.style.color = "#ffffff";
    }
  }

  if (remaining <= 0) {
    const answer = puzzles[activePuzzleIndex].word.toUpperCase();
    endRound(`Time's up! The word was ${answer}.`, true);
  }
}

submitBtn.addEventListener("click", checkGuess);
nextBtn.addEventListener("click", nextPuzzle);
restartBtn.addEventListener("click", restartPuzzle);
guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkGuess();
  }
});

window.addEventListener("resize", resizeRenderer);

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  cardsGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.12;
  cardsGroup.rotation.x = Math.sin(elapsed * 0.16) * 0.06;

  cardMeshes.forEach((mesh, index) => {
    mesh.position.y = positions[index].y + Math.sin(elapsed * 1.5 + index) * 0.05;
  });

  updateTimer();
  resizeRenderer();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function initializePuzzles() {
  const generated = buildPuzzlesFromCatalog(TARGET_PUZZLE_COUNT);
  puzzles = generated;
  shuffleArray(puzzles);
  activePuzzleIndex = 0;
  restartBtn.disabled = false;
}

loadEmojiCatalog().finally(() => {
  initializePuzzles();
  startRound();
});
animate();
