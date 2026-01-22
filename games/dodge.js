// Элементы игры
const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const timeBoard = document.getElementById('time');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('start-button');
const homeButton = document.getElementById('home-button');
const livesDisplay = document.getElementById('lives');
const comboCounter = document.getElementById('combo-count');
const speedFill = document.querySelector('.speed-fill');
const slowmoEffect = document.getElementById('slowmo-effect');
const gameOverModal = document.getElementById('game-over-modal');
const finalTimeElement = document.getElementById('final-time');
const finalScoreElement = document.getElementById('final-score');
const resultTitle = document.getElementById('result-title');
const restartButton = document.getElementById('restart-button');
const backToMenuButton = document.getElementById('back-to-menu');

// Игровые переменные
let time = 0;
let score = 0;
let lives = 3;
let combo = 0;
let comboMultiplier = 1;
let comboTimeout;
let gameInterval, obstacleInterval;
let isGameRunning = false;
let moveSpeed = 20;
let gameSpeed = 1;
let gameLevel = 1;
let obstaclesDodged = 0;
let hasShield = false;
let isSlowmo = false;
let maxTime = localStorage.getItem('dodgeGameRecord') || 0;

// Фоновые элементы
function createBackground() {
  const bgContainer = document.querySelector('.background-elements');
  
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'bg-star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.opacity = Math.random() * 0.5 + 0.2;
    star.style.width = `${Math.random() * 3 + 1}px`;
    star.style.height = star.style.width;
    bgContainer.appendChild(star);
  }
}

// Инициализация игры
function initGame() {
  createBackground();
  updateLives();
  updateUI();
  homeButton.style.display = 'none';
  gameOverModal.style.display = 'none';
  
  // Проверяем, мобильное ли устройство
  if ('ontouchstart' in window) {
    document.querySelector('.touch-controls').style.display = 'flex';
  }
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

// Обновление интерфейса
function updateUI() {
  timeBoard.textContent = time;
  scoreBoard.textContent = score;
  comboCounter.textContent = combo;
  
  // Обновление индикатора скорости
  const speedPercentage = Math.min((gameSpeed - 1) * 100, 100);
  speedFill.style.width = `${speedPercentage}%`;
}

// Создание частиц
function createParticles(x, y, count, emoji) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.fontSize = `${15 + Math.random() * 15}px`;
    particle.textContent = emoji;
    
    particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 150}px`);
    particle.style.setProperty('--ty', `${-Math.random() * 100 - 50}px`);
    
    gameArea.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

// Создание щита
function createShield() {
  if (hasShield) return;
  
  hasShield = true;
  const shield = document.createElement('div');
  shield.className = 'shield-effect';
  player.appendChild(shield);
  
  setTimeout(() => {
    hasShield = false;
    shield.remove();
  }, 10000);
}

// Активация слоу-мо
function activateSlowmo() {
  if (isSlowmo) return;
  
  isSlowmo = true;
  slowmoEffect.style.display = 'block';
  gameSpeed = Math.max(gameSpeed * 0.5, 0.5);
  
  setTimeout(() => {
    isSlowmo = false;
    slowmoEffect.style.display = 'none';
    gameSpeed = Math.min(gameSpeed * 2, 3);
  }, 5000);
}

// Создание препятствия
function createObstacle() {
  const types = ['bomb', 'rock', 'fast', 'powerup'];
  const weights = [0.4, 0.3, 0.2, 0.1]; // Вероятности появления
  
  let random = Math.random();
  let type = 'bomb';
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      type = types[i];
      break;
    }
  }
  
  const obstacle = document.createElement('div');
  obstacle.className = `obstacle ${type}`;
  obstacle.style.left = `${Math.random() * (gameArea.offsetWidth - 70)}px`;
  
  // Установка эмодзи для каждого типа
  switch(type) {
    case 'bomb': obstacle.textContent = '💣'; break;
    case 'rock': obstacle.textContent = '🪨'; break;
    case 'fast': obstacle.textContent = '🔥'; break;
    case 'powerup': obstacle.textContent = '⭐'; break;
  }
  
  gameArea.appendChild(obstacle);
  
  const speed = type === 'fast' ? 8 : type === 'powerup' ? 4 : 5;
  let position = -100;
  
  const fallInterval = setInterval(() => {
    if (!isGameRunning) {
      obstacle.remove();
      clearInterval(fallInterval);
      return;
    }
    
    position += speed * gameSpeed;
    obstacle.style.top = `${position}px`;
    
    const obstacleRect = obstacle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    
    // Проверка столкновения
    if (
      obstacleRect.bottom >= playerRect.top &&
      obstacleRect.top <= playerRect.bottom &&
      obstacleRect.left < playerRect.right &&
      obstacleRect.right > playerRect.left
    ) {
      clearInterval(fallInterval);
      obstacle.remove();
      
      if (type === 'powerup') {
        handlePowerup(obstacleRect);
      } else {
        handleCollision(obstacleRect, type);
      }
    }
    
    // Удаление если упало за пределы
    if (position > window.innerHeight) {
      clearInterval(fallInterval);
      obstacle.remove();
      if (type !== 'powerup') {
        handleDodge();
      }
    }
  }, 16);
}

// Обработка уклонения
function handleDodge() {
  obstaclesDodged++;
  combo++;
  comboMultiplier = Math.min(Math.floor(combo / 5) + 1, 3);
  
  score += 10 * comboMultiplier;
  updateUI();
  
  // Сброс комбо через время
  clearTimeout(comboTimeout);
  comboTimeout = setTimeout(() => {
    combo = 0;
    comboMultiplier = 1;
    updateUI();
  }, 2000);
  
  // Увеличиваем сложность каждые 10 уклонений
  if (obstaclesDodged % 10 === 0) {
    increaseLevel();
  }
}

// Обработка столкновения
function handleCollision(rect, type) {
  combo = 0;
  comboMultiplier = 1;
  
  if (hasShield) {
    hasShield = false;
    player.querySelector('.shield-effect')?.remove();
    createParticles(rect.left, rect.top, 15, '✨');
    showFloatingText('Щит поглощен!', rect.left, rect.top, '#36D1DC');
    playShieldSound();
    return;
  }
  
  lives--;
  updateLives();
  
  // Эффекты в зависимости от типа
  let emoji = '💥';
  let color = '#FF4757';
  let message = '-1 жизнь';
  
  switch(type) {
    case 'bomb': emoji = '💣'; break;
    case 'rock': emoji = '🪨'; message = 'Камень попал!'; break;
    case 'fast': emoji = '🔥'; message = 'Слишком быстро!'; break;
  }
  
  createParticles(rect.left, rect.top, 20, emoji);
  showFloatingText(message, rect.left, rect.top, color);
  shakeScreen();
  
  if (type !== 'bomb') {
    playCollisionSound();
  } else {
    playExplosionSound();
  }
  
  if (lives <= 0) {
    endGame(false);
  }
}

// Обработка бонуса
function handlePowerup(rect) {
  const powerups = ['shield', 'slowmo', 'life', 'points'];
  const randomPowerup = powerups[Math.floor(Math.random() * powerups.length)];
  
  let emoji = '⭐';
  let message = '+100 очков';
  let color = '#00b09b';
  
  switch(randomPowerup) {
    case 'shield':
      createShield();
      emoji = '🛡️';
      message = 'Щит активирован!';
      break;
    case 'slowmo':
      activateSlowmo();
      emoji = '🐌';
      message = 'Замедление времени!';
      break;
    case 'life':
      lives = Math.min(lives + 1, 5);
      updateLives();
      emoji = '❤️';
      message = '+1 жизнь';
      color = '#FF4757';
      break;
    case 'points':
      score += 100;
      updateUI();
      break;
  }
  
  createParticles(rect.left, rect.top, 12, emoji);
  showFloatingText(message, rect.left, rect.top, color);
  playPowerupSound();
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
    font-size: 20px;
    font-weight: bold;
    text-shadow: 0 2px 5px rgba(0,0,0,0.5);
    z-index: 100;
    pointer-events: none;
    transition: all 1s ease-out;
  `;
  
  document.body.appendChild(floatingText);
  
  setTimeout(() => {
    floatingText.style.transform = 'translateY(-30px)';
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
  gameSpeed = Math.min(gameSpeed + 0.1, 3);
  
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
    color: #FFD700;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
    z-index: 1000;
    pointer-events: none;
    animation: fadeInOut 2s ease;
  `;
  
  gameArea.appendChild(levelUp);
  setTimeout(() => levelUp.remove(), 2000);
}

// Звуковые эффекты
function playCollisionSound() {
  const sound = new Audio();
  sound.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
  sound.volume = 0.3;
  sound.play().catch(() => {});
}

function playExplosionSound() {
  const sound = new Audio();
  sound.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
  sound.volume = 0.5;
  sound.play().catch(() => {});
}

function playPowerupSound() {
  const sound = new Audio();
  sound.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
  sound.volume = 0.4;
  sound.play().catch(() => {});
}

function playShieldSound() {
  const sound = new Audio();
  sound.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
  sound.volume = 0.4;
  sound.play().catch(() => {});
}

// Начало игры
startButton.addEventListener('click', () => {
  if (isGameRunning) return;
  
  isGameRunning = true;
  time = 0;
  score = 0;
  lives = 3;
  combo = 0;
  gameLevel = 1;
  gameSpeed = 1;
  obstaclesDodged = 0;
  hasShield = false;
  isSlowmo = false;
  
  updateUI();
  updateLives();
  startButton.style.display = 'none';
  homeButton.style.display = 'none';
  
  // Очистка старых препятствий
  document.querySelectorAll('.obstacle').forEach(item => item.remove());
  
  // Запуск игры
  gameInterval = setInterval(() => {
    if (!isGameRunning) return;
    
    time++;
    updateUI();
    
    if (time >= 120) { // 2 минуты для победы
      endGame(true);
    }
  }, 1000);
  
  obstacleInterval = setInterval(() => {
    if (!isGameRunning) return;
    
    // Динамическая частота появления
    const frequency = 800 - (gameLevel - 1) * 100;
    createObstacle();
    
    // Иногда создаем дополнительное препятствие
    if (Math.random() < 0.3) {
      setTimeout(() => createObstacle(), 200);
    }
  }, 800 / gameSpeed);
});

// Управление с клавиатуры
document.addEventListener('keydown', (e) => {
  if (!isGameRunning) return;
  
  const playerRect = player.getBoundingClientRect();
  let x = parseInt(player.style.left) || (gameArea.offsetWidth - player.offsetWidth) / 2;
  
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    x -= moveSpeed;
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    x += moveSpeed;
  }
  
  x = Math.max(10, Math.min(x, gameArea.offsetWidth - player.offsetWidth - 10));
  player.style.left = `${x}px`;
  
  // Эффект наклона
  const centerX = gameArea.offsetWidth / 2;
  const tilt = ((x + player.offsetWidth / 2 - centerX) / centerX) * 15;
  player.style.transform = `translateX(0) rotate(${tilt}deg)`;
});

// Управление для мобильных
let touchStartX = 0;
let playerStartX = 0;

gameArea.addEventListener('touchstart', (e) => {
  if (!isGameRunning) return;
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
  playerStartX = parseInt(player.style.left) || (gameArea.offsetWidth - player.offsetWidth) / 2;
});

gameArea.addEventListener('touchmove', (e) => {
  if (!isGameRunning) return;
  e.preventDefault();
  
  const touchX = e.touches[0].clientX;
  const deltaX = touchX - touchStartX;
  
  let newX = playerStartX + deltaX;
  newX = Math.max(10, Math.min(newX, gameArea.offsetWidth - player.offsetWidth - 10));
  
  player.style.left = `${newX}px`;
  
  // Эффект наклона
  const centerX = gameArea.offsetWidth / 2;
  const currentX = newX + player.offsetWidth / 2;
  const tilt = ((currentX - centerX) / centerX) * 15;
  player.style.transform = `translateX(0) rotate(${tilt}deg)`;
});

// Кнопки управления для мобильных
document.querySelectorAll('.touch-button').forEach(button => {
  button.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!isGameRunning) return;
    
    const playerRect = player.getBoundingClientRect();
    let x = parseInt(player.style.left) || (gameArea.offsetWidth - player.offsetWidth) / 2;
    
    if (button.classList.contains('left')) {
      x -= moveSpeed * 2;
    } else if (button.classList.contains('right')) {
      x += moveSpeed * 2;
    }
    
    x = Math.max(10, Math.min(x, gameArea.offsetWidth - player.offsetWidth - 10));
    player.style.left = `${x}px`;
  });
});

// Завершение игры
function endGame(isWin) {
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  isGameRunning = false;
  
  // Проверка рекорда
  if (time > maxTime) {
    maxTime = time;
    localStorage.setItem('dodgeGameRecord', time);
  }
  
  // Обновление модального окна
  finalTimeElement.textContent = `${time} сек`;
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
console.log('%c🕹️ Команды для тестирования:', 'color: #FF5E62; font-size: 16px;');
console.log('%caddLife() - добавить жизнь', 'color: #4CAF50;');
console.log('%caddShield() - активировать щит', 'color: #36D1DC;');
console.log('%cwin() - мгновенная победа', 'color: #FFD700;');

// Функции для отладки
window.addLife = () => {
  lives = Math.min(lives + 1, 5);
  updateLives();
};

window.addShield = () => {
  createShield();
};

window.win = () => {
  endGame(true);
};