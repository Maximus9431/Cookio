const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('start-button');
const homeButton = document.getElementById('home-button');

let score = 0;
let isGameRunning = false;
let platforms = [];
let playerVelocity = 0;
let gravity = 0.5;

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
document.addEventListener('keydown', (e) => {
  const gameAreaRect = gameArea.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  let x = parseInt(player.style.left || gameAreaRect.width / 2);

  if (e.code === 'ArrowLeft') {
    x -= 20; // Движение влево
  } else if (e.code === 'ArrowRight') {
    x += 20; // Движение вправо
  }

  // Ограничиваем движение игрока в пределах игрового поля
  x = Math.max(0, Math.min(x, gameAreaRect.width - playerWidth));
  player.style.left = `${x}px`;
});

// Создание платформы
function createPlatform(x, y) {
  const platform = document.createElement('div');
  platform.classList.add('platform');
  platform.style.left = `${x}px`;
  platform.style.bottom = `${y}px`;
  gameArea.appendChild(platform);
  platforms.push(platform);
}

// Запуск игры
function startGame() {
  // Создаем начальную платформу
  createPlatform(gameArea.offsetWidth / 2 - 50, 50);

  // Создаем дополнительные платформы
  for (let i = 1; i < 5; i++) {
    createPlatform(Math.random() * (gameArea.offsetWidth - 100), i * 150);
  }

  // Устанавливаем начальное положение игрока
  player.style.bottom = '60px';
  player.style.left = `${gameArea.offsetWidth / 2 - 25}px`;

  // Запускаем игровой цикл
  requestAnimationFrame(gameLoop);
}

// Игровой цикл
function gameLoop() {
  playerVelocity -= gravity;
  const playerBottom = parseInt(player.style.bottom || 50) + playerVelocity;
  player.style.bottom = `${playerBottom}px`;

  // Проверка столкновения с платформами
  platforms.forEach((platform) => {
    const platformRect = platform.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      playerRect.bottom >= platformRect.top &&
      playerRect.left < platformRect.right &&
      playerRect.right > platformRect.left &&
      playerVelocity < 0
    ) {
      playerVelocity = 10; // Прыжок
      score += 100; // Добавляем очки за прыжок
      scoreBoard.textContent = score;

      // Проверка на победу
      if (score >= 5000) {
        endGame('Вы выиграли!');
        return;
      }
    }
  });

  // Проверка проигрыша
  if (parseInt(player.style.bottom) <= 0) {
    endGame('Вы проиграли!');
    return;
  }

  // Двигаем платформы вниз
  platforms.forEach((platform) => {
    const platformBottom = parseInt(platform.style.bottom) - 2;
    platform.style.bottom = `${platformBottom}px`;

    // Удаляем платформы, которые вышли за пределы экрана
    if (platformBottom < 0) {
      platform.remove();
      platforms.shift();
      createPlatform(Math.random() * (gameArea.offsetWidth - 100), 600);
    }
  });

  // Продолжаем игровой цикл
  if (isGameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// Завершение игры
function endGame(message) {
  isGameRunning = false;
  alert(message);
  homeButton.style.display = 'block';
  startButton.style.display = 'block';
  platforms.forEach((platform) => platform.remove());
  platforms = [];
}