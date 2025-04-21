const egg = document.getElementById('egg');
const pet = document.getElementById('pet');
let crackStage = 0;

egg.addEventListener('click', () => {
  crackStage++;

  if (crackStage < 3) {
    egg.src = `egg_${crackStage}.png`;
  } else {
    egg.style.display = 'none';
    pet.classList.add('show');

    // Отправим данные на сервер о том, что игрок получил питомца
    fetch('/api/hatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        telegram_id: window.Telegram.WebApp.initDataUnsafe.user.id,
        pet_id: Math.floor(Math.random() * 500) + 1
      })
    });
  }
});
