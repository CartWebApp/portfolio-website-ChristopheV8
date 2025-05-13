const fire = document.getElementById('fire');
const overlay = document.getElementById('dark-overlay');
const decaySlider = document.getElementById('decaySpeed');
const boostSlider = document.getElementById('lightBoost');
const themeToggle = document.getElementById('themeToggle');
const woodCountSlider = document.getElementById('woodCount');
const container = document.getElementById('campfireZone');
const toggleButton = document.getElementById('toggle-panel');
const controlPanel = document.getElementById('control-panel');
const woodCountValue = document.getElementById('woodCountValue');


let fireStrength = 1;
let fireDecayRate = parseFloat(decaySlider.value);
let woodLightBoost = parseFloat(boostSlider.value);
let woodCount = parseInt(woodCountSlider.value);
let woods = [];


function updateFireAndDarkness() {
  fire.style.opacity = fireStrength;
  overlay.style.opacity = 1 - fireStrength;
}


function burnDown() {
  fireStrength -= fireDecayRate;
  fireStrength = Math.max(fireStrength, 0);
  updateFireAndDarkness();
}
setInterval(burnDown, 500);


decaySlider.addEventListener('input', () => {
  fireDecayRate = parseFloat(decaySlider.value);
});
boostSlider.addEventListener('input', () => {
  woodLightBoost = parseFloat(boostSlider.value);
});
woodCountSlider.addEventListener('input', () => {
  woodCount = parseInt(woodCountSlider.value);
  woodCountValue.textContent = woodCount; // 
  updateWoodCount();
});



themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', themeToggle.checked);
});


function getRandomPosition() {
  const x = Math.floor(Math.random() * (window.innerWidth - 100));
  const y = Math.floor(Math.random() * (window.innerHeight - 50));
  return { x, y };
}


function spawnWood(wood) {
  const { x, y } = getRandomPosition();
  wood.style.left = `${x}px`;
  wood.style.top = `${y}px`;
  wood.style.display = 'block';
  wood.style.position = 'absolute';
  wood.style.opacity = '1';
  wood.style.zIndex = '1001';
}

function createWood(index) {
  const wood = document.createElement('div');
  wood.classList.add('wood');
  wood.setAttribute('draggable', 'true');
  wood.dataset.index = index;

  wood.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', index);
  });

  document.body.appendChild(wood);
  spawnWood(wood);
  return wood;
}

function updateWoodCount() {
  woods.forEach(wood => wood.remove());
  woods = [];

  for (let i = 0; i < woodCount; i++) {
    const newWood = createWood(i);
    woods.push(newWood);
  }
}

function ensureMinimumWood() {
  const visibleWoods = woods.filter(wood => wood.style.display !== 'none');
  while (visibleWoods.length < woodCount) {
    const hiddenWood = woods.find(wood => wood.style.display === 'none');
    if (hiddenWood) {
      spawnWood(hiddenWood);
      hiddenWood.style.display = 'block';
      visibleWoods.push(hiddenWood);
    } else {
      break;
    }
  }
}

container.addEventListener('dragover', (e) => e.preventDefault());

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

toggleButton.addEventListener('click', () => {
  controlPanel.style.display = 
    controlPanel.style.display === 'none' ? 'flex' : 'none';
});

updateWoodCount();
woodCountValue.textContent = woodCount;
