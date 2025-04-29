document.getElementById('start-game-button').addEventListener('click', () => {
  // Скрыть начальное окно
  document.getElementById('welcome-screen').style.display = 'none';

  // Показать экран Pets
  document.getElementById('pets-screen').style.display = 'block';
});

const egg = document.getElementById('egg');
const petImage = document.getElementById('pet-image');
const petRarity = document.getElementById('pet-rarity');
const eggMessage = document.getElementById('egg-message');

let clicks = 0;

egg.addEventListener('click', () => {
  clicks++;

  // Меняем изображение яйца при каждом клике
  if (clicks === 1) {
    egg.src = 'eggs/egg_1.png';
  } else if (clicks === 2) {
    egg.src = 'eggs/egg_2.png';
  } else if (clicks === 3) {
    // Яйцо разбито, показываем питомца
    egg.style.display = 'none';

    // Убираем затемняющий слой
    document.getElementById('dark-overlay').style.display = 'none';

    // Скрываем сообщение с анимацией
    eggMessage.classList.add('hidden');
    setTimeout(() => {
      eggMessage.style.display = 'none';
      document.getElementById('egg-message-container').style.display = 'none'; // Скрываем рамку
    }, 500); // Убираем элемент через 0.5 секунды

    // Генерация питомца
    const petData = generatePet();
    petImage.src = `pets/${petData.image}`;
    petImage.style.display = 'block';
    petRarity.textContent = `Редкость: ${petData.rarity}`;
    petRarity.style.display = 'block';
  }
});

// Функция для генерации питомца
function generatePet() {
  const rarityChances = [
    { rarity: 'Легендарный', chance: 0.8, image: 'legendary_pet.png' },
    { rarity: 'Эпический', chance: 7.2, image: 'epic_pet.png' },
    { rarity: 'Сверхредкий', chance: 15.8, image: 'super_rare_pet.png' },
    { rarity: 'Редкий', chance: 33.2, image: 'rare_pet.png' },
    { rarity: 'Обычный', chance: 43, image: 'common_pet.png' },
  ];

  const random = Math.random() * 100;
  let cumulativeChance = 0;

  for (const rarity of rarityChances) {
    cumulativeChance += rarity.chance;
    if (random <= cumulativeChance) {
      return rarity;
    }
  }

  // Если ничего не выпало (маловероятно), возвращаем обычного питомца
  return rarityChances[rarityChances.length - 1];
}

const expandButton = document.getElementById('expand-button');
const menuButtons = document.getElementById('menu-buttons');

expandButton.addEventListener('click', () => {
  if (menuButtons.style.display === 'none' || menuButtons.style.display === '') {
    // Разворачиваем меню
    menuButtons.style.display = 'flex';
    expandButton.textContent = '⬇'; // Меняем стрелку на вниз
  } else {
    // Сворачиваем меню
    menuButtons.style.display = 'none';
    expandButton.textContent = '⬆'; // Меняем стрелку на вверх
  }
});