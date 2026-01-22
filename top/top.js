// top_new.js - Обновленная версия рейтинга в стиле игровой коллекции

let currentPlayers = [];
let currentLeaderboard = 'global';
let currentPage = 1;
const playersPerPage = 9; // 3x3 сетка

// Пример данных игроков
const samplePlayers = [
  { id: 1, name: "Champion", score: 5210, wins: 245, level: 45, avatar: "https://i.pravatar.cc/100?img=10", clan: "Pro Team", region: "europe", change: "up", changeAmount: 45 },
  { id: 2, name: "ProPlayer", score: 4850, wins: 210, level: 42, avatar: "https://i.pravatar.cc/100?img=5", clan: "Elite", region: "asia", change: "down", changeAmount: 12 },
  { id: 3, name: "Master", score: 4620, wins: 198, level: 40, avatar: "https://i.pravatar.cc/100?img=8", clan: "Masters", region: "america", change: "up", changeAmount: 28 },
  { id: 4, name: "Destroyer", score: 4380, wins: 185, level: 38, avatar: "https://i.pravatar.cc/100?img=2", clan: "Destroyers", region: "europe", change: "up", changeAmount: 35 },
  { id: 5, name: "Sniper", score: 4150, wins: 175, level: 37, avatar: "https://i.pravatar.cc/100?img=3", clan: "Snipers", region: "asia", change: "stable", changeAmount: 0 },
  { id: 6, name: "Tank", score: 3980, wins: 168, level: 36, avatar: "https://i.pravatar.cc/100?img=4", clan: "Tanks", region: "america", change: "up", changeAmount: 15 },
  { id: 7, name: "Healer", score: 3820, wins: 155, level: 35, avatar: "https://i.pravatar.cc/100?img=6", clan: "Healers", region: "europe", change: "down", changeAmount: 8 },
  { id: 8, name: "Ninja", score: 3650, wins: 148, level: 34, avatar: "https://i.pravatar.cc/100?img=7", clan: "Ninjas", region: "asia", change: "up", changeAmount: 22 },
  { id: 9, name: "Wizard", score: 3520, wins: 142, level: 33, avatar: "https://i.pravatar.cc/100?img=9", clan: "Wizards", region: "america", change: "stable", changeAmount: 0 },
  { id: 10, name: "Hunter", score: 3380, wins: 135, level: 32, avatar: "https://i.pravatar.cc/100?img=11", clan: "Hunters", region: "europe", change: "up", changeAmount: 18 },
  { id: 11, name: "Assassin", score: 3250, wins: 130, level: 31, avatar: "https://i.pravatar.cc/100?img=12", clan: "Assassins", region: "asia", change: "down", changeAmount: 5 },
  { id: 12, name: "Knight", score: 3120, wins: 125, level: 30, avatar: "https://i.pravatar.cc/100?img=13", clan: "Knights", region: "america", change: "up", changeAmount: 30 },
  { id: 13, name: "Archer", score: 2980, wins: 120, level: 29, avatar: "https://i.pravatar.cc/100?img=14", clan: "Archers", region: "europe", change: "stable", changeAmount: 0 },
  { id: 14, name: "Mage", score: 2850, wins: 115, level: 28, avatar: "https://i.pravatar.cc/100?img=15", clan: "Mages", region: "asia", change: "up", changeAmount: 25 },
  { id: 15, name: "Warrior", score: 2720, wins: 110, level: 27, avatar: "https://i.pravatar.cc/100?img=16", clan: "Warriors", region: "america", change: "down", changeAmount: 10 },
  { id: 16, name: "Berserker", score: 2600, wins: 105, level: 26, avatar: "https://i.pravatar.cc/100?img=17", clan: "Berserkers", region: "europe", change: "up", changeAmount: 20 },
  { id: 17, name: "Paladin", score: 2480, wins: 100, level: 25, avatar: "https://i.pravatar.cc/100?img=18", clan: "Paladins", region: "asia", change: "stable", changeAmount: 0 },
  { id: 18, name: "Rogue", score: 2360, wins: 95, level: 24, avatar: "https://i.pravatar.cc/100?img=19", clan: "Rogues", region: "america", change: "up", changeAmount: 15 },
  // Добавляем текущего пользователя
  { id: 47, name: "Игрок_123", score: 2845, wins: 120, level: 12, avatar: "https://i.pravatar.cc/100?img=3", clan: "Новички", region: "europe", change: "up", changeAmount: 32, isCurrentUser: true }
];

// Инициализация
function initLeaderboard() {
  currentPlayers = [...samplePlayers];
  createParticles();
  updateStats();
  setupEventListeners();
  renderPlayers();
  showNotification("🏆 Рейтинг игроков загружен! Обновляется каждые 5 минут", "info");
}

// Создание частиц для фона
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = Math.random() * 0.2 + 0.1;
    
    const colors = [
      'rgba(142, 45, 226, 0.2)',
      'rgba(255, 215, 0, 0.2)',
      'rgba(54, 209, 220, 0.2)',
      'rgba(255, 94, 98, 0.2)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    particlesContainer.appendChild(particle);
  }
}

// Отрисовка игроков
function renderPlayers() {
  const playersGrid = document.getElementById('players-grid');
  playersGrid.innerHTML = '';
  
  // Фильтрация и сортировка
  let filteredPlayers = filterPlayers(currentPlayers);
  filteredPlayers.sort((a, b) => b.score - a.score);
  
  // Пейджинация
  const startIndex = (currentPage - 1) * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const playersToShow = filteredPlayers.slice(startIndex, endIndex);
  
  if (playersToShow.length === 0) {
    playersGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <i class="fas fa-users-slash fa-3x" style="color: rgba(255,255,255,0.3); margin-bottom: 20px;"></i>
        <h3 style="color: white; margin-bottom: 10px;">Нет игроков</h3>
        <p style="color: rgba(255,255,255,0.6);">Попробуйте изменить фильтры или поиск</p>
      </div>
    `;
    updatePagination(filteredPlayers.length);
    return;
  }
  
  playersToShow.forEach((player, index) => {
    const globalRank = filteredPlayers.findIndex(p => p.id === player.id) + 1;
    const playerCard = document.createElement('div');
    
    // Определяем классы для рангов
    let rankClass = '';
    if (globalRank === 1) rankClass = 'rank-1';
    else if (globalRank === 2) rankClass = 'rank-2';
    else if (globalRank === 3) rankClass = 'rank-3';
    
    if (player.isCurrentUser) {
      playerCard.classList.add('current-user');
    }
    
    playerCard.className = `player-card ${rankClass}`;
    
    // Определяем цвет карточки на основе ранга
    let color1, color2;
    if (globalRank <= 3) {
      if (globalRank === 1) { color1 = '#FFD700'; color2 = '#FFA500'; }
      else if (globalRank === 2) { color1 = '#C0C0C0'; color2 = '#999'; }
      else { color1 = '#CD7F32'; color2 = '#8B4513'; }
    } else {
      // Цвета на основе очков
      if (player.score > 4000) { color1 = '#8E2DE2'; color2 = '#4A00E0'; }
      else if (player.score > 3000) { color1 = '#36D1DC'; color2 = '#5B86E5'; }
      else { color1 = '#FF5E62'; color2 = '#FF9966'; }
    }
    
    playerCard.style.setProperty('--color1', color1);
    playerCard.style.setProperty('--color2', color2);
    
    // Определяем иконку изменения ранга
    let changeIcon = '';
    let changeClass = '';
    if (player.change === 'up') {
      changeIcon = '<i class="fas fa-arrow-up"></i>';
      changeClass = 'up';
    } else if (player.change === 'down') {
      changeIcon = '<i class="fas fa-arrow-down"></i>';
      changeClass = 'down';
    }
    
    playerCard.innerHTML = `
      <div class="player-header">
        <div class="player-rank">${globalRank}</div>
        <div class="player-avatar">
          <img src="${player.avatar}" alt="${player.name}">
        </div>
        <div class="player-info">
          <div class="player-name">${player.name} ${player.isCurrentUser ? '<i class="fas fa-user" style="color: #FFD700;"></i>' : ''}</div>
          <div class="player-clan">
            <i class="fas fa-users"></i> ${player.clan}
          </div>
          ${player.change !== 'stable' ? `
            <div class="rank-change ${changeClass}">
              ${changeIcon} ${player.changeAmount}
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="player-stats-grid">
        <div class="player-stat player-score">
          <div class="stat-label">Очки</div>
          <div class="stat-value">${player.score.toLocaleString()}</div>
        </div>
        <div class="player-stat">
          <div class="stat-label">Победы</div>
          <div class="stat-value">${player.wins}</div>
        </div>
        <div class="player-stat">
          <div class="stat-label">Уровень</div>
          <div class="stat-value">${player.level}</div>
        </div>
        <div class="player-stat">
          <div class="stat-label">Регион</div>
          <div class="stat-value">${getRegionName(player.region)}</div>
        </div>
      </div>
      
      <div class="player-actions">
        <button class="action-btn view-profile" data-id="${player.id}">
          <i class="fas fa-eye"></i> Профиль
        </button>
        ${!player.isCurrentUser ? `
          <button class="action-btn add-friend" data-id="${player.id}">
            <i class="fas fa-user-plus"></i> Друг
          </button>
        ` : ''}
      </div>
    `;
    
    playersGrid.appendChild(playerCard);
  });
  
  // Обработчики для кнопок
  setupPlayerButtons();
  updatePagination(filteredPlayers.length);
}

// Получение названия региона
function getRegionName(regionCode) {
  const regions = {
    'europe': 'EU',
    'asia': 'AS',
    'america': 'US'
  };
  return regions[regionCode] || regionCode;
}

// Фильтрация игроков
function filterPlayers(players) {
  const searchTerm = document.getElementById('search-player').value.toLowerCase();
  const regionFilter = document.getElementById('filter-region').value;
  
  return players.filter(player => {
    // Поиск по имени
    if (searchTerm && !player.name.toLowerCase().includes(searchTerm)) {
      return false;
    }
    
    // Фильтр по региону
    if (regionFilter !== 'all' && player.region !== regionFilter) {
      return false;
    }
    
    // Фильтр по типу лидерборда
    if (currentLeaderboard === 'friends' && !player.isFriend) {
      return false;
    }
    
    if (currentLeaderboard === 'clan' && player.clan !== 'Новички') {
      return false;
    }
    
    return true;
  });
}

// Обновление статистики
function updateStats() {
  const totalPlayers = currentPlayers.length;
  const averageScore = Math.round(currentPlayers.reduce((sum, p) => sum + p.score, 0) / totalPlayers);
  
  document.getElementById('total-players').textContent = totalPlayers.toLocaleString();
  document.getElementById('average-score').textContent = averageScore.toLocaleString();
  
  // Обновляем время
  const now = new Date();
  document.getElementById('update-time').textContent = now.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Обновляем ранг пользователя
  const sortedPlayers = [...currentPlayers].sort((a, b) => b.score - a.score);
  const userIndex = sortedPlayers.findIndex(p => p.isCurrentUser);
  if (userIndex !== -1) {
    document.getElementById('user-rank').textContent = userIndex + 1;
  }
}

// Обработчики событий
function setupEventListeners() {
  // Вкладки
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentLeaderboard = tab.dataset.leaderboard;
      currentPage = 1;
      renderPlayers();
    });
  });
  
  // Поиск
  document.getElementById('search-player').addEventListener('input', () => {
    currentPage = 1;
    renderPlayers();
  });
  
  // Фильтр по региону
  document.getElementById('filter-region').addEventListener('change', () => {
    currentPage = 1;
    renderPlayers();
  });
  
  // Переключение вида
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Здесь можно добавить логику переключения между сеткой и списком
    });
  });
  
  // Кнопки пейджинации
  document.querySelector('.prev').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPlayers();
    }
  });
  
  document.querySelector('.next').addEventListener('click', () => {
    const totalPages = Math.ceil(filterPlayers(currentPlayers).length / playersPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderPlayers();
    }
  });
  
  // Модальное окно
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.getElementById('player-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('player-modal')) {
      closeModal();
    }
  });
  
  // Кнопка добавления в друзья в модальном окне
  document.getElementById('modal-add-friend').addEventListener('click', function() {
    const playerId = this.getAttribute('data-player-id');
    if (playerId) {
      addFriend(parseInt(playerId));
    }
  });
}

// Обработчики для кнопок игроков
function setupPlayerButtons() {
  document.querySelectorAll('.view-profile').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const playerId = parseInt(e.currentTarget.dataset.id);
      showPlayerProfile(playerId);
    });
  });
  
  document.querySelectorAll('.add-friend').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const playerId = parseInt(e.currentTarget.dataset.id);
      addFriend(playerId);
    });
  });
}

// Показать профиль игрока
function showPlayerProfile(playerId) {
  const player = currentPlayers.find(p => p.id === playerId);
  if (!player) return;
  
  document.getElementById('modal-player-name').textContent = player.name;
  document.getElementById('modal-player-avatar').src = player.avatar;
  document.getElementById('modal-player-score').textContent = player.score.toLocaleString();
  document.getElementById('modal-player-wins').textContent = player.wins;
  document.getElementById('modal-player-level').textContent = player.level;
  document.getElementById('modal-player-days').textContent = Math.floor(Math.random() * 365) + 30;
  
  // Установка ранга
  const sortedPlayers = [...currentPlayers].sort((a, b) => b.score - a.score);
  const rank = sortedPlayers.findIndex(p => p.id === playerId) + 1;
  document.getElementById('modal-player-rank').textContent = `Ранг #${rank}`;
  
  // Устанавливаем ID игрока для кнопки добавления в друзья
  document.getElementById('modal-add-friend').setAttribute('data-player-id', playerId);
  
  document.getElementById('player-modal').classList.add('show');
}

// Добавить в друзья
function addFriend(playerId) {
  const player = currentPlayers.find(p => p.id === playerId);
  if (!player) return;
  
  showNotification(`Запрос дружбы отправлен игроку ${player.name}`, "success");
  
  // Симуляция ответа
  setTimeout(() => {
    if (Math.random() > 0.3) {
      showNotification(`${player.name} принял(а) ваш запрос в друзья!`, "success");
    } else {
      showNotification(`${player.name} отклонил(а) ваш запрос в друзья`, "warning");
    }
  }, 2000);
}

// Обновление пейджинации
function updatePagination(totalPlayers) {
  const totalPages = Math.ceil(totalPlayers / playersPerPage);
  const pageNumbers = document.getElementById('page-numbers');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  
  // Обновляем кнопки
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  
  // Обновляем номера страниц
  let pagesHTML = '';
  const maxVisiblePages = 5;
  
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pagesHTML += `<span class="page-number ${i === currentPage ? 'active' : ''}">${i}</span>`;
    }
  } else {
    // Сложная логика для многостраничности
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    if (start > 1) {
      pagesHTML += `<span class="page-number">1</span>`;
      if (start > 2) pagesHTML += `<span class="page-dots">...</span>`;
    }
    
    for (let i = start; i <= end; i++) {
      pagesHTML += `<span class="page-number ${i === currentPage ? 'active' : ''}">${i}</span>`;
    }
    
    if (end < totalPages) {
      if (end < totalPages - 1) pagesHTML += `<span class="page-dots">...</span>`;
      pagesHTML += `<span class="page-number">${totalPages}</span>`;
    }
  }
  
  pageNumbers.innerHTML = pagesHTML;
  
  // Обработчики для номеров страниц
  document.querySelectorAll('.page-number').forEach((page, index) => {
    page.addEventListener('click', () => {
      const pageNum = parseInt(page.textContent);
      if (!isNaN(pageNum)) {
        currentPage = pageNum;
        renderPlayers();
      }
    });
  });
}

// Показать уведомление
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  const text = document.getElementById('notification-text');
  
  // Устанавливаем цвет в зависимости от типа
  let borderColor = '#36D1DC'; // info по умолчанию
  if (type === 'success') borderColor = '#00cc88';
  if (type === 'warning') borderColor = '#ffaa00';
  if (type === 'error') borderColor = '#ff4757';
  
  notification.style.borderLeftColor = borderColor;
  text.textContent = message;
  
  // Меняем иконку в зависимости от типа
  const icon = notification.querySelector('i');
  if (type === 'success') icon.className = 'fas fa-check-circle';
  if (type === 'warning') icon.className = 'fas fa-exclamation-triangle';
  if (type === 'error') icon.className = 'fas fa-times-circle';
  if (type === 'info') icon.className = 'fas fa-info-circle';
  
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Закрыть модальное окно
function closeModal() {
  document.getElementById('player-modal').classList.remove('show');
}

// Меню
const expandButton = document.getElementById('expand-button');
const menuButtons = document.getElementById('menu-buttons');

expandButton.addEventListener('click', (e) => {
  e.stopPropagation();
  const isVisible = menuButtons.classList.toggle('show');
  expandButton.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
  expandButton.style.transform = isVisible ? 'rotate(180deg) scale(1.1)' : 'rotate(0) scale(1)';
});

// Закрытие при клике вне меню
document.addEventListener('click', (e) => {
  if (!e.target.closest('#expandable-menu') && menuButtons.classList.contains('show')) {
    menuButtons.classList.remove('show');
    expandButton.setAttribute('aria-expanded', 'false');
    expandButton.style.transform = 'rotate(0) scale(1)';
  }
});

// Автоматическое обновление
setInterval(() => {
  // Случайное изменение очков у некоторых игроков
  currentPlayers.forEach(player => {
    if (!player.isCurrentUser && Math.random() > 0.7) {
      const change = Math.floor(Math.random() * 50) - 10;
      player.score = Math.max(0, player.score + change);
      
      if (change > 0) {
        player.change = 'up';
        player.changeAmount = change;
      } else if (change < 0) {
        player.change = 'down';
        player.changeAmount = Math.abs(change);
      } else {
        player.change = 'stable';
      }
    }
  });
  
  // Обновляем только если текущая страница активна
  if (!document.hidden) {
    renderPlayers();
    updateStats();
    showNotification("📊 Рейтинг обновлен", "info");
  }
}, 30000); // Каждые 30 секунд

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  initLeaderboard();
});