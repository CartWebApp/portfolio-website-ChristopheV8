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
const pauseCampfireCheckbox = document.getElementById('pauseCampfire');

let fireStrength = 1;
let fireDecayRate = parseFloat(decaySlider.value);
let woodLightBoost = parseFloat(boostSlider.value);
let woodCount = parseInt(woodCountSlider.value);
let woods = [];
let isPaused = false;
let burnDownInterval = setInterval(burnDown, 500);  // Initial burn interval

// Save settings to localStorage
function saveSettings() {
  const settings = {
    fireDecayRate: fireDecayRate,
    woodLightBoost: woodLightBoost,
    woodCount: woodCount,
    isPaused: isPaused,
    isDarkMode: themeToggle.checked
  };
  
  localStorage.setItem('campfireSettings', JSON.stringify(settings));
}

// Load settings from localStorage
function loadSettings() {
  const savedSettings = JSON.parse(localStorage.getItem('campfireSettings'));
  if (savedSettings) {
    fireDecayRate = savedSettings.fireDecayRate || fireDecayRate;
    woodLightBoost = savedSettings.woodLightBoost || woodLightBoost;
    woodCount = savedSettings.woodCount || woodCount;
    isPaused = savedSettings.isPaused || isPaused;
    const isDarkMode = savedSettings.isDarkMode !== undefined ? savedSettings.isDarkMode : themeToggle.checked;

    // Apply saved settings
    decaySlider.value = fireDecayRate;
    boostSlider.value = woodLightBoost;
    woodCountSlider.value = woodCount;
    woodCountValue.textContent = woodCount;
    themeToggle.checked = isDarkMode;
    pauseCampfireCheckbox.checked = isPaused;

    // Update the UI based on saved settings
    document.body.classList.toggle('dark-mode', isDarkMode);
    updateWoodCount();

    // Apply the paused state
    if (isPaused) {
      clearInterval(burnDownInterval);
    } else {
      burnDownInterval = setInterval(burnDown, 500); // Resume burning the fire
    }
  }
}

// Event listeners for controls
decaySlider.addEventListener('input', () => {
  fireDecayRate = parseFloat(decaySlider.value);
  saveSettings();
});

boostSlider.addEventListener('input', () => {
  woodLightBoost = parseFloat(boostSlider.value);
  saveSettings();
});

woodCountSlider.addEventListener('input', () => {
  woodCount = parseInt(woodCountSlider.value);
  woodCountValue.textContent = woodCount;
  updateWoodCount();
  saveSettings();
});

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', themeToggle.checked);
  saveSettings();
});

pauseCampfireCheckbox.addEventListener('change', () => {
  isPaused = pauseCampfireCheckbox.checked;
  saveSettings();
  if (isPaused) {
    clearInterval(burnDownInterval);
  } else {
    burnDownInterval = setInterval(burnDown, 500); // Resume burning the fire
  }
});

// Burn function
function burnDown() {
  if (!isPaused) {
    fireStrength -= fireDecayRate;
    fireStrength = Math.max(fireStrength, 0);
    updateFireAndDarkness();
  }
}

function updateFireAndDarkness() {
  fire.style.opacity = fireStrength;
  overlay.style.opacity = 1 - fireStrength;
}

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

// Load settings on startup
window.addEventListener('load', loadSettings);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const responseDiv = document.getElementById('form-response');

    form.addEventListener('submit', (e) => {
        e.preventDefault();  // Prevent form from actually submitting

        // Form validation
        const name = document.getElementById('name').value.trim();
        const number = document.getElementById('number').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            responseDiv.textContent = 'All fields are required!';
            responseDiv.classList.add('error');
            responseDiv.classList.remove('success');
            responseDiv.style.display = 'block';
            return;
        }

        // On success:
        responseDiv.textContent = 'Your message has been sent successfully!';
        responseDiv.classList.add('success');
        responseDiv.classList.remove('error');
        responseDiv.style.display = 'block';


        // Optionally, reset the form after successful submission
        form.reset();

        // Optionally, clear the response message after 5 seconds
        setTimeout(() => {
            responseDiv.style.display = 'none';  // Hide the response message
        }, 5000);  // Hide after 5 seconds
    });
});
