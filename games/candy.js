const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('start-button');
const homeButton = document.getElementById('home-button');
const coinSound = document.getElementById('coin-sound');
const bombSound = document.getElementById('bomb-sound');

let score = 0;
let gameInterval;
let isGameRunning = false;
let isDragging = false;

startButton.addEventListener('click', () => {
  if (isGameRunning) return;
  isGameRunning = true;
  score = 0;
  scoreBoard.textContent = score;
  startButton.style.display = 'none';
  homeButton.style.display = 'none';
  startGame();
});

document.addEventListener('mousemove', (e) => {
  const areaRect = gameArea.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  let x = e.clientX - areaRect.left - playerWidth / 2;
  x = Math.max(0, Math.min(x, areaRect.width - playerWidth));
  player.style.left = `${x}px`;
});

player.addEventListener('touchstart', (e) => {
  isDragging = true;
  movePlayer(e.touches[0]);
});

document.addEventListener('touchmove', (e) => {
  if (isDragging) movePlayer(e.touches[0]);
});

document.addEventListener('touchend', () => {
  isDragging = false;
});

function movePlayer(touch) {
  const rect = gameArea.getBoundingClientRect();
  const w = player.offsetWidth;
  const h = player.offsetHeight;

  let x = touch.clientX - rect.left - w / 2;
  let y = touch.clientY - rect.top - h / 2;

  x = Math.max(0, Math.min(x, rect.width - w));
  y = Math.max(0, Math.min(y, rect.height - h));

  player.style.left = `${x}px`;
  player.style.top = `${y}px`;
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
        scoreBoard.textContent = score;
        if (coinSound) {
          coinSound.currentTime = 0;
          coinSound.play().catch(console.warn);
        }
      } else {
        if (bombSound) {
          bombSound.currentTime = 0;
          bombSound.play().catch(console.warn);
        }
        endGame('💣 Вы проиграли!');
      }

      if (score >= 5000) {
        endGame('🎉 Победа!');
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
    const type = Math.random() < 0.7 ? 'candy' : 'dynamite';
    createFallingItem(type);
  }, 700);
}

function endGame(message) {
  clearInterval(gameInterval);
  isGameRunning = false;
  document.querySelectorAll('.falling-item').forEach(el => el.remove());
  alert(message);
  startButton.style.display = 'block';
  homeButton.style.display = 'block';
}
