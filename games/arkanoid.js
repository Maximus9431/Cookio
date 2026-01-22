// Элементы игры
const gameArea = document.getElementById('game-area');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const blocksContainer = document.getElementById('blocks-container');
const bonusesContainer = document.getElementById('bonuses-container');
const effectsContainer = document.getElementById('effects-container');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const multiplierElement = document.getElementById('multiplier');
const comboElement = document.getElementById('combo');
const pauseButton = document.getElementById('pause-button');
const homeButton = document.getElementById('home-button');
const pauseOverlay = document.getElementById('pause-overlay');
const levelScreen = document.getElementById('level-screen');
const gameOverModal = document.getElementById('game-over-modal');
const tutorialOverlay = document.getElementById('tutorial-overlay');

// Бонусные слоты
const bonusSlots = [
  document.getElementById('bonus-slot-1'),
  document.getElementById('bonus-slot-2'),
  document.getElementById('bonus-slot-3')
];

// Игровые переменные
let score = 0;
let lives = 3;
let currentLevel = 1;
let multiplier = 1;
let combo = 0;
let maxCombo = 0;
let blocksDestroyed = 0;
let totalBlocks = 0;
let isGameRunning = false;
let isPaused = false;
let isLevelComplete = false;
let gameLoop;
let ballSpeed = 5;
let paddleSpeed = 15;
let ballDirection = { x: 0, y: 0 };
let activeBonuses = {};
let bonusQueue = [];
let blocks = [];
let bonuses = [];
let effects = [];

// Конфигурация уровней
const levels = [
  {
    number: 1,
    pet: '🐶',
    name: 'Собачки',
    description: 'Разбейте все блоки с собачками!',
    blocks: 15,
    target: 1000,
    layout: 'simple',
    colors: ['#4CAF50', '#FFC107']
  },
  {
    number: 2,
    pet: '🐱',
    name: 'Котики',
    description: 'Котики хотят поиграть! Соберите все бонусы.',
    blocks: 20,
    target: 2000,
    layout: 'pyramid',
    colors: ['#9C27B0', '#2196F3']
  },
  {
    number: 3,
    pet: '🐰',
    name: 'Кролики',
    description: 'Быстрые кролики! Будьте внимательнее.',
    blocks: 25,
    target: 3500,
    layout: 'wall',
    colors: ['#FF5722', '#FF9800']
  },
  {
    number: 4,
    pet: '🐻',
    name: 'Медвежата',
    description: 'Сильные медвежата имеют больше здоровья!',
    blocks: 30,
    target: 5000,
    layout: 'checker',
    colors: ['#795548', '#607D8B']
  },
  {
    number: 5,
    pet: '🐼',
    name: 'Панды',
    description: 'Босс уровень! Разбейте неразрушимые блоки.',
    blocks: 35,
    target: 7500,
    layout: 'boss',
    colors: ['#000000', '#FFFFFF']
  }
];

// Данные бонусов
const bonusTypes = [
  {
    type: 'speed',
    name: 'Ускорение',
    emoji: '⚡',
    color: 'bonus-speed',
    duration: 10000
  },
  {
    type: 'size',
    name: 'Увеличение',
    emoji: '📏',
    color: 'bonus-size',
    duration: 15000
  },
  {
    type: 'multiplier',
    name: 'Множитель',
    emoji: '✨',
    color: 'bonus-multiplier',
    duration: 20000
  },
  {
    type: 'life',
    name: 'Доп. жизнь',
    emoji: '❤️',
    color: 'bonus-life',
    duration: 0
  },
  {
    type: 'magnet',
    name: 'Магнит',
    emoji: '🧲',
    color: 'bonus-magnet',
    duration: 12000
  },
  {
    type: 'laser',
    name: 'Лазер',
    emoji: '🔫',
    color: 'bonus-laser',
    duration: 8000
  }
];

// Инициализация игры
function initGame() {
  createBackground();
  setupEventListeners();
  showTutorial();
  
  // Обновление интерфейса
  updateScore();
  updateLives();
  updateLevel();
  updateMultiplier();
  updateCombo();
  
  // Скрываем все экраны
  pauseOverlay.style.display = 'none';
  levelScreen.style.display = 'none';
  gameOverModal.style.display = 'none';
}

// Создание фоновых элементов
function createBackground() {
  const bgContainer = document.querySelector('.background-elements');
  const bricks = ['🧱', '🔳', '🔲', '⬜', '⬛', '🔶', '🔷'];
  
  for (let i = 0; i < 25; i++) {
    const brick = document.createElement('div');
    brick.className = 'bg-brick';
    brick.textContent = bricks[Math.floor(Math.random() * bricks.length)];
    brick.style.left = `${Math.random() * 100}%`;
    brick.style.animationDelay = `${Math.random() * 20}s`;
    brick.style.fontSize = `${Math.random() * 30 + 20}px`;
    brick.style.opacity = Math.random() * 0.05 + 0.02;
    bgContainer.appendChild(brick);
  }
}

// Настройка обработчиков событий
function setupEventListeners() {
  // Управление платформой мышью
  gameArea.addEventListener('mousemove', (e) => {
    if (!isGameRunning || isPaused || isLevelComplete) return;
    
    const gameRect = gameArea.getBoundingClientRect();
    const mouseX = e.clientX - gameRect.left;
    
    // Ограничиваем движение платформы в пределах игровой области
    const paddleWidth = paddle.offsetWidth;
    const maxX = gameRect.width - paddleWidth;
    let newX = mouseX - paddleWidth / 2;
    
    newX = Math.max(0, Math.min(newX, maxX));
    paddle.style.left = `${newX}px`;
  });

  // Управление платформой клавишами
  document.addEventListener('keydown', (e) => {
    if (!isGameRunning || isPaused || isLevelComplete) return;
    
    const gameRect = gameArea.getBoundingClientRect();
    const paddleWidth = paddle.offsetWidth;
    const maxX = gameRect.width - paddleWidth;
    let currentX = parseInt(paddle.style.left) || gameRect.width / 2 - paddleWidth / 2;
    
    switch(e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        currentX = Math.max(0, currentX - paddleSpeed);
        paddle.style.left = `${currentX}px`;
        break;
        
      case 'ArrowRight':
      case 'd':
      case 'D':
        currentX = Math.min(maxX, currentX + paddleSpeed);
        paddle.style.left = `${currentX}px`;
        break;
        
      case ' ':
      case 'Spacebar':
        e.preventDefault();
        togglePause();
        break;
        
      case '1':
        activateBonus(0);
        break;
        
      case '2':
        activateBonus(1);
        break;
        
      case '3':
        activateBonus(2);
        break;
    }
  });

  // Кнопки управления
  pauseButton.addEventListener('click', togglePause);
  homeButton.addEventListener('click', () => {
    window.location.href = 'game.html';
  });

  // Кнопки паузы
  document.getElementById('resume-btn').addEventListener('click', togglePause);
  document.getElementById('restart-level-btn').addEventListener('click', restartLevel);
  document.getElementById('exit-btn').addEventListener('click', () => {
    window.location.href = 'game.html';
  });

  // Кнопка начала уровня
  document.getElementById('start-level-btn').addEventListener('click', startLevel);

  // Кнопки модального окна
  document.getElementById('restart-button').addEventListener('click', restartGame);
  document.getElementById('next-level-button').addEventListener('click', nextLevel);
  document.getElementById('back-to-menu').addEventListener('click', () => {
    window.location.href = 'game.html';
  });

  // Кнопки обучения
  document.getElementById('prev-tutorial').addEventListener('click', prevTutorialStep);
  document.getElementById('next-tutorial').addEventListener('click', nextTutorialStep);
  document.getElementById('skip-tutorial').addEventListener('click', skipTutorial);

  // Обработчики для бонусных слотов
  bonusSlots.forEach((slot, index) => {
    slot.addEventListener('click', () => activateBonus(index));
  });

  // Обработчик для копирования результата
  document.getElementById('copy-result').addEventListener('click', copyGameResult);
}

// Показ обучения
function showTutorial() {
  tutorialOverlay.style.display = 'flex';
}

function nextTutorialStep() {
  const currentStep = document.querySelector('.tutorial-step.active');
  const currentStepNum = parseInt(currentStep.dataset.step);
  const totalSteps = document.querySelectorAll('.tutorial-step').length;
  
  if (currentStepNum < totalSteps) {
    currentStep.classList.remove('active');
    const nextStep = document.querySelector(`[data-step="${currentStepNum + 1}"]`);
    nextStep.classList.add('active');
    
    updateStepIndicators(currentStepNum);
  } else {
    skipTutorial();
  }
}

function prevTutorialStep() {
  const currentStep = document.querySelector('.tutorial-step.active');
  const currentStepNum = parseInt(currentStep.dataset.step);
  
  if (currentStepNum > 1) {
    currentStep.classList.remove('active');
    const prevStep = document.querySelector(`[data-step="${currentStepNum - 1}"]`);
    prevStep.classList.add('active');
    
    updateStepIndicators(currentStepNum - 2);
  }
}

function updateStepIndicators(activeIndex) {
  document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
    if (index === activeIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

function skipTutorial() {
  tutorialOverlay.style.display = 'none';
  showLevelScreen();
}

// Показ экрана уровня
function showLevelScreen() {
  const levelData = levels.find(l => l.number === currentLevel);
  if (!levelData) return;
  
  document.getElementById('level-number').textContent = levelData.number;
  document.getElementById('level-pet').textContent = levelData.pet;
  document.getElementById('level-desc').textContent = levelData.description;
  document.getElementById('level-blocks').textContent = levelData.blocks;
  document.getElementById('level-target').textContent = levelData.target.toLocaleString();
  
  levelScreen.style.display = 'flex';
}

// Начало уровня
function startLevel() {
  levelScreen.style.display = 'none';
  isGameRunning = true;
  isLevelComplete = false;
  
  // Сброс бонусов
  activeBonuses = {};
  bonusQueue = [];
  resetBonusSlots();
  
  // Создание уровня
  createLevel();
  
  // Запуск мяча
  launchBall();
  
  // Запуск игрового цикла
  gameLoop = requestAnimationFrame(updateGame);
}

// Создание уровня
function createLevel() {
  // Очищаем контейнеры
  blocksContainer.innerHTML = '';
  bonusesContainer.innerHTML = '';
  effectsContainer.innerHTML = '';
  
  blocks = [];
  bonuses = [];
  effects = [];
  
  const levelData = levels.find(l => l.number === currentLevel);
  if (!levelData) return;
  
  totalBlocks = levelData.blocks;
  blocksDestroyed = 0;
  
  // Создаем блоки в зависимости от типа уровня
  switch(levelData.layout) {
    case 'simple':
      createSimpleLayout(levelData);
      break;
    case 'pyramid':
      createPyramidLayout(levelData);
      break;
    case 'wall':
      createWallLayout(levelData);
      break;
    case 'checker':
      createCheckerLayout(levelData);
      break;
    case 'boss':
      createBossLayout(levelData);
      break;
  }
}

function createSimpleLayout(levelData) {
  const rows = 3;
  const cols = 5;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const health = Math.floor(Math.random() * 3) + 1;
      createBlock(row, col, health, levelData);
    }
  }
}

function createPyramidLayout(levelData) {
  const rows = 5;
  
  for (let row = 0; row < rows; row++) {
    const cols = row + 1;
    const offset = (5 - cols) / 2;
    
    for (let col = 0; col < cols; col++) {
      const health = Math.min(3, row + 1);
      createBlock(row, col + offset, health, levelData);
    }
  }
}

function createWallLayout(levelData) {
  const rows = 4;
  const cols = 8;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const health = 2;
      createBlock(row, col, health, levelData);
    }
  }
}

function createCheckerLayout(levelData) {
  const rows = 4;
  const cols = 8;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if ((row + col) % 2 === 0) {
        const health = Math.floor(Math.random() * 3) + 1;
        createBlock(row, col, health, levelData);
      }
    }
  }
}

function createBossLayout(levelData) {
  const rows = 4;
  const cols = 8;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 20% блоков неразрушимые
      const isUnbreakable = Math.random() < 0.2;
      const health = isUnbreakable ? 0 : Math.floor(Math.random() * 3) + 1;
      createBlock(row, col, health, levelData, isUnbreakable);
    }
  }
}

function createBlock(row, col, health, levelData, unbreakable = false) {
  const block = document.createElement('div');
  block.className = `block health-${health} ${unbreakable ? 'unbreakable' : ''}`;
  
  // 10% шанс на бонусный блок
  const hasBonus = Math.random() < 0.1;
  if (hasBonus && !unbreakable) {
    block.classList.add('bonus');
  }
  
  // Случайный питомец
  const pets = ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🐯', '🦁', '🐮', '🐷'];
  const pet = pets[Math.floor(Math.random() * pets.length)];
  
  block.innerHTML = `
    <span class="pet-emoji">${pet}</span>
    <div class="health-indicator">
      ${!unbreakable ? Array(3).fill(0).map((_, i) => 
        `<div class="health-dot ${i < health ? 'active' : ''}"></div>`
      ).join('') : ''}
    </div>
  `;
  
  block.style.gridColumn = col + 1;
  block.style.gridRow = row + 1;
  
  block.dataset.row = row;
  block.dataset.col = col;
  block.dataset.health = health;
  block.dataset.unbreakable = unbreakable;
  block.dataset.hasBonus = hasBonus;
  
  blocksContainer.appendChild(block);
  
  blocks.push({
    element: block,
    row,
    col,
    health,
    unbreakable,
    hasBonus,
    pet
  });
}

// Запуск мяча
function launchBall() {
  // Устанавливаем мяч над платформой
  const paddleRect = paddle.getBoundingClientRect();
  const gameRect = gameArea.getBoundingClientRect();
  
  ball.style.left = `${paddleRect.left + paddleRect.width / 2 - ball.offsetWidth / 2 - gameRect.left}px`;
  ball.style.top = `${paddleRect.top - ball.offsetHeight - 10 - gameRect.top}px`;
  
  // Случайное направление
  const angle = (Math.random() * Math.PI / 3) + Math.PI / 6; // 30-90 градусов
  ballDirection.x = Math.cos(angle) * ballSpeed;
  ballDirection.y = -Math.sin(angle) * ballSpeed;
}

// Игровой цикл
function updateGame() {
  if (!isGameRunning || isPaused || isLevelComplete) return;
  
  // Двигаем мяч
  moveBall();
  
  // Двигаем бонусы
  moveBonuses();
  
  // Обновляем эффекты
  updateEffects();
  
  // Проверяем столкновения
  checkCollisions();
  
  // Проверяем завершение уровня
  if (blocksDestroyed >= totalBlocks) {
    completeLevel();
    return;
  }
  
  // Проверяем потерю мяча
  const ballRect = ball.getBoundingClientRect();
  const gameRect = gameArea.getBoundingClientRect();
  
  if (ballRect.bottom > gameRect.bottom) {
    loseBall();
  }
  
  // Продолжаем цикл
  gameLoop = requestAnimationFrame(updateGame);
}

// Движение мяча
function moveBall() {
  const ballRect = ball.getBoundingClientRect();
  const gameRect = gameArea.getBoundingClientRect();
  
  // Рассчитываем новую позицию
  let newX = ballRect.left - gameRect.left + ballDirection.x;
  let newY = ballRect.top - gameRect.top + ballDirection.y;
  
  // Проверяем столкновение со стенами
  if (newX <= 0 || newX + ballRect.width >= gameRect.width) {
    ballDirection.x *= -1;
    newX = Math.max(0, Math.min(newX, gameRect.width - ballRect.width));
    createParticles(ballRect.left, ballRect.top, 5, '💥', '#FFD700');
  }
  
  if (newY <= 0) {
    ballDirection.y *= -1;
    newY = Math.max(0, newY);
    createParticles(ballRect.left, ballRect.top, 5, '💥', '#FFD700');
  }
  
  // Применяем новую позицию
  ball.style.left = `${newX}px`;
  ball.style.top = `${newY}px`;
}

// Движение бонусов
function moveBonuses() {
  const gameRect = gameArea.getBoundingClientRect();
  
  bonuses.forEach((bonus, index) => {
    const bonusRect = bonus.element.getBoundingClientRect();
    let newY = bonusRect.top - gameRect.top + 2; // Скорость падения
    
    // Проверяем столкновение с платформой
    const paddleRect = paddle.getBoundingClientRect();
    
    if (newY + bonusRect.height >= paddleRect.top - gameRect.top &&
        newY <= paddleRect.bottom - gameRect.top &&
        bonusRect.left >= paddleRect.left - gameRect.left &&
        bonusRect.right <= paddleRect.right - gameRect.left) {
      
      collectBonus(bonus, index);
      return;
    }
    
    // Удаляем бонусы, упавшие за пределы
    if (newY > gameRect.height) {
      bonus.element.remove();
      bonuses.splice(index, 1);
      return;
    }
    
    // Применяем эффект магнита
    if (activeBonuses.magnet) {
      const paddleCenter = paddleRect.left + paddleRect.width / 2;
      const bonusCenter = bonusRect.left + bonusRect.width / 2;
      const dx = paddleCenter - bonusCenter;
      
      if (Math.abs(dx) < 200) { // Радиус магнита
        bonus.element.style.left = `${parseInt(bonus.element.style.left) + Math.sign(dx) * 3}px`;
      }
    }
    
    bonus.element.style.top = `${newY}px`;
  });
}

// Обновление эффектов
function updateEffects() {
  effects.forEach((effect, index) => {
    effect.time -= 16; // 60 FPS
    
    if (effect.time <= 0) {
      effect.element.remove();
      effects.splice(index, 1);
    }
  });
}

// Проверка столкновений
function checkCollisions() {
  // Столкновение с платформой
  checkPaddleCollision();
  
  // Столкновение с блоками
  checkBlocksCollision();
}

function checkPaddleCollision() {
  const ballRect = ball.getBoundingClientRect();
  const paddleRect = paddle.getBoundingClientRect();
  const gameRect = gameArea.getBoundingClientRect();
  
  if (ballRect.bottom < paddleRect.top || 
      ballRect.top > paddleRect.bottom || 
      ballRect.right < paddleRect.left || 
      ballRect.left > paddleRect.right) {
    return;
  }
  
  // Рассчитываем точку столкновения
  const ballCenter = ballRect.left + ballRect.width / 2;
  const paddleCenter = paddleRect.left + paddleRect.width / 2;
  const relativeIntersect = (ballCenter - paddleCenter) / (paddleRect.width / 2);
  
  // Максимальный угол отскока (75 градусов)
  const maxAngle = 75 * Math.PI / 180;
  const angle = relativeIntersect * maxAngle;
  
  // Обновляем направление мяча
  ballDirection.x = Math.sin(angle) * ballSpeed;
  ballDirection.y = -Math.cos(angle) * ballSpeed;
  
  // Эффект
  createParticles(ballRect.left, ballRect.top, 10, '✨', '#FFD700');
  
  // Звук (заглушка)
  playSound('hit');
  
  // Сбрасываем комбо, если не было активных бонусов
  if (!activeBonuses.multiplier) {
    combo = 0;
    updateCombo();
  }
}

function checkBlocksCollision() {
  const ballRect = ball.getBoundingClientRect();
  const gameRect = gameArea.getBoundingClientRect();
  
  blocks.forEach((block, index) => {
    const blockRect = block.element.getBoundingClientRect();
    
    if (ballRect.bottom < blockRect.top || 
        ballRect.top > blockRect.bottom || 
        ballRect.right < blockRect.left || 
        ballRect.left > blockRect.right) {
      return;
    }
    
    // Определяем сторону столкновения
    const ballCenterX = ballRect.left + ballRect.width / 2;
    const ballCenterY = ballRect.top + ballRect.height / 2;
    const blockCenterX = blockRect.left + blockRect.width / 2;
    const blockCenterY = blockRect.top + blockRect.height / 2;
    
    const dx = ballCenterX - blockCenterX;
    const dy = ballCenterY - blockCenterY;
    const width = (ballRect.width + blockRect.width) / 2;
    const height = (ballRect.height + blockRect.height) / 2;
    const crossWidth = width * dy;
    const crossHeight = height * dx;
    
    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
      // Столкновение произошло
      if (crossWidth > crossHeight) {
        // Сверху или снизу
        ballDirection.y *= -1;
      } else {
        // Слева или справа
        ballDirection.x *= -1;
      }
      
      // Наносим урон блоку
      hitBlock(block, index);
      
      // Создаем эффект
      createParticles(blockRect.left + blockRect.width / 2, blockRect.top + blockRect.height / 2, 15, block.pet, '#FF6B6B');
      
      // Увеличиваем комбо
      combo++;
      maxCombo = Math.max(maxCombo, combo);
      updateCombo();
      
      // Добавляем очки
      const points = 100 * multiplier * (block.unbreakable ? 2 : 1);
      addScore(points);
      
      // Звук разрушения блока
      playSound('break');
    }
  });
}

// Попадание по блоку
function hitBlock(block, index) {
  if (block.unbreakable) return;
  
  block.health--;
  block.element.dataset.health = block.health;
  
  if (block.health <= 0) {
    // Уничтожаем блок
    block.element.remove();
    blocks.splice(index, 1);
    blocksDestroyed++;
    
    // Проверяем выпадение бонуса
    if (block.hasBonus) {
      createBonus(block.element.getBoundingClientRect());
    }
    
    // Обновляем прогресс
    updateProgress();
  } else {
    // Обновляем отображение здоровья
    const healthDots = block.element.querySelectorAll('.health-dot');
    healthDots.forEach((dot, i) => {
      dot.classList.toggle('active', i < block.health);
    });
    
    // Меняем цвет блока
    block.element.className = `block health-${block.health}`;
    if (block.hasBonus) {
      block.element.classList.add('bonus');
    }
  }
}

// Создание бонуса
function createBonus(position) {
  const gameRect = gameArea.getBoundingClientRect();
  const bonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
  
  const bonus = document.createElement('div');
  bonus.className = `bonus-item ${bonusType.color}`;
  bonus.innerHTML = bonusType.emoji;
  
  bonus.style.left = `${position.left - gameRect.left + position.width / 2 - 20}px`;
  bonus.style.top = `${position.top - gameRect.top}px`;
  
  bonus.dataset.type = bonusType.type;
  bonus.dataset.name = bonusType.name;
  bonus.dataset.duration = bonusType.duration;
  
  bonusesContainer.appendChild(bonus);
  
  bonuses.push({
    element: bonus,
    type: bonusType.type,
    name: bonusType.name,
    duration: bonusType.duration
  });
}

// Сбор бонуса
function collectBonus(bonus, index) {
  // Добавляем бонус в очередь
  bonusQueue.push({
    type: bonus.type,
    name: bonus.name,
    duration: bonus.duration
  });
  
  // Удаляем бонус
  bonus.element.remove();
  bonuses.splice(index, 1);
  
  // Обновляем бонусные слоты
  updateBonusSlots();
  
  // Эффект
  const paddleRect = paddle.getBoundingClientRect();
  const gameRect = gameArea.getBoundingClientRect();
  createParticles(paddleRect.left + paddleRect.width / 2, paddleRect.top - gameRect.top, 10, bonus.type === 'life' ? '❤️' : '✨', '#36D1DC');
  
  // Звук сбора бонуса
  playSound('bonus');
}

// Обновление бонусных слотов
function updateBonusSlots() {
  bonusSlots.forEach((slot, index) => {
    if (bonusQueue[index]) {
      const bonus = bonusQueue[index];
      slot.dataset.bonus = bonus.type;
      slot.innerHTML = `<div class="bonus-icon">${bonusTypes.find(b => b.type === bonus.type).emoji}</div>`;
      slot.classList.add('active');
    } else {
      slot.dataset.bonus = 'none';
      slot.innerHTML = '<div class="slot-empty">+</div>';
      slot.classList.remove('active');
    }
  });
}

// Сброс бонусных слотов
function resetBonusSlots() {
  bonusQueue = [];
  updateBonusSlots();
}

// Активация бонуса
function activateBonus(slotIndex) {
  if (!bonusQueue[slotIndex] || activeBonuses[bonusQueue[slotIndex].type]) return;
  
  const bonus = bonusQueue[slotIndex];
  
  // Применяем эффект бонуса
  applyBonusEffect(bonus);
  
  // Удаляем бонус из очереди
  bonusQueue.splice(slotIndex, 1);
  updateBonusSlots();
  
  // Создаем визуальный эффект
  const paddleRect = paddle.getBoundingClientRect();
  const gameRect = gameArea.getBoundingClientRect();
  createParticles(paddleRect.left + paddleRect.width / 2, paddleRect.top - gameRect.top, 20, '🌟', '#FFD700');
  
  // Звук активации бонуса
  playSound('activate');
}

// Применение эффекта бонуса
function applyBonusEffect(bonus) {
  activeBonuses[bonus.type] = true;
  
  switch(bonus.type) {
    case 'speed':
      ballSpeed *= 1.5;
      break;
      
    case 'size':
      paddle.style.width = '200px';
      break;
      
    case 'multiplier':
      multiplier *= 2;
      updateMultiplier();
      break;
      
    case 'life':
      lives++;
      updateLives();
      break;
      
    case 'magnet':
      // Уже обрабатывается в moveBonuses()
      break;
      
    case 'laser':
      createLaserEffect();
      break;
  }
  
  // Устанавливаем таймер для сброса бонуса (кроме жизни)
  if (bonus.duration > 0) {
    setTimeout(() => {
      removeBonusEffect(bonus.type);
    }, bonus.duration);
  }
}

// Удаление эффекта бонуса
function removeBonusEffect(bonusType) {
  if (!activeBonuses[bonusType]) return;
  
  switch(bonusType) {
    case 'speed':
      ballSpeed /= 1.5;
      break;
      
    case 'size':
      paddle.style.width = '150px';
      break;
      
    case 'multiplier':
      multiplier /= 2;
      updateMultiplier();
      break;
      
    case 'magnet':
      // Ничего не делаем
      break;
      
    case 'laser':
      // Удаляем лазеры
      document.querySelectorAll('.laser').forEach(laser => laser.remove());
      break;
  }
  
  delete activeBonuses[bonusType];
}

// Создание эффекта лазера
function createLaserEffect() {
  const paddleRect = paddle.getBoundingClientRect();
  const gameRect = gameArea.getBoundingClientRect();
  
  // Создаем два лазера по краям платформы
  for (let i = 0; i < 2; i++) {
    const laser = document.createElement('div');
    laser.className = 'laser effect';
    laser.style.cssText = `
      position: absolute;
      left: ${paddleRect.left - gameRect.left + (i === 0 ? 0 : paddleRect.width - 5)}px;
      top: 0;
      width: 5px;
      height: ${paddleRect.top - gameRect.top}px;
      background: linear-gradient(to top, #FF4081, #C2185B);
      border-radius: 2px;
      z-index: 3;
    `;
    
    effectsContainer.appendChild(laser);
    effects.push({
      element: laser,
      time: 8000
    });
  }
  
  // Уничтожаем блоки, которые касаются лазеров
  blocks.forEach((block, index) => {
    const blockRect = block.element.getBoundingClientRect();
    
    if (blockRect.bottom > paddleRect.top && 
        (blockRect.left <= paddleRect.left || blockRect.right >= paddleRect.right)) {
      hitBlock(block, index);
    }
  });
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
    particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
    
    effectsContainer.appendChild(particle);
    
    effects.push({
      element: particle,
      time: 1000
    });
  }
}

// Потеря мяча
function loseBall() {
  lives--;
  updateLives();
  
  // Эффект
  const ballRect = ball.getBoundingClientRect();
  createParticles(ballRect.left, ballRect.top, 20, '💔', '#FF4757');
  
  if (lives <= 0) {
    gameOver(false);
    return;
  }
  
  // Сбрасываем бонусы (кроме жизни)
  Object.keys(activeBonuses).forEach(bonusType => {
    if (bonusType !== 'life') {
      removeBonusEffect(bonusType);
    }
  });
  
  // Сбрасываем комбо
  combo = 0;
  updateCombo();
  
  // Перезапускаем мяч
  launchBall();
  
  // Звук потери мяча
  playSound('lose');
}

// Завершение уровня
function completeLevel() {
  isLevelComplete = true;
  cancelAnimationFrame(gameLoop);
  
  // Бонус за оставшиеся жизни
  const lifeBonus = lives * 500;
  addScore(lifeBonus);
  
  // Бонус за комбо
  const comboBonus = maxCombo * 100;
  addScore(comboBonus);
  
  // Показываем экран победы
  setTimeout(() => {
    gameOver(true);
  }, 1000);
}

// Конец игры
function gameOver(isWin) {
  isGameRunning = false;
  
  // Обновляем статистику
  document.getElementById('final-score').textContent = score.toLocaleString();
  document.getElementById('final-level').textContent = currentLevel;
  document.getElementById('final-blocks').textContent = blocksDestroyed;
  document.getElementById('final-combo').textContent = maxCombo;
  
  // Обновляем прогресс
  const progress = Math.min(100, (currentLevel / levels.length) * 100);
  document.getElementById('progress-fill').style.width = `${progress}%`;
  document.getElementById('progress-text').textContent = `${Math.round(progress)}%`;
  
  // Обновляем заголовок
  const title = document.getElementById('result-title');
  if (isWin) {
    title.textContent = '🎉 УРОВЕНЬ ПРОЙДЕН!';
    document.getElementById('next-level-button').style.display = 'flex';
    
    // Сохраняем прогресс
    saveGameResult();
  } else {
    title.textContent = '💥 ИГРА ОКОНЧЕНА';
    document.getElementById('next-level-button').style.display = 'none';
  }
  
  // Обновляем трофей
  const trophyPet = document.getElementById('trophy-pet');
  const levelData = levels.find(l => l.number === currentLevel);
  trophyPet.textContent = isWin ? levelData.pet : '💔';
  
  // Показываем модальное окно
  gameOverModal.style.display = 'flex';
}

// Следующий уровень
function nextLevel() {
  currentLevel++;
  
  if (currentLevel > levels.length) {
    currentLevel = 1;
    score = 0;
    lives = 3;
    multiplier = 1;
    maxCombo = 0;
  }
  
  updateLevel();
  gameOverModal.style.display = 'none';
  showLevelScreen();
}

// Перезапуск уровня
function restartLevel() {
  isPaused = false;
  pauseOverlay.style.display = 'none';
  
  lives = 3;
  updateLives();
  
  showLevelScreen();
}

// Перезапуск игры
function restartGame() {
  score = 0;
  lives = 3;
  currentLevel = 1;
  multiplier = 1;
  combo = 0;
  maxCombo = 0;
  
  updateScore();
  updateLives();
  updateLevel();
  updateMultiplier();
  updateCombo();
  
  gameOverModal.style.display = 'none';
  showLevelScreen();
}

// Пауза
function togglePause() {
  if (!isGameRunning || isLevelComplete) return;
  
  isPaused = !isPaused;
  
  if (isPaused) {
    cancelAnimationFrame(gameLoop);
    pauseOverlay.style.display = 'flex';
    
    // Обновляем статистику в паузе
    document.getElementById('pause-level').textContent = currentLevel;
    document.getElementById('pause-score').textContent = score.toLocaleString();
    document.getElementById('pause-blocks').textContent = `${blocksDestroyed}/${totalBlocks}`;
  } else {
    pauseOverlay.style.display = 'none';
    gameLoop = requestAnimationFrame(updateGame);
  }
}

// Обновление интерфейса
function updateScore() {
  scoreElement.textContent = score.toLocaleString();
}

function updateLives() {
  livesElement.textContent = lives;
}

function updateLevel() {
  levelElement.textContent = currentLevel;
}

function updateMultiplier() {
  multiplierElement.textContent = `x${multiplier}`;
}

function updateCombo() {
  comboElement.textContent = combo;
  if (combo >= 5) {
    comboElement.style.animation = 'pulse 0.5s infinite';
  } else {
    comboElement.style.animation = '';
  }
}

function updateProgress() {
  // Можно добавить прогресс-бар если нужно
}

function addScore(points) {
  score += Math.floor(points);
  updateScore();
}

// Звуковые эффекты (заглушки)
function playSound(type) {
  // В реальной реализации здесь были бы Audio объекты
  console.log(`Playing sound: ${type}`);
}

// Сохранение результата игры
function saveGameResult() {
  const gameStats = JSON.parse(localStorage.getItem('gameStats')) || {};
  const arkanoidStats = gameStats[6] || { score: 0, playCount: 0, totalTime: 0 };
  
  if (score > arkanoidStats.score) {
    arkanoidStats.score = score;
  }
  
  arkanoidStats.playCount++;
  // Для времени можно добавить таймер
  
  gameStats[6] = arkanoidStats;
  localStorage.setItem('gameStats', JSON.stringify(gameStats));
}

// Копирование результата
function copyGameResult() {
  const result = `🏆 Арканоид с Питомцами\n⭐ Очки: ${score.toLocaleString()}\n🎯 Уровень: ${currentLevel}\n💥 Блоков: ${blocksDestroyed}\n🔥 Комбо: ${maxCombo}`;
  
  navigator.clipboard.writeText(result).then(() => {
    const copyBtn = document.getElementById('copy-result');
    const originalHtml = copyBtn.innerHTML;
    
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    copyBtn.style.background = '#4CAF50';
    
    setTimeout(() => {
      copyBtn.innerHTML = originalHtml;
      copyBtn.style.background = '';
    }, 2000);
  });
}

// Инициализация при загрузке
window.addEventListener('load', initGame);

// Консольные команды для тестирования
console.log('%c🔶 Команды для тестирования:', 'color: #667eea; font-size: 16px;');
console.log('%caddScore(1000) - добавить очки', 'color: #4CAF50;');
console.log('%caddLife() - добавить жизнь', 'color: #FF4757;');
console.log('%cwinLevel() - мгновенно пройти уровень', 'color: #FFD700;');
console.log('%cnextLevel() - перейти на следующий уровень', 'color: #2196F3;');

// Функции для отладки
window.addScore = (points) => {
  score += points;
  updateScore();
};

window.addLife = () => {
  lives++;
  updateLives();
};

window.winLevel = () => {
  blocksDestroyed = totalBlocks;
  completeLevel();
};

window.nextLevel = () => {
  currentLevel++;
  updateLevel();
  showLevelScreen();
};