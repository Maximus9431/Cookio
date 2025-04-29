const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('start-button');
const homeButton = document.getElementById('home-button');

let score = 0;
let gameInterval;
let isGameRunning = false;

// Начать игру
startButton.addEventListener('click', () => {
  if (isGameRunning) return;
  isGameRunning = true;
  startButton.style.display = 'none';
  homeButton.style.display = 'none';
  score = 0;
  scoreBoard.textContent = score;
  startGame();
});

// Движение игрока
document.addEventListener('mousemove', (e) => {
  const gameAreaRect = gameArea.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  let x = e.clientX - gameAreaRect.left - playerWidth / 2;

  // Ограничиваем движение игрока в пределах игрового поля
  x = Math.max(0, Math.min(x, gameAreaRect.width - playerWidth));
  player.style.left = `${x}px`;
});

// Генерация падающих объектов
function createFallingItem(type) {
  const item = document.createElement('div');
  item.classList.add('falling-item', type);
  item.style.left = `${Math.random() * 90}%`;

  gameArea.appendChild(item);

  // Анимация падения
  const fallInterval = setInterval(() => {
    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Проверка столкновения с игроком
    if (
      itemRect.bottom >= playerRect.top &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      if (type === 'candy') {
        score += 100;
      } else if (type === 'dynamite') {
        endGame('Вы проиграли! Вы попали на бомбу.');
      }
      scoreBoard.textContent = score;

      // Проверка на победу
      if (score >= 5000) {
        endGame('Вы выиграли!');
      }

      item.remove();
      clearInterval(fallInterval);
    }

    // Удаление объекта, если он вышел за пределы экрана
    if (itemRect.top > window.innerHeight) {
      item.remove();
      clearInterval(fallInterval);
    }
  }, 50);
}

// Запуск игры
function startGame() {
  gameInterval = setInterval(() => {
    const type = Math.random() < 0.6 ? 'candy' : 'dynamite'; // 60% конфеты, 40% бомбы
    createFallingItem(type);
  }, 800);
}

// Завершение игры
function endGame(message) {
  clearInterval(gameInterval);
  isGameRunning = false;
  alert(message);
  homeButton.style.display = 'block';
  startButton.style.display = 'block';
  document.querySelectorAll('.falling-item').forEach((item) => item.remove());
}

// Добавляем обработчик события для кнопки "Домой"
homeButton.addEventListener('click', () => {
  location.href = 'game.html'; // Перенаправление на страницу game.html
});