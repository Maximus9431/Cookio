// Элементы игры
const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('start-button');
const homeButton = document.getElementById('home-button');
const livesDisplay = document.getElementById('lives');
const bonusCounter = document.getElementById('bonus-count');
const comboDisplay = document.getElementById('combo-display');
const progressFill = document.querySelector('.progress-fill');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreElement = document.getElementById('final-score');
const resultTitle = document.getElementById('result-title');
const restartButton = document.getElementById('restart-button');
const backToMenuButton = document.getElementById('back-to-menu');

// Игровые переменные
let score = 0;
let lives = 3;
let combo = 0;
let comboMultiplier = 1;
let comboTimeout;
let gameInterval;
let isGameRunning = false;
let gameSpeed = 1;
let gameLevel = 1;
let itemsCollected = 0;
let bonusItems = 0;
let maxScore = localStorage.getItem('candyGameRecord') || 0;

// Фоновые элементы
function createBackground() {
  const bgContainer = document.querySelector('.background-elements');
  const emojis = ['🍬', '🍭', '🍫', '🍡', '🍩', '🍪', '🧁', '🎂', '🍦', '🍧'];
  
  for (let i = 0; i < 25; i++) {
    const candy = document.createElement('div');
    candy.className = 'bg-candy';
    candy.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    candy.style.left = `${Math.random() * 100}%`;
    candy.style.animationDelay = `${Math.random() * 15}s`;
    candy.style.fontSize = `${Math.random() * 20 + 20}px`;
    bgContainer.appendChild(candy);
  }
}

// Инициализация игры
function initGame() {
  createBackground();
  updateLives();
  updateScore();
  homeButton.style.display = 'none';
  gameOverModal.style.display = 'none';
}

// Обновление жизней
function updateLives() {
  livesDisplay.innerHTML = '';
  for (let i = 0; i < lives; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = '❤️';
    heart.style.animationDelay = `${i * 0.2}s`;
    livesDisplay.appendChild(heart);
  }
}

// Обновление счета
function updateScore() {
  scoreBoard.textContent = score;
  bonusCounter.textContent = bonusItems;
  
  // Обновление прогресс-бара
  const progress = Math.min((score / 5000) * 100, 100);
  progressFill.style.width = `${progress}%`;
}

// Создание частиц
function createParticles(x, y, count, emoji) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.fontSize = `${20 + Math.random() * 20}px`;
    particle.textContent = emoji;
    
    particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
    particle.style.setProperty('--ty', `${-Math.random() * 150 - 50}px`);
    
    gameArea.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

// Показать комбо
function showCombo() {
  if (combo > 1) {
    comboDisplay.textContent = `x${comboMultiplier} COMBO!`;
    comboDisplay.style.opacity = '1';
    comboDisplay.style.fontSize = `${40 + combo * 5}px`;
    
    setTimeout(() => {
      comboDisplay.style.opacity = '0';
    }, 1000);
  }
}

// Создание падающего предмета
function createFallingItem(type) {
  const item = document.createElement('div');
  item.className = `falling-item ${type}`;
  item.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
  item.textContent = type === 'candy' ? '🍬' : '💣';
  
  gameArea.appendChild(item);
  
  const speed = 2 + Math.random() * 3;
  let position = -100;
  
  const fallInterval = setInterval(() => {
    if (!isGameRunning) {
      item.remove();
      clearInterval(fallInterval);
      return;
    }
    
    position += speed * gameSpeed;
    item.style.top = `${position}px`;
    
    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    
    // Проверка столкновения
    if (
      itemRect.bottom >= playerRect.top &&
      itemRect.top <= playerRect.bottom &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      clearInterval(fallInterval);
      item.remove();
      
      if (type === 'candy') {
        handleCandyCollection(itemRect);
      } else {
        handleBombHit(itemRect);
      }
    }
    
    // Удаление если упало за пределы
    if (position > window.innerHeight) {
      item.remove();
      clearInterval(fallInterval);
      if (type === 'candy') {
        combo = 0;
      }
    }
  }, 16);
}

// Обработка сбора конфеты
function handleCandyCollection(itemRect) {
  combo++;
  comboMultiplier = Math.min(Math.floor(combo / 3) + 1, 5);
  
  const points = 100 * comboMultiplier;
  score += points;
  itemsCollected++;
  bonusItems++;
  
  updateScore();
  showCombo();
  
  // Эффекты
  createParticles(itemRect.left, itemRect.top, 10, '🍬');
  showFloatingText(`+${points}`, itemRect.left, itemRect.top, '#FFD700');
  
  // Звук конфеты
  playCoinSound();
  
  // Сброс комбо через время
  clearTimeout(comboTimeout);
  comboTimeout = setTimeout(() => {
    combo = 0;
    comboMultiplier = 1;
  }, 3000);
  
  // Проверка уровня
  if (itemsCollected % 10 === 0) {
    increaseLevel();
  }
  
  // Проверка победы
  if (score >= 5000) {
    endGame(true);
  }
}

// Обработка попадания бомбы
function handleBombHit(itemRect) {
  lives--;
  combo = 0;
  comboMultiplier = 1;
  
  updateLives();
  
  // Эффекты
  createParticles(itemRect.left, itemRect.top, 15, '💥');
  showFloatingText('-1 жизнь', itemRect.left, itemRect.top, '#FF4757');
  shakeScreen();
  
  // Звук бомбы
  playBombSound();
  
  if (lives <= 0) {
    endGame(false);
  }
}

// Показать всплывающий текст
function showFloatingText(text, x, y, color) {
  const floatingText = document.createElement('div');
  floatingText.textContent = text;
  floatingText.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    color: ${color};
    font-size: 24px;
    font-weight: bold;
    text-shadow: 0 2px 5px rgba(0,0,0,0.5);
    z-index: 100;
    pointer-events: none;
    transition: all 1s ease-out;
  `;
  
  document.body.appendChild(floatingText);
  
  // Анимация
  setTimeout(() => {
    floatingText.style.transform = 'translateY(-50px)';
    floatingText.style.opacity = '0';
  }, 10);
  
  setTimeout(() => floatingText.remove(), 1000);
}

// Тряска экрана
function shakeScreen() {
  gameArea.style.animation = 'shake 0.5s';
  setTimeout(() => {
    gameArea.style.animation = '';
  }, 500);
}

// Увеличение уровня
function increaseLevel() {
  gameLevel++;
  gameSpeed = Math.min(gameSpeed + 0.1, 2.5);
  
  // Показать сообщение о новом уровне
  const levelUp = document.createElement('div');
  levelUp.textContent = `Уровень ${gameLevel}!`;
  levelUp.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    font-weight: bold;
    color: #36D1DC;
    text-shadow: 0 0 20px rgba(54, 209, 220, 0.8);
    z-index: 1000;
    pointer-events: none;
    animation: fadeInOut 2s ease;
  `;
  
  gameArea.appendChild(levelUp);
  setTimeout(() => levelUp.remove(), 2000);
}

// Звуковые эффекты
function playCoinSound() {
  const sound = new Audio();
  sound.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
  sound.volume = 0.3;
  sound.play().catch(() => {});
}

function playBombSound() {
  const sound = new Audio();
  sound.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
  sound.volume = 0.5;
  sound.play().catch(() => {});
}

// Начало игры
startButton.addEventListener('click', () => {
  if (isGameRunning) return;
  
  isGameRunning = true;
  score = 0;
  lives = 3;
  combo = 0;
  gameLevel = 1;
  gameSpeed = 1;
  itemsCollected = 0;
  bonusItems = 0;
  
  updateScore();
  updateLives();
  startButton.style.display = 'none';
  homeButton.style.display = 'none';
  
  // Очистка старых предметов
  document.querySelectorAll('.falling-item').forEach(item => item.remove());
  
  // Запуск игры
  gameInterval = setInterval(() => {
    if (!isGameRunning) return;
    
    // Динамическая сложность
    const candyChance = 0.8 - (gameLevel - 1) * 0.05;
    const type = Math.random() < candyChance ? 'candy' : 'dynamite';
    createFallingItem(type);
    
    // Иногда создаем дополнительный предмет
    if (Math.random() < 0.2) {
      setTimeout(() => createFallingItem(type), 300);
    }
  }, 800 / gameSpeed);
});

// Управление движением мыши
document.addEventListener('mousemove', (e) => {
  if (!isGameRunning) return;
  
  const gameAreaRect = gameArea.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  let x = e.clientX - gameAreaRect.left - playerWidth / 2;
  
  x = Math.max(10, Math.min(x, gameAreaRect.width - playerWidth - 10));
  player.style.left = `${x}px`;
  
  // Эффект наклона
  const tilt = ((e.clientX - gameAreaRect.left) - (gameAreaRect.width / 2)) / (gameAreaRect.width / 2) * 15;
  player.style.transform = `translateX(-50%) rotate(${tilt}deg)`;
});

// Управление на мобильных
let touchStartX = 0;
let playerStartX = 0;

player.addEventListener('touchstart', (e) => {
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
  playerStartX = player.offsetLeft;
});

player.addEventListener('touchmove', (e) => {
  if (!isGameRunning) return;
  e.preventDefault();
  
  const touchX = e.touches[0].clientX;
  const deltaX = touchX - touchStartX;
  const gameAreaRect = gameArea.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  
  let newX = playerStartX + deltaX;
  newX = Math.max(10, Math.min(newX, gameAreaRect.width - playerWidth - 10));
  
  player.style.left = `${newX}px`;
  
  // Эффект наклона
  const centerX = gameAreaRect.width / 2;
  const currentX = player.offsetLeft + playerWidth / 2;
  const tilt = ((currentX - centerX) / centerX) * 15;
  player.style.transform = `translateX(0) rotate(${tilt}deg)`;
});

// Завершение игры
function endGame(isWin) {
  clearInterval(gameInterval);
  isGameRunning = false;
  
  // Проверка рекорда
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem('candyGameRecord', score);
  }
  
  // Обновление модального окна
  finalScoreElement.textContent = score;
  
  if (isWin) {
    resultTitle.textContent = '🎉 ПОБЕДА!';
    resultTitle.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
  } else {
    resultTitle.textContent = '💥 ИГРА ОКОНЧЕНА';
    resultTitle.style.background = 'linear-gradient(45deg, #FF5E62, #FF4757)';
  }
  
  // Показ модального окна
  setTimeout(() => {
    gameOverModal.style.display = 'flex';
    homeButton.style.display = 'flex';
    startButton.style.display = 'flex';
    startButton.textContent = '🔄 Играть снова';
  }, 1000);
}

// Кнопки управления
restartButton.addEventListener('click', () => {
  gameOverModal.style.display = 'none';
  startButton.click();
});

backToMenuButton.addEventListener('click', () => {
  window.location.href = 'game.html';
});

homeButton.addEventListener('click', () => {
  window.location.href = 'game.html';
});

// Добавляем стиль для тряски
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
  }
`;
document.head.appendChild(style);

// Инициализация при загрузке
window.addEventListener('load', initGame);

// Консольные команды для тестирования
console.log('%c🍬 Команды для тестирования:', 'color: #FF5E62; font-size: 16px;');
console.log('%caddScore(1000) - добавить очки', 'color: #4CAF50;');
console.log('%caddLife() - добавить жизнь', 'color: #FF4757;');
console.log('%cwin() - мгновенная победа', 'color: #FFD700;');

// Функции для отладки
window.addScore = (points) => {
  score += points;
  updateScore();
};

window.addLife = () => {
  lives++;
  updateLives();
};

window.win = () => {
  endGame(true);
};