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
      pet.src = "pet_placeholder.png"; // Замените на реальное изображение питомца
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
        levelUpPet(petId); // Уровень питомца после вылупления
      });
    }
  });

  function levelUpPet(petId) {
    fetch(`/api/pet/${petId}/level-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ experience: 100 }) // Пример опыта
    })
    .then(res => res.json())
    .then(data => {
      console.log("Pet leveled up:", data);
      // Добавить анимацию роста
      pet.classList.add('level-up-animation');
      setTimeout(() => pet.classList.remove('level-up-animation'), 1000);
    });
  }
});