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

  let crackStage = 0;
  const maxCrackStage = 3;
  let isHatched = false;
  let scratches = 0; // Сколько царапин сделано
  let rotation = 0; // Угол поворота питомца

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
    pet.onload = () => {
      pet.classList.add('show');
    };
    pet.src = randomPetImage;
    pet.style.display = 'block';

    if (hatchText) hatchText.style.display = 'none';
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
});
