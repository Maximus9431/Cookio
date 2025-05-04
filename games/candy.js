const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('start-button');
const homeButton = document.getElementById('home-button');

// ✅ Правильные ID
const coinSound = document.getElementById('coin-sound');
const bombSound = document.getElementById('bomb-sound');

let score = 0;
let gameInterval;
let isGameRunning = false;
let isDragging = false;

startButton.addEventListener('click', () => {
  if (isGameRunning) return;
  isGameRunning = true;
  startButton.style.display = 'none';
  homeButton.style.display = 'none';
  score = 0;
  scoreBoard.textContent = score;
  startGame();
});

document.addEventListener('mousemove', (e) => {
  const gameAreaRect = gameArea.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  let x = e.clientX - gameAreaRect.left - playerWidth / 2;

  x = Math.max(0, Math.min(x, gameAreaRect.width - playerWidth));
  player.style.left = `${x}px`;
});

player.addEventListener('touchstart', (event) => {
  isDragging = true;
  movePlayer(event.touches[0]);
});

document.addEventListener('touchmove', (event) => {
  if (isDragging) {
    movePlayer(event.touches[0]);
  }
});

document.addEventListener('touchend', () => {
  isDragging = false;
});

function movePlayer(touch) {
  const rect = gameArea.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  const playerHeight = player.offsetHeight;

  const newX = Math.min(Math.max(touch.clientX - rect.left - playerWidth / 2, 0), rect.width - playerWidth);
  const newY = Math.min(Math.max(touch.clientY - rect.top - playerHeight / 2, 0), rect.height - playerHeight);

  player.style.left = `${newX}px`;
  player.style.top = `${newY}px`;
}

function createFallingItem(type) {
  const item = document.createElement('div');
  item.classList.add('falling-item', type);
  item.style.left = `${Math.random() * 90}%`;

  gameArea.appendChild(item);

  const fallInterval = setInterval(() => {
    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      itemRect.bottom >= playerRect.top &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      if (type === 'candy') {
        score += 100;

        // ✅ Звук монеты
        if (coinSound) {
          coinSound.currentTime = 0;
          coinSound.play().catch(e => console.warn('Ошибка воспроизведения звука:', e));
        }

      } else if (type === 'dynamite') {

        // 💣 Звук бомбы
        if (bombSound) {
          bombSound.currentTime = 0;
          bombSound.play().catch(e => console.warn('Ошибка воспроизведения звука:', e));
        }

        endGame('Вы проиграли! Вы попали на бомбу.');
      }

      scoreBoard.textContent = score;

      if (score >= 5000) {
        endGame('Вы выиграли!');
      }

      item.remove();
      clearInterval(fallInterval);
    }

    if (itemRect.top > window.innerHeight) {
      item.remove();
      clearInterval(fallInterval);
    }
  }, 50);
}

function startGame() {
  gameInterval = setInterval(() => {
    const type = Math.random() < 0.6 ? 'candy' : 'dynamite';
    createFallingItem(type);
  }, 800);
}

function endGame(message) {
  clearInterval(gameInterval);
  isGameRunning = false;
  alert(message);
  homeButton.style.display = 'block';
  startButton.style.display = 'block';
  document.querySelectorAll('.falling-item').forEach((item) => item.remove());
}

homeButton.addEventListener('click', () => {
  location.href = 'game.html';
});
