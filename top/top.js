const topTableBody = document.querySelector('#top-table tbody');
const topContainer = document.getElementById('top-container');

// Пример данных игроков
const players = [
  { name: 'Игрок1', score: 1500 },
  { name: 'Игрок2', score: 1200 },
  { name: 'Игрок3', score: 1000 },
  { name: 'Игрок4', score: 800 },
  { name: 'Игрок5', score: 600 },
];

// Функция для отображения игроков
function renderTopPlayers() {
  topTableBody.innerHTML = ''; // Очищаем таблицу

  players
    .sort((a, b) => b.score - a.score) // Сортируем по очкам
    .forEach((player, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${player.name}</td>
        <td>${player.score}</td>
      `;
      topTableBody.appendChild(row);
    });
}

// Добавляем класс "visible" для плавного появления контейнера
function showTopContainer() {
  setTimeout(() => {
    topContainer.classList.add('visible');
  }, 200); // Задержка для эффекта
}

// Загружаем таблицу при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  renderTopPlayers();
  showTopContainer();
});

// Меню
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
  if (!e.target.closest('#expandable-menu') && menuButtons.classList.contains('show')) {
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