const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const timeBoard = document.getElementById('time');
const startButton = document.getElementById('start-button');

let time = 0;
let gameInterval, obstacleInterval;
let isGameRunning = false;
let moveSpeed = 15;

function startGame() {
  isGameRunning = true;
  startButton.style.display = 'none';
  time = 0;
  timeBoard.textContent = '0';

  centerPlayer();

  gameInterval = setInterval(() => {
    time++;
    timeBoard.textContent = time;
    if (time >= 60) endGame('Поздравляем! Вы выиграли!');
  }, 1000);

  obstacleInterval = setInterval(createObstacle, 800);
}

function endGame(message) {
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  isGameRunning = false;
  alert(message);
  startButton.style.display = 'block';
  document.querySelectorAll('.obstacle').forEach(el => el.remove());
}

function centerPlayer() {
  const areaWidth = gameArea.offsetWidth;
  const playerWidth = player.offsetWidth;
  player.style.left = `${(areaWidth - playerWidth) / 2}px`;
}

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.left = `${Math.random() * (gameArea.offsetWidth - 48)}px`;
  gameArea.appendChild(obstacle);

  const fallCheck = setInterval(() => {
    if (!isGameRunning) return clearInterval(fallCheck);
    const oRect = obstacle.getBoundingClientRect();
    const pRect = player.getBoundingClientRect();

    if (
      oRect.bottom >= pRect.top &&
      oRect.left < pRect.right &&
      oRect.right > pRect.left
    ) {
      clearInterval(fallCheck);
      obstacle.remove();
      endGame('Вы проиграли! Вы столкнулись с бомбой.');
    }

    if (oRect.top > window.innerHeight) {
      clearInterval(fallCheck);
      obstacle.remove();
    }
  }, 40);
}

// Клавиатура
document.addEventListener('keydown', (e) => {
  if (!isGameRunning) return;
  const playerRect = player.getBoundingClientRect();
  let x = player.offsetLeft;

  if (e.key === 'ArrowLeft') x -= moveSpeed;
  if (e.key === 'ArrowRight') x += moveSpeed;

  x = Math.max(0, Math.min(x, gameArea.offsetWidth - player.offsetWidth));
  player.style.left = `${x}px`;
});

// Мобильные касания
let startX = null;

gameArea.addEventListener('touchstart', (e) => {
  if (!isGameRunning) return;
  startX = e.touches[0].clientX;
});

gameArea.addEventListener('touchmove', (e) => {
  if (!isGameRunning || startX === null) return;
  let deltaX = e.touches[0].clientX - startX;
  let x = player.offsetLeft + deltaX;
  x = Math.max(0, Math.min(x, gameArea.offsetWidth - player.offsetWidth));
  player.style.left = `${x}px`;
  startX = e.touches[0].clientX;
});

startButton.addEventListener('click', () => {
  if (!isGameRunning) startGame();
});
