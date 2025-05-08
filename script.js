const egg = document.getElementById('egg');
const petImage = document.getElementById('pet-image');
const petRarity = document.getElementById('pet-rarity');
const eggMessage = document.getElementById('egg-message');
const eggMessageContainer = document.getElementById('egg-message-container');
const darkOverlay = document.getElementById('dark-overlay');
const eggCrackSound = document.getElementById('egg-crack-sound');
let clicks = 0;

egg.addEventListener('click', () => {
  clicks++;
  eggCrackSound.currentTime = 0;
  eggCrackSound.play();

  if (clicks === 1) {
    egg.src = 'eggs/egg_1.jpeg';
  } else if (clicks === 2) {
    egg.src = 'eggs/egg_2.jpeg';
  } else if (clicks === 3) {
    egg.classList.add('hidden');
    darkOverlay.classList.add('hidden');
    eggMessageContainer.classList.add('hidden');

    const petData = generatePet();
    petImage.src = `pets/${petData.image}`;
    petImage.style.display = 'block';
    petRarity.textContent = `Редкость: ${petData.rarity}`;
    petRarity.style.display = 'block';
  }
});

function generatePet() {
  const rarityChances = [
    { rarity: 'Легендарный', chance: 0.8, image: 'legendary_pet.png' },
    { rarity: 'Эпический', chance: 7.2, image: 'epic_pet.png' },
    { rarity: 'Сверхредкий', chance: 15.8, image: 'super_rare_pet.png' },
    { rarity: 'Редкий', chance: 33.2, image: 'rare_pet.png' },
    { rarity: 'Обычный', chance: 44, image: 'common_pet.png' },
  ];

  const random = Math.random() * 100;
  let cumulative = 0;

  for (const rarity of rarityChances) {
    cumulative += rarity.chance;
    if (random <= cumulative) return rarity;
  }
  return rarityChances[rarityChances.length - 1];
}

// Меню
const expandButton = document.getElementById('expand-button');
const menuButtons = document.getElementById('menu-buttons');

expandButton.addEventListener('click', () => {
  const isVisible = menuButtons.classList.toggle('show');
  expandButton.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
  expandButton.style.transform = isVisible 
    ? 'scale(1.1) rotate(180deg)'
    : 'scale(1) rotate(0deg)';
});

// Закрытие при клике вне меню
document.addEventListener('click', (e) => {
  if (!e.target.closest('#expandable-menu') && menuButtons.classList.contains('show')) {
    menuButtons.classList.remove('show');
    expandButton.setAttribute('aria-expanded', 'false');
    expandButton.style.transform = 'scale(1) rotate(0deg)';
  }
});

// Клавиатурный доступ
expandButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    expandButton.click();
  }
});
