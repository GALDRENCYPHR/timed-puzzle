import * as THREE from "three";

type PuzzleHint = {
  emoji: string;
  label: string;
  color: string;
};

type Puzzle = {
  word: string;
  hints: PuzzleHint[];
};

const puzzles: Puzzle[] = [
  {
    word: "RAINBOW",
    hints: [
      { emoji: "🌈", label: "Colors", color: "#7c3aed" },
      { emoji: "☔", label: "After rain", color: "#2563eb" },
      { emoji: "🌤️", label: "Sunshine", color: "#f59e0b" },
      { emoji: "🎨", label: "Spectrum", color: "#db2777" }
    ]
  },
  {
    word: "SNOWMAN",
    hints: [
      { emoji: "⛄", label: "Winter", color: "#38bdf8" },
      { emoji: "🧣", label: "Scarf", color: "#f43f5e" },
      { emoji: "🥕", label: "Carrot nose", color: "#f97316" },
      { emoji: "❄️", label: "Frosty", color: "#60a5fa" }
    ]
  },
  {
    word: "JUNGLE",
    hints: [
      { emoji: "🐒", label: "Monkey", color: "#22c55e" },
      { emoji: "🌿", label: "Vines", color: "#16a34a" },
      { emoji: "🐍", label: "Snake", color: "#15803d" },
      { emoji: "🦜", label: "Parrot", color: "#65a30d" }
    ]
  },
  {
    word: "CAMPFIRE",
    hints: [
      { emoji: "🔥", label: "Warmth", color: "#ef4444" },
      { emoji: "🌲", label: "Woods", color: "#22c55e" },
      { emoji: "⛺", label: "Camping", color: "#f97316" },
      { emoji: "🌌", label: "Night sky", color: "#6366f1" }
    ]
  }
];

const timerEl = document.getElementById("timer") as HTMLElement;
const scoreEl = document.getElementById("score") as HTMLElement;
const messageEl = document.getElementById("message") as HTMLElement;
const wordLengthEl = document.getElementById("word-length") as HTMLElement;
const guessInput = document.getElementById("guess-input") as HTMLInputElement;
const submitBtn = document.getElementById("submit") as HTMLButtonElement;
const nextBtn = document.getElementById("next") as HTMLButtonElement;
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
  ctx.font = "bold 160px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(hint.emoji, size / 2, size / 2 - 40);

  ctx.font = "600 46px 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillText(hint.label.toUpperCase(), size / 2, size / 2 + 110);

  const texture = new THREE.CanvasTexture(hintCanvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function applyPuzzle(puzzle: Puzzle) {
  puzzle.hints.forEach((hint, index) => {
    const texture = createHintTexture(hint);
    const material = cardMeshes[index].material as THREE.MeshStandardMaterial;
    material.map = texture;
    material.needsUpdate = true;
  });
  wordLengthEl.textContent = `Word length: ${puzzle.word.length}`;
}

function sanitizeGuess(value: string) {
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function setMessage(text: string, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? "#fca5a5" : "rgba(255, 255, 255, 0.85)";
}

function startRound() {
  roundActive = true;
  remaining = 30;
  deadline = performance.now() + remaining * 1000;
  timerEl.textContent = remaining.toString();
  guessInput.value = "";
  guessInput.disabled = false;
  submitBtn.disabled = false;
  nextBtn.disabled = true;
  setMessage("Study the pictures and guess the word.");
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

startRound();
animate();
