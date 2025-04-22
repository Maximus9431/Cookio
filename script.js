document.addEventListener("DOMContentLoaded", () => {
  const egg = document.getElementById('egg');
  const pet = document.getElementById('pet');
  const interfaceContainer = document.getElementById('interface');
  const statsPanel = document.getElementById('stats-panel');
  const feedButton = document.getElementById('feed-pet');
  const levelUpButton = document.getElementById('level-up-pet');
  const shopButton = document.getElementById('open-shop');
  const shop = document.getElementById('shop');
  const closeShopButton = document.getElementById('close-shop');

  let tapCount = 0;
  let isHatched = false;

  // Параметры питомца
  let petLevel = 1;
  let petStrength = 10;
  let petHunger = 50; // 0-100%
  let petEmotions = 50; // 0-100%

  // Валюта игрока
  let playerCurrency = 0;

  // Обновление статистики на экране
  function updateStats() {
    document.getElementById('pet-level').textContent = petLevel;
    document.getElementById('pet-strength').textContent = petStrength;
    document.getElementById('pet-hunger').textContent = petHunger + '%';
    document.getElementById('pet-emotions').textContent = petEmotions + '%';
    document.getElementById('player-currency').textContent = playerCurrency;
  }

  // Показать интерфейс после вылупления
  function showInterface() {
    interfaceContainer.classList.remove('hidden');
    updateStats();
  }

  // Обработка кликов по яйцу
  egg.addEventListener('click', () => {
    if (isHatched) return;

    tapCount++;
    egg.classList.add('wiggle');

    setTimeout(() => {
      egg.classList.remove('wiggle');
    }, 800);

    if (tapCount >= 10) {
      isHatched = true;
      egg.style.display = 'none';

      // Показываем питомца
      pet.src = "pet_final.png";
      pet.classList.add('show');

      // Показываем интерфейс
      showInterface();

      // Сохраняем питомца на сервере
      fetch('/api/hatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: userId,
          pet_id: Math.floor(Math.random() * 500) + 1
        })
      }).then(res => res.json()).then(data => {
        console.log("Pet hatched:", data);
      });
    }
  });

  // Функция кормления питомца
  feedButton.addEventListener('click', () => {
    if (playerCurrency >= 20) {
      spendCurrency(20);
      petHunger = Math.min(petHunger + 20, 100);
      updateStats();
    } else {
      alert("Not enough currency to feed the pet!");
    }
  });

  // Функция прокачки питомца
  levelUpButton.addEventListener('click', () => {
    if (playerCurrency >= 100) {
      spendCurrency(100);
      petLevel++;
      petStrength += 5;
      updateStats();
    } else {
      alert("Not enough currency to level up!");
    }
  });

  // Открытие магазина
  shopButton.addEventListener('click', () => {
    shop.classList.remove('hidden');
  });

  // Закрытие магазина
  closeShopButton.addEventListener('click', () => {
    shop.classList.add('hidden');
  });

  // Инициализация
  updateStats();
});