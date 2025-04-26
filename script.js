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
  const pet = document.getElementById('pet');
  const hatchText = document.querySelector('#pet h2'); // Находим текст
  let crackStage = 0; // Текущая стадия трещин (0 - целое яйцо, 3 - вылупление)
  const maxCrackStage = 3; // Максимальная стадия трещин
  let isHatched = false; // Флаг, чтобы предотвратить повторное вылупление

  // Добавляем обработчик клика по яйцу
  egg.addEventListener('click', () => {
    if (isHatched) return; // Если яйцо уже вылупилось, ничего не делаем

    // Увеличиваем стадию трещин
    crackStage++;
    if (crackStage < maxCrackStage) {
      egg.src = `egg_${crackStage}.png`; // Меняем изображение яйца
    } else {
      hatchEgg(); // Вылупляем яйцо
    }
  });

  function hatchEgg() {
    if (isHatched) return; // Если яйцо уже вылупилось, ничего не делаем
    isHatched = true; // Устанавливаем флаг

    egg.style.display = 'none'; // Скрываем яйцо

    // Массив с изображениями питомцев
    const petImages = [
      "pet_1.png",
      "pet_2.png",
      "pet_3.png",
      "pet_4.png",
      "pet_5.png",
      "pet_6.png"
    ];

    // Выбираем случайное изображение
    const randomPetImage = petImages[Math.floor(Math.random() * petImages.length)];
    console.log("Random pet image:", randomPetImage); // Отладочный вывод
    pet.src = randomPetImage; // Устанавливаем изображение питомца
    pet.style.display = 'block'; // Делаем питомца видимым
    pet.classList.add('show'); // Добавляем анимацию

    // Убираем текст
    if (hatchText) {
      hatchText.style.display = 'none';
    }
  }
});
