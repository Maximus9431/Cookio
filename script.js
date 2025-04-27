document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabs button");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      contents.forEach(c => c.style.display = "none");
      document.getElementById(target).style.display = "block";
    });
  });

  const egg = document.getElementById('egg');
  const pet = document.getElementById('pet-image');
  const hatchText = document.getElementById('hatch-text');
  const eggContainer = document.getElementById('egg-container');
  const petNameElement = document.getElementById('pet-name');
  const moneyElement = document.getElementById('money');
  const crystalsElement = document.getElementById('crystals');

  let crackStage = 0;
  const maxCrackStage = 3;
  let isHatched = false;
  let scratches = 0; // Сколько царапин сделано
  let rotation = 0; // Угол поворота питомца

  // Список возможных имен для питомцев
  const petNames = [
    "Лаки", "Снежок", "Рекс", "Мила", "Барсик", "Джек", "Луна", "Симба", "Морфилина", "Тоби"
  ];

  // Список изображений питомцев
  const petImages = [
    "pet_1.png",
    "pet_2.png",
    "pet_3.png",
    "pet_4.png",
    "pet_5.png",
    "pet_6.png"
  ];

  // Проверяем, есть ли сохранённое имя и изображение питомца
  let savedPetName = localStorage.getItem('petName');
  let savedPetImage = localStorage.getItem('petImage');

  if (!savedPetName || !savedPetImage) {
    // Если данных нет, генерируем случайное имя и изображение
    savedPetName = petNames[Math.floor(Math.random() * petNames.length)];
    savedPetImage = petImages[Math.floor(Math.random() * petImages.length)];

    // Сохраняем данные в localStorage
    localStorage.setItem('petName', savedPetName);
    localStorage.setItem('petImage', savedPetImage);
  }

  // Устанавливаем имя питомца
  petNameElement.textContent = savedPetName;
  petNameElement.style.display = 'block';

  // Устанавливаем изображение яйца до вылупления
  pet.src = "egg_0.png";
  pet.style.display = 'block';
  pet.style.display = 'none';

  if (savedPetName && savedPetImage && isHatched) {
    // Питомец уже был сохранён — показываем его
    petNameElement.textContent = savedPetName;
    pet.src = savedPetImage;
    pet.style.display = 'block';
    egg.style.display = 'none';
    if (hatchText) hatchText.style.display = 'none';
} else {
    // Питомца нет — ждем вылупления
    egg.src = "egg_0.png";
    egg.style.display = 'block'; // Убедитесь, что яйцо отображается
    pet.style.display = 'none';
}

  function hatchEgg() {
    if (isHatched) return; // Если питомец уже вылупился, ничего не делаем
    isHatched = true;

    // Скрываем яйцо
    egg.style.display = 'none';

    // Устанавливаем изображение питомца
    pet.src = savedPetImage;
    pet.style.display = 'block'; // Делаем питомца видимым
    pet.classList.add('show'); // Добавляем класс для анимации (если есть)

    // Устанавливаем имя питомца
    petNameElement.textContent = savedPetName;
    petNameElement.style.display = 'block'; // Делаем имя видимым

    // Убираем текст "Нажми на яйцо"
    if (hatchText) {
      hatchText.style.display = 'none';
    }
  }

  // Функция добавления царапины
  function createScratch(x, y) {
    const scratch = document.createElement('div');
    scratch.className = 'scratch';
    scratch.style.left = `${x - eggContainer.offsetLeft - 15}px`;
    scratch.style.top = `${y - eggContainer.offsetTop - 15}px`;
    eggContainer.appendChild(scratch);

    setTimeout(() => {
      scratch.remove();
    }, 1000);
  }

  // Обработка движения мыши или пальца
  function handleMove(e) {
    if (isHatched) return;

    let x, y;
    if (e.touches) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    createScratch(x, y);

    scratches++;
    if (scratches % 5 === 0) { // Каждые 5 царапин продвигаем трещину
      crackStage++;
      if (crackStage < maxCrackStage) {
        egg.src = `egg_${crackStage}.png`;
      } else {
        hatchEgg();
      }
    }
  }

  egg.addEventListener('mousemove', handleMove);
  egg.addEventListener('touchmove', handleMove);

  // Добавляем обработчик клика по яйцу
  egg.addEventListener('click', () => {
    if (isHatched) return;

    crackStage++;
    if (crackStage < maxCrackStage) {
      egg.src = `egg_${crackStage}.png`;
    } else {
      hatchEgg(); // Вылупляем питомца
    }
  });

  // Добавляем обработчик для вращения питомца
  pet.addEventListener('mousemove', (event) => {
    const rect = pet.getBoundingClientRect();
    const x = event.clientX - rect.left;
    rotation = (x / rect.width) * 30 - 15; // Поворот от -15° до +15°
    pet.style.transform = `translate(-50%, -50%) rotateY(${rotation}deg)`;
});

  // Добавляем обработчик для вращения питомца (сенсорные устройства)
  pet.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    const rect = pet.getBoundingClientRect();
    const x = touch.clientX - rect.left; // Позиция касания относительно питомца
    rotation = (x / rect.width) * 360; // Рассчитываем угол поворота
    pet.style.transform = `rotateY(${rotation}deg)`; // Применяем поворот
  });

  const createBattleButton = document.getElementById('create-battle');
  const battleResult = document.getElementById('battle-result');

  // Список возможных противников
  const opponents = ["Дракон", "Гоблин", "Орк", "Волк", "Тролль"];

  // Обработчик нажатия на кнопку "Создать сражение"
  createBattleButton.addEventListener('click', () => {
    const opponent = opponents[Math.floor(Math.random() * opponents.length)]; // Случайный противник
    const result = Math.random() > 0.5 ? "победа" : "поражение"; // Случайный результат

    if (result === "победа") {
      battleResult.innerHTML = `<p>Вы победили ${opponent}! 🎉</p>`;
    } else {
      battleResult.innerHTML = `<p>Вы проиграли ${opponent}. 😢 Попробуйте снова!</p>`;
    }
  });

  const generateQuestButton = document.getElementById('generate-quest');
  const questResult = document.getElementById('quest-result');

  // Список возможных квестов
  const quests = [
    "Соберите 10 золотых монет",
    "Победите 3 врагов",
    "Найдите редкое яйцо питомца",
    "Исследуйте заброшенный замок",
    "Соберите 5 магических кристаллов",
    "Помогите деревенскому жителю найти его кота",
    "Победите босса в PvP-сражении"
  ];

  // Обработчик нажатия на кнопку "Получить квест"
  generateQuestButton.addEventListener('click', () => {
    const randomQuest = quests[Math.floor(Math.random() * quests.length)]; // Случайный выбор квеста
    questResult.innerHTML = `<p>Ваш квест: ${randomQuest}</p>`;
  });

  // Инициализация валюты
  let money = parseInt(localStorage.getItem('money')) || 0;
  let crystals = parseInt(localStorage.getItem('crystals')) || 0;

  // Функция для обновления отображения валюты
  function updateCurrencyDisplay() {
    moneyElement.textContent = `💰 Money: ${money}`;
    crystalsElement.textContent = `💎 Crystals: ${crystals}`;
  }

  // Функция для добавления денег
  function addMoney(amount) {
    money += amount;
    localStorage.setItem('money', money);
    updateCurrencyDisplay();
  }

  // Функция для добавления кристаллов
  function addCrystals(amount) {
    crystals += amount;
    localStorage.setItem('crystals', crystals);
    updateCurrencyDisplay();
  }

  // Инициализация отображения валюты
  updateCurrencyDisplay();

  // Пример: добавляем деньги и кристаллы при вылуплении питомца
  egg.addEventListener('click', () => {
    crackStage++;
    if (crackStage >= maxCrackStage) {
      addMoney(100); // Добавляем 100 денег
      addCrystals(10); // Добавляем 10 кристаллов
    }
  });

  const shopItemsContainer = document.getElementById('shop-items');

  // Список товаров
  const shopItems = [
    { id: 1, name: "🎩 Шляпа", price: 50, currency: "money", image: "hat.png" },
    { id: 2, name: "👓 Очки", price: 30, currency: "money", image: "glasses.png" },
    { id: 3, name: "🎀 Бантик", price: 20, currency: "money", image: "bow.png" },
    { id: 4, name: "💎 Кристальный шар", price: 15, currency: "crystals", image: "crystal_ball.png" },
    { id: 5, name: "🧣 Шарф", price: 40, currency: "money", image: "scarf.png" }
  ];

  // Функция для отображения товаров
  function displayShopItems() {
    shopItemsContainer.innerHTML = ""; // Очищаем контейнер
    shopItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'shop-item';
      itemElement.innerHTML = `
        <div class="shop-item-header">
          <img src="${item.image}" alt="${item.name}" class="shop-item-icon" />
          <h3>${item.name}</h3>
        </div>
        <p>Цена: ${item.price} ${item.currency === "money" ? "💰" : "💎"}</p>
        <button data-id="${item.id}">Купить</button>
      `;
      shopItemsContainer.appendChild(itemElement);
    });

    // Добавляем обработчики для кнопок "Купить"
    const buyButtons = shopItemsContainer.querySelectorAll('button');
    buyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const itemId = parseInt(button.dataset.id);
        buyItem(itemId);
      });
    });
  }

  // Функция для покупки товара
  function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.currency === "money" && money >= item.price) {
      money -= item.price;
      localStorage.setItem('money', money);
      alert(`Вы купили ${item.name}!`);
    } else if (item.currency === "crystals" && crystals >= item.price) {
      crystals -= item.price;
      localStorage.setItem('crystals', crystals);
      alert(`Вы купили ${item.name}!`);
    } else {
      alert("Недостаточно средств!");
    }

    updateCurrencyDisplay();
  }

  // Отображаем товары в магазине
  displayShopItems();

  const body = document.body;

  // Функция для создания пламени
  function createFlame(x, y) {
    const flame = document.createElement("div");
    flame.className = "flame";
    flame.style.left = `${x}px`;
    flame.style.top = `${y}px`;

    body.appendChild(flame);

    // Удаляем пламя через 500 мс
    setTimeout(() => {
      flame.remove();
    }, 500);
  }

  // Отслеживаем движение мыши
  document.addEventListener("mousemove", (event) => {
    createFlame(event.pageX, event.pageY);
  });
});
