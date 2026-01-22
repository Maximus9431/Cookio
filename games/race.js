// Элементы игры
const playerCar = document.getElementById('player-car');
const gameArea = document.getElementById('game-area');
const scoreBoard = document.getElementById('score');
const speedDisplay = document.getElementById('speed');
const livesDisplay = document.getElementById('lives');
const lapCounter = document.getElementById('current-lap');
const boostCounter = document.getElementById('boost');
const startButton = document.getElementById('start-button');
const boostButton = document.getElementById('boost-button');
const homeButton = document.getElementById('home-button');
const gameOverModal = document.getElementById('game-over-modal');
const resultTitle = document.getElementById('result-title');
const finalScoreElement = document.getElementById('final-score');
const finalTimeElement = document.getElementById('final-time');
const bestLapElement = document.getElementById('best-lap');
const restartButton = document.getElementById('restart-button');
const backToMenuButton = document.getElementById('back-to-menu');
const countdownElement = document.getElementById('countdown');
const boostEffect = document.getElementById('boost-effect');
const road = document.getElementById('road');

// Мобильные кнопки
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const boostBtnMobile = document.getElementById('boost-btn-mobile');

// Игровые переменные
let score = 0;
let lives = 3;
let speed = 0;
let maxSpeed = 200;
let acceleration = 0.5;
let isAccelerating = false;
let isGameRunning = false;
let gameInterval;
let obstacleInterval;
let bonusInterval;
let currentLane = 2; // 1-левая, 2-средняя, 3-правая
let totalLanes = 3;
let boostCount = 3;
let isBoostActive = false;
let boostTimeout;
let lap = 1;
let totalLaps = 3;
let gameTime = 0;
let lapTimes = [];
let currentLapStart = 0;
let obstacles = [];
let bonuses = [];

// Позиции полос
const lanePositions = {
  1: '20%',
  2: '50%',
  3: '80%'
};

// Фоновые элементы
function createBackground() {
  const bgContainer = document.querySelector('.background-elements');
  const clouds = ['☁️', '⛅', '🌤️', '🌥️', '🌦️', '🌧️'];
  
  for (let i = 0; i < 15; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'bg-cloud';
    cloud.textContent = clouds[Math.floor(Math.random() * clouds.length)];
    cloud.style.top = `${Math.random() * 100}%`;
    cloud.style.animationDelay = `${Math.random() * 20}s`;
    cloud.style.fontSize = `${Math.random() * 40 + 40}px`;
    bgContainer.appendChild(cloud);
  }
}

// Инициализация игры
function initGame() {
  createBackground();
  updateLives();
  updateScore();
  updateBoost();
  homeButton.style.display = 'none';
  gameOverModal.style.display = 'none';
  countdownElement.style.display = 'none';
  
  // Настройка начальной позиции
  playerCar.style.left = lanePositions[2];
  
  // Настройка мобильных кнопок
  setupMobileControls();
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
  speedDisplay.textContent = Math.round(speed);
}

// Обновление буста
function updateBoost() {
  boostCounter.textContent = boostCount;
  boostButton.disabled = boostCount === 0 || !isGameRunning || isBoostActive;
  boostBtnMobile.disabled = boostCount === 0 || !isGameRunning || isBoostActive;
}

// Создание частиц
function createParticles(x, y, count, emoji, color) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.fontSize = `${15 + Math.random() * 15}px`;
    particle.textContent = emoji;
    particle.style.color = color;
    
    particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
    particle.style.setProperty('--ty', `${Math.random() * 50}px`);
    
    gameArea.appendChild(particle);
    setTimeout(() => particle.remove(), 800);
  }
}

// Показать сообщение
function showMessage(text, color) {
  const message = document.createElement('div');
  message.textContent = text;
  message.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 36px;
    font-weight: bold;
    color: ${color};
    text-shadow: 0 0 20px ${color}80;
    z-index: 1000;
    pointer-events: none;
    animation: fadeInOut 2s ease;
  `;
  
  gameArea.appendChild(message);
  setTimeout(() => message.remove(), 2000);
}

// Обратный отсчет
function startCountdown() {
  return new Promise((resolve) => {
    countdownElement.style.display = 'flex';
    let count = 3;
    const countdownNumber = countdownElement.querySelector('.countdown-number');
    
    const countInterval = setInterval(() => {
      countdownNumber.textContent = count;
      countdownNumber.style.animation = 'none';
      setTimeout(() => {
        countdownNumber.style.animation = 'pulse 1s ease infinite';
      }, 10);
      
      if (count === 0) {
        clearInterval(countInterval);
        countdownElement.style.display = 'none';
        resolve();
      }
      count--;
    }, 1000);
  });
}

// Создание препятствия
function createObstacle() {
  if (!isGameRunning) return;
  
  const obstacleTypes = ['opponent-car', 'road-block'];
  const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  const lane = Math.floor(Math.random() * 3) + 1;
  
  const obstacle = document.createElement('div');
  obstacle.className = `obstacle ${type}`;
  obstacle.dataset.type = type;
  obstacle.dataset.lane = lane;
  
  // Иконка для типа препятствия
  if (type === 'opponent-car') {
    const pets = ['🐱', '🐰', '🐹', '🐻', '🐼', '🐨'];
    obstacle.textContent = pets[Math.floor(Math.random() * pets.length)];
  } else {
    obstacle.textContent = '🚧';
  }
  
  obstacle.style.left = lanePositions[lane];
  obstacle.style.top = '-200px';
  
  gameArea.appendChild(obstacle);
  obstacles.push(obstacle);
}

// Создание бонуса
function createBonus() {
  if (!isGameRunning) return;
  
  const bonusTypes = ['speed-bonus', 'shield-bonus', 'coin-bonus'];
  const type = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
  const lane = Math.floor(Math.random() * 3) + 1;
  
  const bonus = document.createElement('div');
  bonus.className = `obstacle bonus-item ${type}`;
  bonus.dataset.type = type;
  bonus.dataset.lane = lane;
  
  // Иконка для бонуса
  if (type === 'speed-bonus') {
    bonus.textContent = '⚡';
  } else if (type === 'shield-bonus') {
    bonus.textContent = '🛡️';
  } else {
    bonus.textContent = '💰';
  }
  
  bonus.style.left = lanePositions[lane];
  bonus.style.top = '-200px';
  
  gameArea.appendChild(bonus);
  bonuses.push(bonus);
}

// Движение объектов
function moveObjects() {
  // Движение препятствий
  obstacles.forEach((obstacle, index) => {
    const currentTop = parseFloat(obstacle.style.top);
    const newTop = currentTop + speed / 10;
    
    obstacle.style.top = `${newTop}px`;
    
    // Проверка столкновения
    if (checkCollision(playerCar, obstacle)) {
      handleCollision(obstacle);
      obstacles.splice(index, 1);
      obstacle.remove();
      return;
    }
    
    // Удаление за пределами экрана
    if (newTop > window.innerHeight) {
      obstacles.splice(index, 1);
      obstacle.remove();
    }
  });
  
  // Движение бонусов
  bonuses.forEach((bonus, index) => {
    const currentTop = parseFloat(bonus.style.top);
    const newTop = currentTop + speed / 10;
    
    bonus.style.top = `${newTop}px`;
    
    // Проверка сбора
    if (checkCollision(playerCar, bonus)) {
      handleBonusCollection(bonus);
      bonuses.splice(index, 1);
      bonus.remove();
      return;
    }
    
    // Удаление за пределами экрана
    if (newTop > window.innerHeight) {
      bonuses.splice(index, 1);
      bonus.remove();
    }
  });
}

// Проверка столкновения
function checkCollision(car, object) {
  const carRect = car.getBoundingClientRect();
  const objRect = object.getBoundingClientRect();
  
  return !(
    carRect.top > objRect.bottom ||
    carRect.bottom < objRect.top ||
    carRect.left > objRect.right ||
    carRect.right < objRect.left
  );
}

// Обработка столкновения
function handleCollision(obstacle) {
  const type = obstacle.dataset.type;
  
  if (type === 'opponent-car') {
    lives--;
    score -= 100;
    showMessage('💥 Столкновение! -100', '#FF4757');
    createParticles(carRect.left + 60, carRect.top + 100, 15, '💥', '#FF4757');
    shakeScreen();
  } else if (type === 'road-block') {
    speed = Math.max(50, speed * 0.5);
    showMessage('🚧 Замедление!', '#FF9800');
  }
  
  updateScore();
  updateLives();
  
  if (lives <= 0) {
    endGame(false);
  }
}

// Обработка сбора бонуса
function handleBonusCollection(bonus) {
  const type = bonus.dataset.type;
  const carRect = playerCar.getBoundingClientRect();
  
  switch(type) {
    case 'speed-bonus':
      speed = Math.min(maxSpeed, speed + 50);
      score += 200;
      showMessage('⚡ Ускорение! +200', '#FFD700');
      createParticles(carRect.left + 60, carRect.top + 100, 10, '⚡', '#FFD700');
      break;
      
    case 'shield-bonus':
      lives = Math.min(5, lives + 1);
      score += 150;
      showMessage('🛡️ Щит! +150', '#2196F3');
      createParticles(carRect.left + 60, carRect.top + 100, 10, '🛡️', '#2196F3');
      break;
      
    case 'coin-bonus':
      score += 500;
      showMessage('💰 Бонус! +500', '#FFD700');
      createParticles(carRect.left + 60, carRect.top + 100, 10, '💰', '#FFD700');
      break;
  }
  
  updateScore();
  updateLives();
  updateBoost();
}

// Активация ускорения
function activateBoost() {
  if (boostCount === 0 || isBoostActive) return;
  
  isBoostActive = true;
  boostCount--;
  const originalMaxSpeed = maxSpeed;
  maxSpeed = 300;
  
  // Визуальный эффект
  boostEffect.style.opacity = '1';
  
  showMessage('🚀 ТУРБО УСКОРЕНИЕ!', '#FF5722');
  
  // Сброс через 3 секунды
  boostTimeout = setTimeout(() => {
    isBoostActive = false;
    maxSpeed = originalMaxSpeed;
    boostEffect.style.opacity = '0';
    updateBoost();
  }, 3000);
  
  updateBoost();
}

// Тряска экрана
function shakeScreen() {
  gameArea.style.animation = 'shake 0.5s';
  setTimeout(() => {
    gameArea.style.animation = '';
  }, 500);
}

// Обновление круга
function updateLap() {
  if (gameTime - currentLapStart > 10) { // Каждые 10 секунд - новый круг
    lap++;
    lapTimes.push(gameTime - currentLapStart);
    currentLapStart = gameTime;
    
    if (lap > totalLaps) {
      endGame(true);
      return;
    }
    
    lapCounter.textContent = lap;
    showMessage(`🎯 Круг ${lap}!`, '#36D1DC');
    
    // Увеличение сложности
    maxSpeed += 20;
  }
}

// Завершение игры
function endGame(isWin) {
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  clearInterval(bonusInterval);
  isGameRunning = false;
  
  // Очистка объектов
  obstacles.forEach(obstacle => obstacle.remove());
  bonuses.forEach(bonus => bonus.remove());
  obstacles = [];
  bonuses = [];
  
  // Расчет статистики
  const bestLap = lapTimes.length > 0 ? Math.min(...lapTimes) : 0;
  const totalTime = gameTime;
  
  // Обновление модального окна
  finalScoreElement.textContent = score;
  finalTimeElement.textContent = formatTime(totalTime);
  bestLapElement.textContent = formatTime(bestLap);
  
  if (isWin) {
    resultTitle.textContent = '🏁 ПОБЕДА!';
    resultTitle.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
    score += 1000; // Бонус за победу
  } else {
    resultTitle.textContent = '💥 КРУШЕНИЕ';
    resultTitle.style.background = 'linear-gradient(45deg, #FF5E62, #FF4757)';
  }
  
  // Показ модального окна
  setTimeout(() => {
    gameOverModal.style.display = 'flex';
    homeButton.style.display = 'flex';
    startButton.style.display = 'flex';
    startButton.textContent = '🔄 Гонять снова';
  }, 1000);
  
  // Сохранение результата
  saveGameResult();
}

// Форматирование времени
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Сохранение результата игры
function saveGameResult() {
  const gameStats = JSON.parse(localStorage.getItem('gameStats')) || {};
  const raceStats = gameStats[4] || { score: 0, playCount: 0, totalTime: 0 };
  
  if (score > raceStats.score) {
    raceStats.score = score;
  }
  
  raceStats.playCount++;
  raceStats.totalTime += gameTime;
  
  gameStats[4] = raceStats;
  localStorage.setItem('gameStats', JSON.stringify(gameStats));
  
  // Обновление в главном меню
  if (window.opener) {
    window.opener.updateGameStats();
  }
}

// Настройка мобильных кнопок
function setupMobileControls() {
  leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveLeft();
  });
  
  rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveRight();
  });
  
  boostBtnMobile.addEventListener('touchstart', (e) => {
    e.preventDefault();
    activateBoost();
  });
}

// Движение влево
function moveLeft() {
  if (currentLane > 1) {
    currentLane--;
    playerCar.style.left = lanePositions[currentLane];
  }
}

// Движение вправо
function moveRight() {
  if (currentLane < totalLanes) {
    currentLane++;
    playerCar.style.left = lanePositions[currentLane];
  }
}

// Управление клавиатурой
document.addEventListener('keydown', (e) => {
  if (!isGameRunning) return;
  
  switch(e.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      moveLeft();
      break;
      
    case 'ArrowRight':
    case 'd':
    case 'D':
      moveRight();
      break;
      
    case ' ':
    case 'Spacebar':
      e.preventDefault();
      activateBoost();
      break;
  }
});

// Управление мышью
let isMouseDown = false;
let mouseStartX = 0;

gameArea.addEventListener('mousedown', (e) => {
  if (!isGameRunning) return;
  isMouseDown = true;
  mouseStartX = e.clientX;
});

gameArea.addEventListener('mousemove', (e) => {
  if (!isMouseDown || !isGameRunning) return;
  
  const deltaX = e.clientX - mouseStartX;
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0 && currentLane < totalLanes) {
      currentLane++;
      playerCar.style.left = lanePositions[currentLane];
    } else if (deltaX < 0 && currentLane > 1) {
      currentLane--;
      playerCar.style.left = lanePositions[currentLane];
    }
    isMouseDown = false;
  }
});

gameArea.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// Начало игры
startButton.addEventListener('click', async () => {
  if (isGameRunning) return;
  
  // Сброс переменных
  score = 0;
  lives = 3;
  speed = 0;
  currentLane = 2;
  boostCount = 3;
  lap = 1;
  gameTime = 0;
  lapTimes = [];
  currentLapStart = 0;
  maxSpeed = 200;
  
  updateScore();
  updateLives();
  updateBoost();
  lapCounter.textContent = lap;
  startButton.style.display = 'none';
  homeButton.style.display = 'none';
  playerCar.style.left = lanePositions[2];
  
  // Обратный отсчет
  await startCountdown();
  
  isGameRunning = true;
  
  // Запуск игры
  gameInterval = setInterval(() => {
    if (!isGameRunning) return;
    
    // Увеличение скорости
    if (isAccelerating) {
      speed = Math.min(maxSpeed, speed + acceleration);
    } else {
      speed = Math.max(0, speed - 0.2);
    }
    
    gameTime += 0.1;
    updateScore();
    moveObjects();
    updateLap();
  }, 100);
  
  // Генерация препятствий
  obstacleInterval = setInterval(() => {
    if (!isGameRunning) return;
    createObstacle();
  }, 1500);
  
  // Генерация бонусов
  bonusInterval = setInterval(() => {
    if (!isGameRunning) return;
    createBonus();
  }, 3000);
});

// Управление ускорением
boostButton.addEventListener('click', activateBoost);
boostBtnMobile.addEventListener('click', activateBoost);

// Ускорение при нажатии
gameArea.addEventListener('mousedown', () => {
  if (isGameRunning) isAccelerating = true;
});

gameArea.addEventListener('mouseup', () => {
  isAccelerating = false;
});

gameArea.addEventListener('touchstart', (e) => {
  if (isGameRunning) {
    e.preventDefault();
    isAccelerating = true;
  }
});

gameArea.addEventListener('touchend', () => {
  isAccelerating = false;
});

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
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
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
console.log('%c🏎️ Команды для тестирования:', 'color: #00b09b; font-size: 16px;');
console.log('%caddScore(1000) - добавить очки', 'color: #4CAF50;');
console.log('%caddLife() - добавить жизнь', 'color: #FF4757;');
console.log('%caddBoost() - добавить ускорение', 'color: #FF9800;');
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

window.addBoost = () => {
  boostCount++;
  updateBoost();
};

window.win = () => {
  endGame(true);
};