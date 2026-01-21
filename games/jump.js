// Элементы игры
const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const scoreBoard = document.getElementById('score');
const highScoreBoard = document.getElementById('high-score');
const heightBoard = document.getElementById('height');
const startButton = document.getElementById('start-button');
const homeButton = document.getElementById('home-button');
const comboCounter = document.getElementById('combo-count');
const heightFill = document.querySelector('.height-fill');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreElement = document.getElementById('final-score');
const finalHeightElement = document.getElementById('final-height');
const resultTitle = document.getElementById('result-title');
const restartButton = document.getElementById('restart-button');
const backToMenuButton = document.getElementById('back-to-menu');

// Игровые переменные
let score = 0;
let highScore = localStorage.getItem('jumpHighScore') || 0;
let currentHeight = 0;
let maxHeight = 0;
let isGameRunning = false;
let platforms = [];
let bonuses = [];
let playerVelocity = 0;
let gravity = 0.5;
let jumpForce = 12;
let gameSpeed = 1;
let scrollSpeed = 2;
let combo = 0;
let comboMultiplier = 1;
let comboTimeout;
let hasShield = false;
let isRocket = false;
let playerX = 0;
let cameraY = 0;
let keys = {};
let gameLoopId;

// Фоновые элементы
function createBackground() {
  const bgContainer = document.querySelector('.background-elements');
  
  for (let i = 0; i < 10; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'bg-cloud';
    cloud.style.width = `${Math.random() * 100 + 50}px`;
    cloud.style.height = `${Math.random() * 30 + 20}px`;
    cloud.style.top = `${Math.random() * 100}%`;
    cloud.style.left = `${Math.random() * 100}%`;
    cloud.style.opacity = Math.random() * 0.3 + 0.1;
    cloud.style.animationDuration = `${Math.random() * 40 + 40}s`;
    cloud.style.animationDelay = `${Math.random() * 10}s`;
    bgContainer.appendChild(cloud);
  }
}

// Инициализация игры
function initGame() {
  createBackground();
  updateUI();
  homeButton.style.display = 'none';
  gameOverModal.style.display = 'none';
  highScoreBoard.textContent = highScore;
  
  // Проверяем, мобильное ли устройство
  if ('ontouchstart' in window) {
    document.querySelector('.touch-controls').style.display = 'flex';
  }
  
  // Устанавливаем начальную позицию игрока
  playerX = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
  player.style.left = `${playerX}px`;
  player.style.bottom = '50px';
}

// Обновление интерфейса
function updateUI() {
  scoreBoard.textContent = score;
  heightBoard.textContent = Math.floor(currentHeight);
  comboCounter.textContent = combo;
  
  // Обновление прогресс-бара высоты
  const heightPercentage = Math.min((currentHeight / 10000) * 100, 100);
  heightFill.style.height = `${heightPercentage}%`;
}

// Создание частиц следа
function createTrailParticle(x, y) {
  const particle = document.createElement('div');
  particle.className = 'trail-particle';
  particle.style.left = `${x}px`;
  particle.style.bottom = `${y}px`;
  gameArea.appendChild(particle);
  setTimeout(() => particle.remove(), 500);
}

// Создание платформы
function createPlatform(type = 'normal', x, y) {
  const platform = document.createElement('div');
  platform.className = `platform ${type}`;
  
  // Ширина в зависимости от типа
  let width = 100;
  if (type === 'breaking') width = 80;
  if (type === 'spring') width = 70;
  if (type === 'moving') width = 90;
  
  platform.style.width = `${width}px`;
  platform.style.left = `${x}px`;
  platform.style.bottom = `${y}px`;
  
  gameArea.appendChild(platform);
  platforms.push({
    element: platform,
    type: type,
    x: x,
    y: y,
    width: width,
    isBreaking: false
  });
  
  // Создание бонуса над платформой (иногда)
  if (Math.random() < 0.2 && type !== 'breaking') {
    createBonus(x + width / 2 - 15, y + 30);
  }
  
  return platform;
}

// Создание бонуса
function createBonus(x, y) {
  const bonusTypes = ['coin', 'rocket', 'shield'];
  const weights = [0.7, 0.2, 0.1];
  
  let random = Math.random();
  let type = 'coin';
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      type = bonusTypes[i];
      break;
    }
  }
  
  const bonus = document.createElement('div');
  bonus.className = `bonus ${type}`;
  bonus.textContent = type === 'coin' ? '🪙' : type === 'rocket' ? '🚀' : '🛡️';
  bonus.style.left = `${x}px`;
  bonus.style.bottom = `${y}px`;
  
  gameArea.appendChild(bonus);
  bonuses.push({
    element: bonus,
    type: type,
    x: x,
    y: y,
    collected: false
  });
}

// Обработка сбора бонуса
function collectBonus(bonus, index) {
  if (bonus.collected) return;
  
  bonus.collected = true;
  bonus.element.remove();
  
  let emoji = '✨';
  let message = '+100 очков';
  let color = '#FFD700';
  
  switch(bonus.type) {
    case 'coin':
      score += 100;
      emoji = '🪙';
      break;
    case 'rocket':
      activateRocket();
      emoji = '🚀';
      message = 'Ракета!';
      color = '#36D1DC';
      break;
    case 'shield':
      activateShield();
      emoji = '🛡️';
      message = 'Щит активирован!';
      color = '#00b09b';
      break;
  }
  
  createParticles(bonus.x, bonus.y, 10, emoji);
  showFloatingText(message, bonus.x, bonus.y, color);
  updateUI();
}

// Активация щита
function activateShield() {
  hasShield = true;
  
  // Визуальный эффект щита
  const shield = document.createElement('div');
  shield.className = 'shield-effect';
  shield.style.cssText = `
    position: absolute;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 3px dashed rgba(0, 176, 155, 0.6);
    animation: shieldRotate 2s linear infinite;
    pointer-events: none;
    z-index: 9;
    left: -10px;
    top: -10px;
  `;
  
  player.appendChild(shield);
  
  setTimeout(() => {
    hasShield = false;
    shield.remove();
  }, 10000);
}

// Активация ракеты
function activateRocket() {
  if (isRocket) return;
  
  isRocket = true;
  playerVelocity = 25;
  
  // Визуальный эффект
  const rocketEffect = document.createElement('div');
  rocketEffect.className = 'rocket-effect';
  rocketEffect.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to top, rgba(54, 209, 220, 0.3), transparent);
    pointer-events: none;
    animation: rocketBoost 0.3s ease-out;
    z-index: 7;
  `;
  
  player.appendChild(rocketEffect);
  setTimeout(() => rocketEffect.remove(), 300);
  
  setTimeout(() => {
    isRocket = false;
  }, 3000);
}

// Создание частиц
function createParticles(x, y, count, emoji) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emoji;
    particle.style.cssText = `
      position: absolute;
      left: ${x}px;
      bottom: ${y}px;
      font-size: ${15 + Math.random() * 10}px;
      pointer-events: none;
      animation: particleFloat 1s ease-out forwards;
      z-index: 8;
    `;
    
    particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
    particle.style.setProperty('--ty', `${Math.random() * 50}px`);
    
    gameArea.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

// Показать всплывающий текст
function showFloatingText(text, x, y, color) {
  const floatingText = document.createElement('div');
  floatingText.textContent = text;
  floatingText.style.cssText = `
    position: absolute;
    left: ${x}px;
    bottom: ${y}px;
    color: ${color};
    font-size: 18px;
    font-weight: bold;
    text-shadow: 0 2px 5px rgba(0,0,0,0.5);
    z-index: 100;
    pointer-events: none;
    transition: all 1s ease-out;
  `;
  
  gameArea.appendChild(floatingText);
  
  setTimeout(() => {
    floatingText.style.bottom = `${y + 50}px`;
    floatingText.style.opacity = '0';
  }, 10);
  
  setTimeout(() => floatingText.remove(), 1000);
}

// Обработка прыжка
function handleJump(platform) {
  let jumpPower = jumpForce;
  
  switch(platform.type) {
    case 'spring':
      jumpPower = 20;
      
      // Эффект пружины
      const springEffect = document.createElement('div');
      springEffect.className = 'spring-effect';
      springEffect.style.left = `${platform.x}px`;
      springEffect.style.bottom = `${platform.y}px`;
      gameArea.appendChild(springEffect);
      setTimeout(() => springEffect.remove(), 500);
      
      createParticles(platform.x + 35, platform.y, 15, '🦘');
      showFloatingText('SUPER JUMP!', platform.x, platform.y, '#FFD700');
      break;
      
    case 'breaking':
      platform.isBreaking = true;
      platform.element.style.animation = 'breakFall 0.5s ease-out forwards';
      
      setTimeout(() => {
        platform.element.remove();
        platforms = platforms.filter(p => p !== platform);
      }, 500);
      break;
      
    case 'moving':
      // Дополнительные очки за движущиеся платформы
      score += 50;
      break;
  }
  
  playerVelocity = jumpPower;
  combo++;
  comboMultiplier = Math.min(Math.floor(combo / 3) + 1, 3);
  
  score += 10 * comboMultiplier;
  updateUI();
  
  // Сброс комбо через время
  clearTimeout(comboTimeout);
  comboTimeout = setTimeout(() => {
    combo = 0;
    comboMultiplier = 1;
    updateUI();
  }, 2000);
}

// Проверка столкновений
function checkCollisions() {
  const playerRect = {
    left: playerX,
    right: playerX + player.offsetWidth,
    bottom: parseFloat(player.style.bottom) || 50,
    top: (parseFloat(player.style.bottom) || 50) + player.offsetHeight
  };
  
  // Проверка платформ
  platforms.forEach((platform, index) => {
    const platformRect = {
      left: platform.x,
      right: platform.x + platform.width,
      top: platform.y + 20,
      bottom: platform.y
    };
    
    // Проверка столкновения сверху
    if (
      playerVelocity <= 0 &&
      playerRect.bottom <= platformRect.top &&
      playerRect.bottom >= platformRect.bottom &&
      playerRect.right > platformRect.left &&
      playerRect.left < platformRect.right &&
      !platform.isBreaking
    ) {
      handleJump(platform);
    }
  });
  
  // Проверка бонусов
  bonuses.forEach((bonus, index) => {
    if (bonus.collected) return;
    
    const bonusRect = {
      left: bonus.x,
      right: bonus.x + 30,
      top: bonus.y + 30,
      bottom: bonus.y
    };
    
    if (
      playerRect.right > bonusRect.left &&
      playerRect.left < bonusRect.right &&
      playerRect.top > bonusRect.bottom &&
      playerRect.bottom < bonusRect.top
    ) {
      collectBonus(bonus, index);
    }
  });
  
  // Проверка границ экрана
  if (playerX < 0) playerX = gameArea.offsetWidth;
  if (playerX > gameArea.offsetWidth) playerX = 0;
}

// Генерация платформ
function generatePlatforms() {
  const currentTopPlatform = platforms.length > 0 ? 
    Math.max(...platforms.map(p => p.y)) : 0;
  
  // Создаем новые платформы, если нужно
  while (currentTopPlatform < cameraY + gameArea.offsetHeight + 200) {
    const types = ['normal', 'normal', 'moving', 'breaking', 'spring'];
    const weights = [0.5, 0.5, 0.2, 0.15, 0.1];
    
    let random = Math.random();
    let type = 'normal';
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        type = types[i];
        break;
      }
    }
    
    const x = Math.random() * (gameArea.offsetWidth - 100);
    const y = currentTopPlatform + Math.random() * 200 + 150;
    
    createPlatform(type, x, y);
  }
  
  // Удаляем платформы, которые далеко внизу
  platforms = platforms.filter(platform => {
    if (platform.y < cameraY - 100) {
      platform.element.remove();
      return false;
    }
    return true;
  });
  
  // Удаляем бонусы, которые далеко внизу
  bonuses = bonuses.filter(bonus => {
    if (bonus.y < cameraY - 100 || bonus.collected) {
      if (bonus.element) bonus.element.remove();
      return false;
    }
    return true;
  });
}

// Игровой цикл
function gameLoop() {
  if (!isGameRunning) return;
  
  // Физика игрока
  playerVelocity -= gravity * gameSpeed;
  let playerBottom = parseFloat(player.style.bottom) || 50;
  playerBottom += playerVelocity;
  
  // Камера следует за игроком
  if (playerBottom > cameraY + gameArea.offsetHeight * 0.3) {
    const delta = playerBottom - (cameraY + gameArea.offsetHeight * 0.3);
    cameraY += delta;
    currentHeight += delta;
    
    // Обновляем максимальную высоту
    if (currentHeight > maxHeight) {
      maxHeight = currentHeight;
    }
    
    // Прокручиваем платформы и бонусы
    platforms.forEach(platform => {
      platform.y -= delta;
      platform.element.style.bottom = `${platform.y}px`;
    });
    
    bonuses.forEach(bonus => {
      bonus.y -= delta;
      bonus.element.style.bottom = `${bonus.y}px`;
    });
  }
  
  // Если игрок падает ниже камеры
  if (playerBottom < cameraY) {
    if (hasShield) {
      hasShield = false;
      player.querySelector('.shield-effect')?.remove();
      playerBottom = cameraY + 50;
      playerVelocity = 10;
      createParticles(playerX, playerBottom, 15, '✨');
    } else {
      endGame(false);
      return;
    }
  }
  
  player.style.bottom = `${playerBottom}px`;
  
  // Движение игрока
  const moveSpeed = 8;
  if (keys.ArrowLeft || keys.a) {
    playerX -= moveSpeed;
  }
  if (keys.ArrowRight || keys.d) {
    playerX += moveSpeed;
  }
  
  player.style.left = `${playerX}px`;
  
  // Создаем частицы следа
  if (Math.random() < 0.3) {
    createTrailParticle(playerX + 35, playerBottom);
  }
  
  // Проверка столкновений
  checkCollisions();
  
  // Генерация платформ
  generatePlatforms();
  
  // Обновление интерфейса
  updateUI();
  
  // Увеличение сложности со временем
  if (currentHeight > 1000) {
    gameSpeed = Math.min(1 + (currentHeight - 1000) / 5000, 2);
  }
  
  // Продолжаем игровой цикл
  gameLoopId = requestAnimationFrame(gameLoop);
}

// Начало игры
startButton.addEventListener('click', () => {
  if (isGameRunning) return;
  
  isGameRunning = true;
  score = 0;
  currentHeight = 0;
  maxHeight = 0;
  combo = 0;
  gameSpeed = 1;
  playerVelocity = 0;
  playerX = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
  cameraY = 0;
  
  updateUI();
  startButton.style.display = 'none';
  homeButton.style.display = 'none';
  
  // Очистка старых объектов
  platforms.forEach(p => p.element.remove());
  bonuses.forEach(b => b.element.remove());
  platforms = [];
  bonuses = [];
  
  // Создание начальных платформ
  createPlatform('normal', gameArea.offsetWidth / 2 - 50, 50);
  for (let i = 1; i < 10; i++) {
    createPlatform(
      i % 3 === 0 ? 'moving' : 'normal',
      Math.random() * (gameArea.offsetWidth - 100),
      i * 150
    );
  }
  
  // Запуск игрового цикла
  gameLoop();
});

// Управление с клавиатуры
document.addEventListener('keydown', (e) => {
  if (!isGameRunning) return;
  keys[e.key] = true;
  
  // Прыжок пробелом
  if (e.code === 'Space' && playerVelocity <= 0) {
    playerVelocity = jumpForce;
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Управление для мобильных
document.querySelectorAll('.touch-button').forEach(button => {
  button.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!isGameRunning) return;
    
    if (button.classList.contains('left')) {
      keys.ArrowLeft = true;
    } else if (button.classList.contains('right')) {
      keys.ArrowRight = true;
    } else if (button.classList.contains('jump')) {
      if (playerVelocity <= 0) {
        playerVelocity = jumpForce;
      }
    }
  });
  
  button.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (button.classList.contains('left')) {
      keys.ArrowLeft = false;
    } else if (button.classList.contains('right')) {
      keys.ArrowRight = false;
    }
  });
});

// Завершение игры
function endGame(isWin) {
  isGameRunning = false;
  cancelAnimationFrame(gameLoopId);
  
  // Проверка рекорда
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('jumpHighScore', score);
  }
  
  // Обновление модального окна
  finalScoreElement.textContent = score;
  finalHeightElement.textContent = Math.floor(maxHeight);
  
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

// Добавляем дополнительные стили
const style = document.createElement('style');
style.textContent = `
  @keyframes particleFloat {
    from {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(var(--tx, 0), var(--ty, 0)) scale(0);
    }
  }
  
  @keyframes shieldRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes breakFall {
    to {
      opacity: 0;
      transform: translateY(50px) rotate(45deg);
    }
  }
`;
document.head.appendChild(style);

// Инициализация при загрузке
window.addEventListener('load', initGame);

// Консольные команды для тестирования
console.log('%c🦘 Команды для тестирования:', 'color: #FF9966; font-size: 16px;');
console.log('%caddScore(1000) - добавить очки', 'color: #4CAF50;');
console.log('%caddRocket() - активировать ракету', 'color: #36D1DC;');
console.log('%caddShield() - активировать щит', 'color: #00b09b;');

// Функции для отладки
window.addScore = (points) => {
  score += points;
  updateUI();
};

window.addRocket = () => {
  activateRocket();
};

window.addShield = () => {
  activateShield();
};