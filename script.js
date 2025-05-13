const fire = document.getElementById('fire');
const overlay = document.getElementById('dark-overlay');
const decaySlider = document.getElementById('decaySpeed');
const boostSlider = document.getElementById('lightBoost');
const themeToggle = document.getElementById('themeToggle');
const container = document.getElementById('campfireZone');
const woods = Array.from(document.querySelectorAll('.wood'));

let fireStrength = 1;
let fireDecayRate = parseFloat(decaySlider.value);
let woodLightBoost = parseFloat(boostSlider.value);

// Update fire and overlay opacity
function updateFireAndDarkness() {
  fire.style.opacity = fireStrength;
  overlay.style.opacity = 1 - fireStrength;
}

// Burn down over time
function burnDown() {
  fireStrength -= fireDecayRate;
  fireStrength = Math.max(fireStrength, 0);
  updateFireAndDarkness();
}
setInterval(burnDown, 500);

// Update settings when sliders change
decaySlider.addEventListener('input', () => {
  fireDecayRate = parseFloat(decaySlider.value);
});
boostSlider.addEventListener('input', () => {
  woodLightBoost = parseFloat(boostSlider.value);
});

// Toggle dark mode
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', themeToggle.checked);
});

// Get a random position on the page
function getRandomPosition() {
  const x = Math.floor(Math.random() * (window.innerWidth - 100));
  const y = Math.floor(Math.random() * (window.innerHeight - 50));
  return { x, y };
}

// Place wood at a new random position
function spawnWood(wood) {
  const { x, y } = getRandomPosition();
  wood.style.left = `${x}px`;
  wood.style.top = `${y}px`;
  wood.style.display = 'block';
  wood.style.zIndex = '1001';
  wood.style.position = 'absolute';
  wood.style.opacity = '1';
}

// Keep at least 3 wood pieces on screen
function ensureMinimumWood() {
  const visibleWoods = woods.filter(wood => wood.style.display !== 'none');
  while (visibleWoods.length < 3) {
    const hiddenWood = woods.find(wood => wood.style.display === 'none');
    if (hiddenWood) {
      hiddenWood.style.display = 'block';
      spawnWood(hiddenWood);
      visibleWoods.push(hiddenWood);
    } else {
      break;
    }
  }
}

// Initialize wood pieces
woods.forEach((wood, index) => {
  spawnWood(wood);
  wood.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', index);
  });
});

// Allow drops on container
container.addEventListener('dragover', (e) => e.preventDefault());

// Drop wood on fire
container.addEventListener('drop', (e) => {
  e.preventDefault();
  const index = e.dataTransfer.getData('text');
  const wood = woods[index];

  fireStrength += woodLightBoost;
  fireStrength = Math.min(fireStrength, 1);
  updateFireAndDarkness();

  wood.style.display = 'none';

  setTimeout(() => {
    spawnWood(wood);
    ensureMinimumWood();
  }, 500);
});

// Start with 3 wood pieces
ensureMinimumWood();
