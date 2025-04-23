document.addEventListener("DOMContentLoaded", () => {
  const egg = document.getElementById('egg');
  const pet = document.getElementById('pet');
  let crackStage = 0;

  egg.addEventListener('click', () => {
    // Добавляем класс для "шевеления" яйца
    egg.classList.add('wiggle');

    // Удаляем класс после завершения анимации
    setTimeout(() => {
      egg.classList.remove('wiggle');
    }, 800);

    crackStage++;

    if (crackStage < 3) {
      // Меняем изображение яйца на следующую стадию трещины
      egg.src = `egg_${crackStage}.png`;
    } else {
      // Скрываем яйцо и показываем питомца
      egg.style.display = 'none';

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
      pet.src = randomPetImage;
      pet.classList.add('show');

      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      const userId = user ? user.id : "demo_" + Math.floor(Math.random() * 10000);
      const petId = Math.floor(Math.random() * 500) + 1;

      fetch('/api/hatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telegram_id: userId,
          pet_id: petId
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log("Pet hatched:", data);
      });
    }
  });
});