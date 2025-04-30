const startButton = document.getElementById('start-button');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const score1Element = document.getElementById('score1');
const score2Element = document.getElementById('score2');
const gameArea = document.getElementById('game-area');

let score1 = 0;
let score2 = 0;
let isGameRunning = false;

// Начать игру
startButton.addEventListener('click', () => {
  if (isGameRunning) return;
  isGameRunning = true;
  startButton.style.display = 'none';
  score1 = 0;
  score2 = 0;
  score1Element.textContent = score1;
  score2Element.textContent = score2;
  startGame();
});

// Управление игроками
document.addEventListener('keydown', (event) => {
  if (!isGameRunning) return;

  const player1Rect = player1.getBoundingClientRect();
  const player2Rect = player2.getBoundingClientRect();
  const gameAreaRect = gameArea.getBoundingClientRect();

  switch (event.key) {
    case 'ArrowLeft': // Игрок 1 влево
      movePlayer(player1, -10, 0, gameAreaRect);
      break;
    case 'ArrowRight': // Игрок 1 вправо
      movePlayer(player1, 10, 0, gameAreaRect);
      break;
    case 'a': // Игрок 2 влево
      movePlayer(player2, -10, 0, gameAreaRect);
      break;
    case 'd': // Игрок 2 вправо
      movePlayer(player2, 10, 0, gameAreaRect);
      break;
  }
});

// Перемещение игрока
function movePlayer(player, dx, dy, gameAreaRect) {
  const rect = player.getBoundingClientRect();
  const newX = Math.min(Math.max(rect.left + dx, gameAreaRect.left), gameAreaRect.right - rect.width);
  const newY = Math.min(Math.max(rect.top + dy, gameAreaRect.top), gameAreaRect.bottom - rect.height);

  player.style.left = `${newX - gameAreaRect.left}px`;
  player.style.top = `${newY - gameAreaRect.top}px`;
}

// Запуск игры
function startGame() {
  const gameInterval = setInterval(() => {
    if (!isGameRunning) {
      clearInterval(gameInterval);
    }

    // Логика для подсчёта очков
    score1 += 1;
    score2 += 1;
    score1Element.textContent = score1;
    score2Element.textContent = score2;
  }, 1000);
}