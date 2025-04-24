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

  // Логика вылупления
  const egg = document.getElementById('egg');
  const pet = document.getElementById('pet');
  const hatchText = document.querySelector('#pet h2'); // Находим текст
  let crackStage = 0; // Текущая стадия трещин (0 - целое яйцо, 3 - вылупление)
  const maxCrackStage = 3; // Максимальная стадия трещин
  let isHatched = false; // Флаг, чтобы предотвратить повторное вылупление

  // Добавляем обработчик движения мыши или пальца
  egg.addEventListener('mousemove', (event) => {
    handleScratch(event.clientX, event.clientY);
  });

  egg.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    handleScratch(touch.clientX, touch.clientY);
  });

  function handleScratch(x, y) {
    if (isHatched) return; // Если яйцо уже вылупилось, ничего не делаем

    // Создаём эффект царапины
    const scratch = document.createElement('div');
    scratch.classList.add('scratch');
    scratch.style.left = `${x - egg.offsetLeft}px`;
    scratch.style.top = `${y - egg.offsetTop}px`;
    egg.appendChild(scratch);

    // Увеличиваем стадию трещин
    crackStage++;
    if (crackStage < maxCrackStage) {
      egg.src = `egg_${crackStage}.png`; // Меняем изображение яйца
    } else {
      hatchEgg(); // Вылупляем яйцо
    }
  }

  function hatchEgg() {
    if (isHatched) return;
    isHatched = true;

    egg.style.display = 'none';

    const petImages = [
      "pet_1.png",
      "pet_2.png",
      "pet_3.png",
      "pet_4.png",
      "pet_5.png",
      "pet_6.png"
    ];

    const randomPetImage = petImages[Math.floor(Math.random() * petImages.length)];
    console.log("Random pet image:", randomPetImage); // Отладочный вывод
    pet.src = randomPetImage;
    pet.style.display = 'block';
    pet.classList.add('show');

    if (hatchText) {
      hatchText.style.display = 'none';
    }
  }
});
