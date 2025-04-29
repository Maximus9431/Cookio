const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const timeBoard = document.getElementById('time');
const startButton = document.getElementById('start-button');

let time = 0;
let gameInterval;
let obstacleInterval;
let isGameRunning = false;

// Начать игру
startButton.addEventListener('click', () => {
  if (isGameRunning) return;
  isGameRunning = true;
  startButton.style.display = 'none';
  time = 0;
  timeBoard.textContent = time;
  startGame();
});

// Движение игрока
document.addEventListener('keydown', (e) => {
  const gameAreaRect = gameArea.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  let x = parseInt(player.style.left || gameAreaRect.width / 2);

  if (e.key === 'ArrowLeft') {
    x -= 20; // Движение влево
  } else if (e.key === 'ArrowRight') {
    x += 20; // Движение вправо
  }

  // Ограничиваем движение игрока в пределах игрового поля
  x = Math.max(0, Math.min(x, gameAreaRect.width - playerWidth));
  player.style.left = `${x}px`;
});

// Генерация препятствий
function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = `${Math.random() * 90}%`;

  gameArea.appendChild(obstacle);

  // Анимация падения
  const fallInterval = setInterval(() => {
    const obstacleRect = obstacle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Проверка столкновения с игроком
    if (
      obstacleRect.bottom >= playerRect.top &&
      obstacleRect.left < playerRect.right &&
      obstacleRect.right > playerRect.left
    ) {
      endGame('Вы проиграли! Вы столкнулись с препятствием.');
      obstacle.remove();
      clearInterval(fallInterval);
    }

    // Удаление объекта, если он вышел за пределы экрана
    if (obstacleRect.top > window.innerHeight) {
      obstacle.remove();
      clearInterval(fallInterval);
    }
  }, 50);
}

// Запуск игры
function startGame() {
  // Таймер
  gameInterval = setInterval(() => {
    time++;
    timeBoard.textContent = time;
  }, 1000);

  // Генерация препятствий
  obstacleInterval = setInterval(() => {
    createObstacle();
  }, 800); // Препятствия появляются каждые 800 мс
}

// Завершение игры
function endGame(message) {
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  isGameRunning = false;
  alert(message);
  startButton.style.display = 'block';
  document.querySelectorAll('.obstacle').forEach((obstacle) => obstacle.remove());
}