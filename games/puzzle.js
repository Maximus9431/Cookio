// Элементы игры
const selectionScreen = document.getElementById('selection-screen');
const gameScreen = document.getElementById('game-screen');
const completionScreen = document.getElementById('completion-screen');
const petsGrid = document.getElementById('pets-grid');
const puzzleGrid = document.getElementById('puzzle-grid');
const piecesContainer = document.getElementById('pieces-container');
const originalImage = document.getElementById('original-image');
const resultImage = document.getElementById('result-image');
const startPuzzleBtn = document.getElementById('start-puzzle-btn');
const homeButton = document.getElementById('home-button');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const hintButton = document.getElementById('hint-button');
const shuffleButton = document.getElementById('shuffle-button');
const restartButton = document.getElementById('restart-button');
const playAgainBtn = document.getElementById('play-again-btn');
const newPuzzleBtn = document.getElementById('new-puzzle-btn');
const returnToMenu = document.getElementById('return-to-menu');
const hintModal = document.getElementById('hint-modal');
const useHintBtn = document.getElementById('use-hint-btn');
const cancelHintBtn = document.getElementById('cancel-hint-btn');
const imageHint = document.querySelector('.image-hint');

// Элементы информации
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const progressElement = document.getElementById('progress');
const hintsElement = document.getElementById('hints');
const finalTimeElement = document.getElementById('final-time');
const finalMovesElement = document.getElementById('final-moves');
const finalHintsElement = document.getElementById('final-hints');
const finalScoreElement = document.getElementById('final-score');

// Игровые переменные
let selectedPet = null;
let selectedDifficulty = 'medium';
let puzzlePieces = [];
let puzzleGridCells = [];
let gridSize = 4; // 3x3, 4x4, 5x5
let currentPiece = null;
let moves = 0;
let hints = 3;
let startTime = 0;
let timerInterval = null;
let gameTime = 0;
let correctPieces = 0;
let totalPieces = 0;
let isPuzzleCompleted = false;
let originalImageVisible = false;

// Данные питомцев
const pets = [
  { id: 1, emoji: '🐶', name: 'Собачка', desc: 'Верный друг' },
  { id: 2, emoji: '🐱', name: 'Котик', desc: 'Мягкий и пушистый' },
  { id: 3, emoji: '🐰', name: 'Кролик', desc: 'Быстрый и милый' },
  { id: 4, emoji: '🐻', name: 'Медвежонок', desc: 'Сильный и добрый' },
  { id: 5, emoji: '🐼', name: 'Панда', desc: 'Черно-белый красавец' },
  { id: 6, emoji: '🦊', name: 'Лисичка', desc: 'Хитрая и рыжая' },
  { id: 7, emoji: '🐯', name: 'Тигренок', desc: 'Полосатый охотник' },
  { id: 8, emoji: '🦁', name: 'Львенок', desc: 'Царь зверей' },
  { id: 9, emoji: '🐮', name: 'Коровка', desc: 'Дает молочко' },
  { id: 10, emoji: '🐷', name: 'Поросенок', desc: 'Розовый и веселый' },
  { id: 11, emoji: '🐸', name: 'Лягушонок', desc: 'Прыгает по болоту' },
  { id: 12, emoji: '🐙', name: 'Осьминожка', desc: 'Восемь щупалец' }
];

// Инициализация игры
function initGame() {
  createBackground();
  loadPetsSelection();
  setupEventListeners();
  
  // Выбираем первого питомца по умолчанию
  selectPet(pets[0]);
  selectDifficulty('medium');
}

// Создание фоновых элементов
function createBackground() {
  const bgContainer = document.querySelector('.background-elements');
  const puzzlePieces = ['🧩', '🔷', '🔶', '🟦', '🟨', '🟩', '🟥', '🟪'];
  
  for (let i = 0; i < 20; i++) {
    const piece = document.createElement('div');
    piece.className = 'bg-puzzle';
    piece.textContent = puzzlePieces[Math.floor(Math.random() * puzzlePieces.length)];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 20}s`;
    piece.style.fontSize = `${Math.random() * 30 + 20}px`;
    piece.style.opacity = Math.random() * 0.05 + 0.02;
    bgContainer.appendChild(piece);
  }
}

// Загрузка выбора питомцев
function loadPetsSelection() {
  petsGrid.innerHTML = '';
  
  pets.forEach(pet => {
    const petCard = document.createElement('div');
    petCard.className = 'pet-card';
    petCard.dataset.petId = pet.id;
    
    petCard.innerHTML = `
      <span class="pet-emoji">${pet.emoji}</span>
      <div class="pet-name">${pet.name}</div>
      <div class="pet-desc">${pet.desc}</div>
    `;
    
    petCard.addEventListener('click', () => selectPet(pet));
    petsGrid.appendChild(petCard);
  });
}

// Выбор питомца
function selectPet(pet) {
  // Убираем выделение у всех карточек
  document.querySelectorAll('.pet-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Выделяем выбранную карточку
  const selectedCard = document.querySelector(`[data-pet-id="${pet.id}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
  
  selectedPet = pet;
  
  // Обновляем изображение в превью
  if (originalImage) {
    originalImage.innerHTML = `<span class="pet-emoji">${pet.emoji}</span>`;
  }
}

// Выбор сложности
function selectDifficulty(difficulty) {
  selectedDifficulty = difficulty;
  
  // Убираем выделение у всех кнопок
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // Выделяем выбранную кнопку
  const selectedBtn = document.querySelector(`[data-difficulty="${difficulty}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('selected');
  }
  
  // Устанавливаем размер сетки
  switch(difficulty) {
    case 'easy':
      gridSize = 3;
      break;
    case 'medium':
      gridSize = 4;
      break;
    case 'hard':
      gridSize = 5;
      break;
  }
}

// Настройка обработчиков событий
function setupEventListeners() {
  // Кнопки сложности
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectDifficulty(btn.dataset.difficulty);
    });
  });
  
  // Кнопка начала игры
  startPuzzleBtn.addEventListener('click', startGame);
  
  // Кнопка домой
  homeButton.addEventListener('click', () => {
    window.location.href = 'game.html';
  });
  
  // Кнопка назад в меню (в игре)
  backToMenuBtn.addEventListener('click', returnToSelection);
  
  // Кнопка подсказки
  hintButton.addEventListener('click', showHintModal);
  useHintBtn.addEventListener('click', useHint);
  cancelHintBtn.addEventListener('click', hideHintModal);
  
  // Кнопка перемешивания
  shuffleButton.addEventListener('click', shufflePieces);
  
  // Кнопка перезапуска
  restartButton.addEventListener('click', restartGame);
  
  // Кнопки на экране завершения
  playAgainBtn.addEventListener('click', restartGame);
  newPuzzleBtn.addEventListener('click', returnToSelection);
  returnToMenu.addEventListener('click', () => {
    window.location.href = 'game.html';
  });
  
  // Подсказка при наведении на изображение
  imageHint.addEventListener('click', showOriginalImage);
  
  // Закрытие модального окна при клике вне
  hintModal.addEventListener('click', (e) => {
    if (e.target === hintModal) {
      hideHintModal();
    }
  });
  
  // Глобальные обработчики для drag and drop
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd);
}

// Начало игры
function startGame() {
  if (!selectedPet) return;
  
  // Сброс переменных
  moves = 0;
  hints = 3;
  correctPieces = 0;
  totalPieces = gridSize * gridSize;
  isPuzzleCompleted = false;
  
  // Обновление интерфейса
  updateMoves();
  updateHints();
  updateProgress();
  
  // Создание пазла
  createPuzzle();
  
  // Запуск таймера
  startTimer();
  
  // Переключение экранов
  selectionScreen.classList.remove('active');
  gameScreen.classList.add('active');
}

// Создание пазла
function createPuzzle() {
  // Очищаем сетку и контейнер с частями
  puzzleGrid.innerHTML = '';
  piecesContainer.innerHTML = '';
  puzzleGridCells = [];
  puzzlePieces = [];
  
  // Устанавливаем размеры сетки
  puzzleGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  puzzleGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  
  // Создаем ячейки сетки
  for (let i = 0; i < totalPieces; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.index = i;
    cell.dataset.row = Math.floor(i / gridSize);
    cell.dataset.col = i % gridSize;
    
    // Добавляем номер ячейки
    const cellNumber = document.createElement('div');
    cellNumber.className = 'cell-number';
    cellNumber.textContent = i + 1;
    cell.appendChild(cellNumber);
    
    // Обработчик клика на ячейку
    cell.addEventListener('click', () => handleCellClick(i));
    
    puzzleGrid.appendChild(cell);
    puzzleGridCells.push({
      element: cell,
      pieceIndex: -1, // -1 означает пустую ячейку
      correctPieceIndex: i
    });
  }
  
  // Создаем части пазла
  for (let i = 0; i < totalPieces; i++) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.dataset.index = i;
    piece.dataset.originalIndex = i;
    piece.dataset.row = Math.floor(i / gridSize);
    piece.dataset.col = i % gridSize;
    
    // Добавляем эмодзи питомца
    const pieceEmoji = document.createElement('div');
    pieceEmoji.className = 'piece-emoji';
    pieceEmoji.textContent = selectedPet.emoji;
    piece.appendChild(pieceEmoji);
    
    // Добавляем номер части
    const pieceNumber = document.createElement('div');
    pieceNumber.className = 'piece-number';
    pieceNumber.textContent = i + 1;
    piece.appendChild(pieceNumber);
    
    // Обработчики для drag and drop
    piece.addEventListener('mousedown', (e) => startDrag(e, i));
    piece.addEventListener('touchstart', (e) => startDrag(e, i));
    
    piecesContainer.appendChild(piece);
    puzzlePieces.push({
      element: piece,
      currentIndex: i,
      originalIndex: i,
      used: false,
      placedIndex: -1
    });
  }
  
  // Перемешиваем части
  shufflePieces();
  
  // Обновляем оригинальное изображение
  originalImage.innerHTML = `<span class="pet-emoji">${selectedPet.emoji}</span>`;
}

// Перемешивание частей
function shufflePieces() {
  if (isPuzzleCompleted) return;
  
  // Сбрасываем все размещения
  puzzleGridCells.forEach(cell => {
    cell.pieceIndex = -1;
    cell.element.classList.remove('filled', 'correct', 'wrong');
    cell.element.innerHTML = `<div class="cell-number">${parseInt(cell.element.dataset.index) + 1}</div>`;
  });
  
  puzzlePieces.forEach(piece => {
    piece.used = false;
    piece.placedIndex = -1;
    piece.element.classList.remove('used');
    piece.element.style.opacity = '1';
  });
  
  // Создаем массив индексов и перемешиваем его
  let indices = Array.from({length: totalPieces}, (_, i) => i);
  indices = shuffleArray(indices);
  
  // Обновляем порядок частей в контейнере
  piecesContainer.innerHTML = '';
  indices.forEach((newIndex, oldIndex) => {
    const piece = puzzlePieces[oldIndex];
    piece.currentIndex = newIndex;
    piecesContainer.appendChild(piece.element);
  });
  
  correctPieces = 0;
  updateProgress();
}

// Перемешивание массива (алгоритм Фишера-Йетса)
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Drag and Drop
function startDrag(e, pieceIndex) {
  if (isPuzzleCompleted || puzzlePieces[pieceIndex].used) return;
  
  e.preventDefault();
  currentPiece = pieceIndex;
  
  const piece = puzzlePieces[pieceIndex].element;
  piece.classList.add('dragging');
  
  // Для мыши
  if (e.type === 'mousedown') {
    piece.style.position = 'fixed';
    piece.style.zIndex = '1000';
    updatePiecePosition(e.clientX, e.clientY, piece);
  }
  // Для touch
  else if (e.type === 'touchstart') {
    const touch = e.touches[0];
    piece.style.position = 'fixed';
    piece.style.zIndex = '1000';
    updatePiecePosition(touch.clientX, touch.clientY, piece);
  }
}

function handleMouseMove(e) {
  if (currentPiece === null) return;
  
  const piece = puzzlePieces[currentPiece].element;
  updatePiecePosition(e.clientX, e.clientY, piece);
}

function handleTouchMove(e) {
  if (currentPiece === null) return;
  
  e.preventDefault();
  const touch = e.touches[0];
  const piece = puzzlePieces[currentPiece].element;
  updatePiecePosition(touch.clientX, touch.clientY, piece);
}

function updatePiecePosition(x, y, piece) {
  const rect = piece.getBoundingClientRect();
  piece.style.left = `${x - rect.width / 2}px`;
  piece.style.top = `${y - rect.height / 2}px`;
}

function handleMouseUp() {
  if (currentPiece === null) return;
  
  const piece = puzzlePieces[currentPiece];
  piece.element.classList.remove('dragging');
  piece.element.style.position = '';
  piece.element.style.left = '';
  piece.element.style.top = '';
  piece.element.style.zIndex = '';
  
  // Проверяем, над какой ячейкой отпустили
  const cells = document.elementsFromPoint(
    piece.element.getBoundingClientRect().left + piece.element.offsetWidth / 2,
    piece.element.getBoundingClientRect().top + piece.element.offsetHeight / 2
  );
  
  const gridCell = cells.find(el => el.classList.contains('grid-cell'));
  if (gridCell) {
    const cellIndex = parseInt(gridCell.dataset.index);
    placePiece(currentPiece, cellIndex);
  }
  
  currentPiece = null;
}

function handleTouchEnd() {
  if (currentPiece === null) return;
  
  const piece = puzzlePieces[currentPiece];
  piece.element.classList.remove('dragging');
  piece.element.style.position = '';
  piece.element.style.left = '';
  piece.element.style.top = '';
  piece.element.style.zIndex = '';
  
  // Для touch событий нужно использовать document.elementFromPoint
  const rect = piece.element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const element = document.elementFromPoint(centerX, centerY);
  if (element && element.classList.contains('grid-cell')) {
    const cellIndex = parseInt(element.dataset.index);
    placePiece(currentPiece, cellIndex);
  }
  
  currentPiece = null;
}

// Клик на ячейку
function handleCellClick(cellIndex) {
  if (currentPiece !== null || isPuzzleCompleted) return;
  
  // Если ячейка уже занята, убираем часть обратно
  if (puzzleGridCells[cellIndex].pieceIndex !== -1) {
    const pieceIndex = puzzleGridCells[cellIndex].pieceIndex;
    returnPiece(pieceIndex, cellIndex);
    return;
  }
  
  // Ищем первую неиспользованную часть
  const unusedPiece = puzzlePieces.find(p => !p.used);
  if (unusedPiece) {
    const pieceIndex = unusedPiece.currentIndex;
    placePiece(pieceIndex, cellIndex);
  }
}

// Размещение части на ячейке
function placePiece(pieceIndex, cellIndex) {
  const piece = puzzlePieces[pieceIndex];
  const cell = puzzleGridCells[cellIndex];
  
  // Если часть уже использована или ячейка уже занята
  if (piece.used || cell.pieceIndex !== -1) return;
  
  // Если часть уже была размещена где-то, убираем ее оттуда
  if (piece.placedIndex !== -1) {
    const oldCell = puzzleGridCells[piece.placedIndex];
    oldCell.pieceIndex = -1;
    oldCell.element.classList.remove('filled', 'correct', 'wrong');
    oldCell.element.innerHTML = `<div class="cell-number">${parseInt(oldCell.element.dataset.index) + 1}</div>`;
  }
  
  // Размещаем часть на новой ячейке
  piece.used = true;
  piece.placedIndex = cellIndex;
  cell.pieceIndex = pieceIndex;
  
  // Добавляем эмодзи в ячейку
  cell.element.classList.add('filled');
  cell.element.innerHTML = `
    <div class="piece-emoji">${selectedPet.emoji}</div>
    <div class="cell-number">${cellIndex + 1}</div>
  `;
  
  // Проверяем правильность размещения
  const isCorrect = piece.originalIndex === cell.correctPieceIndex;
  if (isCorrect) {
    cell.element.classList.add('correct');
    cell.element.classList.remove('wrong');
    correctPieces++;
  } else {
    cell.element.classList.add('wrong');
    cell.element.classList.remove('correct');
  }
  
  // Обновляем часть
  piece.element.classList.add('used');
  piece.element.style.opacity = '0.3';
  
  // Обновляем статистику
  moves++;
  updateMoves();
  updateProgress();
  
  // Проверяем завершение пазла
  checkPuzzleCompletion();
}

// Возврат части обратно в контейнер
function returnPiece(pieceIndex, cellIndex) {
  const piece = puzzlePieces[pieceIndex];
  const cell = puzzleGridCells[cellIndex];
  
  if (!piece.used || cell.pieceIndex !== pieceIndex) return;
  
  // Убираем часть с ячейки
  piece.used = false;
  piece.placedIndex = -1;
  cell.pieceIndex = -1;
  
  cell.element.classList.remove('filled', 'correct', 'wrong');
  cell.element.innerHTML = `<div class="cell-number">${cellIndex + 1}</div>`;
  
  // Возвращаем часть в контейнер
  piece.element.classList.remove('used');
  piece.element.style.opacity = '1';
  
  // Если часть была размещена правильно, уменьшаем счетчик правильных
  if (piece.originalIndex === cell.correctPieceIndex) {
    correctPieces--;
  }
  
  moves++;
  updateMoves();
  updateProgress();
}

// Проверка завершения пазла
function checkPuzzleCompletion() {
  if (correctPieces === totalPieces) {
    isPuzzleCompleted = true;
    clearInterval(timerInterval);
    setTimeout(showCompletionScreen, 1000);
  }
}

// Показ экрана завершения
function showCompletionScreen() {
  // Сохраняем результат
  saveGameResult();
  
  // Обновляем статистику
  finalTimeElement.textContent = timerElement.textContent;
  finalMovesElement.textContent = moves;
  finalHintsElement.textContent = 3 - hints;
  
  // Рассчитываем оценку
  const timeScore = Math.max(0, 100 - gameTime * 0.5);
  const movesScore = Math.max(0, 100 - moves * 2);
  const hintsPenalty = (3 - hints) * 10;
  const totalScore = Math.round((timeScore + movesScore) / 2 - hintsPenalty);
  finalScoreElement.textContent = `${Math.max(0, totalScore)}/100`;
  
  // Обновляем изображение результата
  resultImage.innerHTML = `<span class="pet-emoji">${selectedPet.emoji}</span>`;
  
  // Создаем конфетти
  createConfetti();
  
  // Переключаем экраны
  gameScreen.classList.remove('active');
  completionScreen.classList.add('active');
}

// Сохранение результата игры
function saveGameResult() {
  const gameStats = JSON.parse(localStorage.getItem('gameStats')) || {};
  const puzzleStats = gameStats[5] || { score: 0, playCount: 0, totalTime: 0 };
  
  // Рассчитываем очки для сохранения
  const timeScore = Math.max(0, 100 - gameTime * 0.5);
  const movesScore = Math.max(0, 100 - moves * 2);
  const totalScore = Math.round((timeScore + movesScore) / 2);
  
  if (totalScore > puzzleStats.score) {
    puzzleStats.score = totalScore;
  }
  
  puzzleStats.playCount++;
  puzzleStats.totalTime += gameTime;
  
  gameStats[5] = puzzleStats;
  localStorage.setItem('gameStats', JSON.stringify(gameStats));
}

// Создание конфетти
function createConfetti() {
  const colors = ['#FFD700', '#FFA500', '#FF6347', '#4CAF50', '#2196F3', '#9C27B0'];
  const container = document.querySelector('.confetti-container');
  container.innerHTML = '';
  
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 5}s`;
    confetti.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
    
    // Разные формы
    if (Math.random() > 0.5) {
      confetti.style.borderRadius = '50%';
    }
    
    // Разные размеры
    const size = Math.random() * 10 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    container.appendChild(confetti);
  }
}

// Таймер
function startTimer() {
  startTime = Date.now();
  gameTime = 0;
  
  if (timerInterval) clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    gameTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// Обновление количества ходов
function updateMoves() {
  movesElement.textContent = moves;
}

// Обновление подсказок
function updateHints() {
  hintsElement.textContent = hints;
}

// Обновление прогресса
function updateProgress() {
  const progress = Math.round((correctPieces / totalPieces) * 100);
  progressElement.textContent = `${progress}%`;
}

// Подсказки
function showHintModal() {
  if (hints <= 0 || isPuzzleCompleted) return;
  hintModal.style.display = 'flex';
}

function hideHintModal() {
  hintModal.style.display = 'none';
}

function useHint() {
  if (hints <= 0) return;
  
  hints--;
  updateHints();
  hideHintModal();
  showOriginalImage();
}

function showOriginalImage() {
  if (originalImageVisible || isPuzzleCompleted) return;
  
  originalImageVisible = true;
  originalImage.style.borderColor = '#FFD700';
  originalImage.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
  
  setTimeout(() => {
    originalImageVisible = false;
    originalImage.style.borderColor = '';
    originalImage.style.boxShadow = '';
  }, 5000);
}

// Возврат к выбору
function returnToSelection() {
  clearInterval(timerInterval);
  selectionScreen.classList.add('active');
  gameScreen.classList.remove('active');
  completionScreen.classList.remove('active');
  
  // Сбрасываем выбранного питомца
  if (selectedPet) {
    const selectedCard = document.querySelector(`[data-pet-id="${selectedPet.id}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }
  }
}

// Перезапуск игры
function restartGame() {
  clearInterval(timerInterval);
  completionScreen.classList.remove('active');
  startGame();
}

// Инициализация при загрузке
window.addEventListener('load', initGame);

// Консольные команды для тестирования
console.log('%c🧩 Команды для тестирования:', 'color: #6a11cb; font-size: 16px;');
console.log('%ccompletePuzzle() - мгновенно собрать пазл', 'color: #4CAF50;');
console.log('%caddHint() - добавить подсказку', 'color: #FF9800;');
console.log('%caddTime(60) - добавить время', 'color: #2196F3;');

// Функции для отладки
window.completePuzzle = () => {
  puzzlePieces.forEach((piece, index) => {
    if (!piece.used) {
      placePiece(piece.currentIndex, piece.originalIndex);
    }
  });
};

window.addHint = () => {
  hints++;
  updateHints();
};

window.addTime = (seconds) => {
  startTime -= seconds * 1000;
};