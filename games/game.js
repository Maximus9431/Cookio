const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('start-button');
const homeButton = document.getElementById('home-button');

let score = 0;
let gameInterval;
let isGameRunning = false;

// Начать игру
startButton.addEventListener('click', () => {
  if (isGameRunning) return;
  isGameRunning = true;
  startButton.style.display = 'none';
  homeButton.style.display = 'none';
  score = 0;
  scoreBoard.textContent = score;
  startGame();
});

// Перенаправляем игрока на вкладку с питомцем
homeButton.addEventListener('click', () => {
  location.href = '../index.html';
});

// Движение игрока
document.addEventListener('mousemove', (e) => {
  const gameAreaRect = gameArea.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  let x = e.clientX - gameAreaRect.left - playerWidth / 2;

  // Ограничиваем движение игрока в пределах игрового поля
  x = Math.max(0, Math.min(x, gameAreaRect.width - playerWidth));
  player.style.left = `${x}px`;
});

// Генерация падающих объектов
function createFallingItem(type) {
  const item = document.createElement('div');
  item.classList.add('falling-item', type);
  item.style.left = `${Math.random() * 90}%`;

  gameArea.appendChild(item);

  // Анимация падения
  const fallInterval = setInterval(() => {
    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Проверка столкновения с игроком
    if (
      itemRect.bottom >= playerRect.top &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      if (type === 'candy') {
        score += 100;
      } else if (type === 'dynamite') {
        endGame('Вы проиграли! Вы попали на бомбу.');
      }
      scoreBoard.textContent = score;

      // Проверка на победу
      if (score >= 5000) {
        endGame('Вы выиграли!');
      }

      item.remove();
      clearInterval(fallInterval);
    }

    // Удаление объекта, если он вышел за пределы экрана
    if (itemRect.top > window.innerHeight) {
      item.remove();
      clearInterval(fallInterval);
    }
  }, 50);
}

// Запуск игры
function startGame() {
  gameInterval = setInterval(() => {
    // Увеличиваем вероятность появления бомб
    const type = Math.random() < 0.6 ? 'candy' : 'dynamite'; // 60% конфеты, 40% бомбы
    createFallingItem(type);
  }, 800); // Уменьшили интервал для увеличения сложности
}

// Завершение игры
function endGame(message) {
  clearInterval(gameInterval);
  isGameRunning = false;
  alert(message);

  // Показываем кнопку "Домой"
  homeButton.style.display = 'block';

  // Скрываем кнопку "Начать игру"
  startButton.style.display = 'block';

  // Удаляем все падающие объекты
  document.querySelectorAll('.falling-item').forEach((item) => item.remove());
}

const expandButton = document.getElementById('expand-button');
const menuButtons = document.getElementById('menu-buttons');

expandButton.addEventListener('click', () => {
  const isVisible = menuButtons.classList.toggle('show');
  expandButton.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
  expandButton.style.transform = isVisible
    ? 'scale(1.1) rotate(180deg)'
    : 'scale(1) rotate(0deg)';
});

// Закрытие при клике вне меню
document.addEventListener('click', (e) => {
  // Заменяем classList.contains
  if (!e.target.closest('#expandable-menu') && 
      (' ' + menuButtons.className + ' ').indexOf(' show ') > -1) { 
    menuButtons.classList.remove('show');
    expandButton.setAttribute('aria-expanded', 'false');
    expandButton.style.transform = 'scale(1) rotate(0deg)';
  }
});

// Клавиатурный доступ
expandButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    expandButton.click();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const expandButton = document.getElementById('expand-button');
  const menuButtons = document.getElementById('menu-buttons');

  expandButton.addEventListener('click', () => {
    const expanded = expandButton.getAttribute('aria-expanded') === 'true';
    expandButton.setAttribute('aria-expanded', !expanded);
    menuButtons.classList.toggle('show');
  });
});