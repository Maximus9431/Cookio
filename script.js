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

  if (savedPetName && savedPetImage) {
    // Если имя и изображение питомца сохранены, отображаем их
    petNameElement.textContent = savedPetName;
    petNameElement.style.display = 'block';
    pet.src = savedPetImage;
    pet.style.display = 'block';
    egg.style.display = 'none';
    isHatched = true;
  }

  function hatchEgg() {
    if (isHatched) return;
    isHatched = true;

    egg.style.display = 'none';

    // Устанавливаем изображение питомца
    pet.src = savedPetImage;
    pet.classList.add('show');

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
      hatchEgg();
    }
  });

  // Добавляем обработчик для вращения питомца
  pet.addEventListener('mousemove', (event) => {
    const rect = pet.getBoundingClientRect();
    const x = event.clientX - rect.left; // Позиция мыши относительно питомца
    rotation = (x / rect.width) * 360; // Рассчитываем угол поворота
    pet.style.transform = `rotateY(${rotation}deg)`; // Применяем поворот
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
});
