document.addEventListener("DOMContentLoaded", () => {
  const egg = document.getElementById('egg');
  const pet = document.getElementById('pet');
  const statsPanel = document.getElementById('stats-panel');
  const feedButton = document.getElementById('feed-pet');
  const levelUpButton = document.getElementById('level-up-pet');
  const shopButton = document.getElementById('open-shop');
  const shop = document.getElementById('shop');
  const closeShopButton = document.getElementById('close-shop');
  const questsButton = document.getElementById('start-pvp'); // Пример

  let tapCount = 0;
  let isHatched = false;

  // Параметры питомца
  let petLevel = 1;
  let petStrength = 10;
  let petHunger = 50; // 0-100%
  let petEmotions = 50; // 0-100%

  // Валюта игрока
  let playerCurrency = 0;

  // Ежедневные задания
  const dailyQuests = [
    { id: 1, task: "Win 3 PvP matches", reward: 100, completed: false },
    { id: 2, task: "Feed your pet twice", reward: 50, completed: false }
  ];

  // Магазин
  const shopItems = [
    { id: 1, name: "Cool Hat", price: 50, type: "accessory" },
    { id: 2, name: "Strength Boost", price: 100, type: "upgrade" },
    { id: 3, name: "Legendary Egg", price: 500, type: "egg" }
  ];

  // Проверка профиля игрока (заглушка для сервера)
  const user = window.Telegram.WebApp.initDataUnsafe?.user;
  const userId = user ? user.id : "demo_" + Math.floor(Math.random() * 10000);

  // Загрузка данных игрока с сервера (заглушка)
  fetch(`/api/player/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.pet) {
        // Новый игрок: показываем яйцо
        egg.style.display = 'block';
        pet.style.display = 'none';
      } else {
        // Игрок уже имеет питомца
        egg.style.display = 'none';
        pet.src = data.pet.image; // Изображение питомца
        pet.classList.add('show');
        isHatched = true;

        // Загружаем параметры питомца
        petLevel = data.pet.level;
        petStrength = data.pet.strength;
        petHunger = data.pet.hunger;
        petEmotions = data.pet.emotions;

        // Загружаем валюту
        playerCurrency = data.currency;

        // Обновляем интерфейс
        updateStats();
      }
    });

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

      // Создаем питомца
      const petId = Math.floor(Math.random() * 500) + 1; // Генерируем ID питомца
      pet.src = `pet_${petId}.png`; // Изображение питомца
      pet.classList.add('show');

      // Сохраняем питомца на сервере
      fetch('/api/hatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: userId,
          pet_id: petId
        })
      }).then(res => res.json()).then(data => {
        console.log("Pet hatched:", data);
      });
    }
  });

  // Функция прокачки питомца
  function levelUpPet() {
    if (playerCurrency >= 100) {
      spendCurrency(100);
      petLevel++;
      petStrength += 5;
      updateStats();
    } else {
      alert("Not enough currency to level up!");
    }
  }

  // Функция кормления питомца
  function feedPet() {
    if (playerCurrency >= 20) {
      spendCurrency(20);
      petHunger = Math.min(petHunger + 20, 100);
      updateStats();
    } else {
      alert("Not enough currency to feed the pet!");
    }
  }

  // Функции работы с валютой
  function earnCurrency(amount) {
    playerCurrency += amount;
    updateStats();
  }

  function spendCurrency(amount) {
    if (playerCurrency >= amount) {
      playerCurrency -= amount;
      updateStats();
      return true;
    } else {
      alert("Not enough currency!");
      return false;
    }
  }

  // PvP бои
  function startPvPMatch(opponent) {
    const playerPower = petLevel * petStrength;
    const opponentPower = opponent.level * opponent.strength;

    if (playerPower > opponentPower) {
      alert("You won the match!");
      earnCurrency(50); // Награда за победу
    } else {
      alert("You lost the match.");
    }
  }

  // Выполнение ежедневных заданий
  function completeQuest(questId) {
    const quest = dailyQuests.find(q => q.id === questId);
    if (quest && !quest.completed) {
      quest.completed = true;
      earnCurrency(quest.reward);
      alert(`Completed quest: ${quest.task}`);
      updateQuests();
    }
  }

  // Покупка предметов в магазине
  function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (item && spendCurrency(item.price)) {
      alert(`Bought ${item.name}`);
      // Применить эффект предмета (например, надеть аксессуар или улучшить питомца)
    }
  }

  // Обновление статистики на экране
  function updateStats() {
    document.getElementById('pet-level').textContent = petLevel;
    document.getElementById('pet-strength').textContent = petStrength;
    document.getElementById('pet-hunger').textContent = petHunger + '%';
    document.getElementById('pet-emotions').textContent = petEmotions + '%';
    document.getElementById('player-currency').textContent = playerCurrency;
  }

  // Обновление списка квестов
  function updateQuests() {
    const questList = document.getElementById('quest-list');
    questList.innerHTML = '';
    dailyQuests.forEach(quest => {
      const li = document.createElement('li');
      li.textContent = `${quest.task} (${quest.completed ? 'Completed' : 'Incomplete'})`;
      if (!quest.completed) {
        const button = document.createElement('button');
        button.textContent = 'Complete';
        button.onclick = () => completeQuest(quest.id);
        li.appendChild(button);
      }
      questList.appendChild(li);
    });
  }

  // Открытие магазина
  shopButton.addEventListener('click', () => {
    const shopItemsList = document.getElementById('shop-items');
    shopItemsList.innerHTML = '';
    shopItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} (${item.price} coins) `;
      const button = document.createElement('button');
      button.textContent = 'Buy';
      button.onclick = () => buyItem(item.id);
      li.appendChild(button);
      shopItemsList.appendChild(li);
    });
    shop.classList.remove('hidden');
  });

  // Закрытие магазина
  closeShopButton.addEventListener('click', () => {
    shop.classList.add('hidden');
  });

  // Инициализация интерфейса
  updateStats();
  updateQuests();

  // Привязка кнопок
  feedButton.addEventListener('click', feedPet);
  levelUpButton.addEventListener('click', levelUpPet);
});