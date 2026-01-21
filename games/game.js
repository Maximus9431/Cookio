// Данные об играх
const gamesData = [
  {
    id: 1,
    title: "Сбор Конфет",
    icon: "🍬",
    description: "Собирайте падающие конфеты, избегайте бомб и набирайте очки! Идеальная игра для развития реакции.",
    difficulty: "medium",
    players: "1 игрок",
    time: "5-10 минут",
    score: 0,
    color1: "#FF5E62",
    color2: "#FF9966",
    link: "candy.html"
  },
  {
    id: 2,
    title: "Прыжки по Платформам",
    icon: "🦘",
    description: "Прыгайте с платформы на платформу, избегая падения. С каждой минутой сложность увеличивается!",
    difficulty: "hard",
    players: "1 игрок",
    time: "10+ минут",
    score: 0,
    color1: "#36D1DC",
    color2: "#5B86E5",
    link: "jump.html"
  },
  {
    id: 3,
    title: "Уклонение от Препятствий",
    icon: "🎯",
    description: "Уворачивайтесь от летящих предметов. Тест на скорость реакции и концентрацию внимания.",
    difficulty: "hard",
    players: "1 игрок",
    time: "3-7 минут",
    score: 0,
    color1: "#834d9b",
    color2: "#d04ed6",
    link: "dodge.html"
  },
  {
    id: 4,
    title: "Гонки с Питомцем",
    icon: "🏎️",
    description: "Гонки на время с вашим питомцем! Собирайте бонусы и обгоняйте соперников.",
    difficulty: "medium",
    players: "1-2 игрока",
    time: "8-15 минут",
    score: 0,
    color1: "#00b09b",
    color2: "#96c93d",
    link: "#"
  },
  {
    id: 5,
    title: "Пазл с Питомцами",
    icon: "🧩",
    description: "Соберите пазл из изображений ваших питомцев. Расслабляющая игра для развития памяти.",
    difficulty: "easy",
    players: "1 игрок",
    time: "10-20 минут",
    score: 0,
    color1: "#ff8a00",
    color2: "#e52e71",
    link: "#"
  },
  {
    id: 6,
    title: "Арканоид с Питомцами",
    icon: "🔶",
    description: "Классический арканоид, но с участием ваших питомцев! Разбейте все блоки мячиком.",
    difficulty: "medium",
    players: "1 игрок",
    time: "7-12 минут",
    score: 0,
    color1: "#667eea",
    color2: "#764ba2",
    link: "#"
  }
];

// Загружаем сохраненные результаты из localStorage
function loadGameStats() {
  const savedStats = JSON.parse(localStorage.getItem('gameStats')) || {};
  
  gamesData.forEach(game => {
    if (savedStats[game.id]) {
      game.score = savedStats[game.id].score || 0;
      game.playCount = savedStats[game.id].playCount || 0;
      game.totalTime = savedStats[game.id].totalTime || 0;
    } else {
      game.score = 0;
      game.playCount = 0;
      game.totalTime = 0;
    }
  });
  
  updateFooterStats();
}

// Сохраняем статистику игры
function saveGameStats(gameId, score, playTime) {
  const savedStats = JSON.parse(localStorage.getItem('gameStats')) || {};
  
  if (!savedStats[gameId]) {
    savedStats[gameId] = { score: 0, playCount: 0, totalTime: 0 };
  }
  
  // Обновляем рекорд если новый результат лучше
  if (score > savedStats[gameId].score) {
    savedStats[gameId].score = score;
  }
  
  savedStats[gameId].playCount++;
  savedStats[gameId].totalTime += playTime;
  
  localStorage.setItem('gameStats', JSON.stringify(savedStats));
  loadGameStats(); // Перезагружаем статистику
  renderGames(); // Обновляем отображение
}

// Обновляем статистику в футере
function updateFooterStats() {
  const totalGames = gamesData.length;
  const totalScore = gamesData.reduce((sum, game) => sum + game.score, 0);
  const totalTime = gamesData.reduce((sum, game) => sum + game.totalTime, 0);
  
  document.getElementById('total-games').textContent = totalGames;
  document.getElementById('total-score').textContent = totalScore.toLocaleString();
  document.getElementById('total-time').textContent = Math.round(totalTime / 60); // Часы
}

// Создаем анимированные частицы
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Случайные параметры
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = Math.random() * 0.3 + 0.1;
    
    // Случайный цвет градиента
    const colors = [
      'rgba(255, 94, 98, 0.2)',
      'rgba(255, 153, 102, 0.2)',
      'rgba(54, 209, 220, 0.2)',
      'rgba(91, 134, 229, 0.2)',
      'rgba(142, 45, 226, 0.2)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    particlesContainer.appendChild(particle);
  }
}

// Отображаем игры
function renderGames() {
  const gamesGrid = document.getElementById('games-grid');
  gamesGrid.innerHTML = '';
  
  gamesData.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';
    gameCard.style.setProperty('--color1', game.color1);
    gameCard.style.setProperty('--color2', game.color2);
    
    // Определяем сложность
    let difficultyClass = '';
    let difficultyText = '';
    switch(game.difficulty) {
      case 'easy':
        difficultyClass = 'difficulty-easy';
        difficultyText = 'Легко';
        break;
      case 'medium':
        difficultyClass = 'difficulty-medium';
        difficultyText = 'Средне';
        break;
      case 'hard':
        difficultyClass = 'difficulty-hard';
        difficultyText = 'Сложно';
        break;
    }
    
    gameCard.innerHTML = `
      <div class="difficulty-badge ${difficultyClass}">
        ${difficultyText}
      </div>
      
      <div class="game-header">
        <div class="game-icon">
          ${game.icon}
        </div>
        <div class="game-title">${game.title}</div>
      </div>
      
      <div class="game-description">
        ${game.description}
      </div>
      
      <div class="game-stats">
        <div class="stat">
          <div class="stat-value">${game.score.toLocaleString()}</div>
          <div class="stat-label">Рекорд</div>
        </div>
        <div class="stat">
          <div class="stat-value">${game.players}</div>
          <div class="stat-label">Игроки</div>
        </div>
        <div class="stat">
          <div class="stat-value">${game.time}</div>
          <div class="stat-label">Время</div>
        </div>
      </div>
      
      <button class="play-button" data-game-id="${game.id}">
        <i class="fas fa-play-circle"></i> Играть
      </button>
    `;
    
    gamesGrid.appendChild(gameCard);
  });
  
  // Добавляем обработчики для кнопок
  document.querySelectorAll('.play-button').forEach(button => {
    button.addEventListener('click', function() {
      const gameId = parseInt(this.getAttribute('data-game-id'));
      const game = gamesData.find(g => g.id === gameId);
      
      if (game.link && game.link !== '#') {
        // Показываем анимацию перед переходом
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
        this.disabled = true;
        
        setTimeout(() => {
          window.location.href = game.link;
        }, 800);
      } else {
        // Если игра еще не готова
        showGameNotification(game.title);
      }
    });
  });
}

// Показываем уведомление об игре
function showGameNotification(gameTitle) {
  const notification = document.createElement('div');
  notification.className = 'game-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <h3><i class="fas fa-tools"></i> В разработке</h3>
      <p>Игра "${gameTitle}" скоро будет доступна!</p>
      <button class="notification-close">OK</button>
    </div>
  `;
  
  // Стили для уведомления
  notification.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
  `;
  
  const content = notification.querySelector('.notification-content');
  content.style.cssText = `
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    animation: slideUp 0.5s ease;
    border: 2px solid rgba(255, 255, 255, 0.1);
  `;
  
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.style.cssText = `
    background: linear-gradient(135deg, #8E2DE2, #4A00E0);
    color: white;
    border: none;
    padding: 10px 30px;
    border-radius: 50px;
    cursor: pointer;
    margin-top: 20px;
    font-family: 'Comic Sans MS', sans-serif;
    font-size: 16px;
  `;
  
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });
  
  document.body.appendChild(notification);
  
  // Анимации
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

// Инициализация меню
function initMenu() {
  const expandButton = document.getElementById('expand-button');
  const menuButtons = document.getElementById('menu-buttons');
  let menuVisible = false;
  
  expandButton.addEventListener('click', (e) => {
    e.stopPropagation();
    menuVisible = !menuVisible;
    menuButtons.classList.toggle('show');
    expandButton.setAttribute('aria-expanded', menuVisible);
    expandButton.style.transform = menuVisible ? 'scale(1.15) rotate(45deg)' : 'scale(1) rotate(0deg)';
  });
  
  // Закрытие меню при клике вне
  document.addEventListener('click', (e) => {
    if (menuVisible && !e.target.closest('#expandable-menu')) {
      menuVisible = false;
      menuButtons.classList.remove('show');
      expandButton.setAttribute('aria-expanded', 'false');
      expandButton.style.transform = 'scale(1) rotate(0deg)';
    }
  });
}

// Загрузка демо-данных для тестирования
function loadDemoData() {
  // Если нет сохраненных данных, добавляем демо-результаты
  if (!localStorage.getItem('gameStats')) {
    const demoStats = {};
    
    gamesData.forEach((game, index) => {
      demoStats[game.id] = {
        score: Math.floor(Math.random() * 5000) + 1000,
        playCount: Math.floor(Math.random() * 10) + 1,
        totalTime: Math.floor(Math.random() * 120) + 30 // Минуты
      };
    });
    
    localStorage.setItem('gameStats', JSON.stringify(demoStats));
  }
}

// Инициализация страницы
function initPage() {
  loadDemoData();
  loadGameStats();
  createParticles();
  renderGames();
  initMenu();
  
  // Добавляем обработчик для обновления статистики при возвращении на страницу
  window.addEventListener('pageshow', loadGameStats);
  
  // Консольные команды для тестирования
  console.log('%c🎮 Команды для тестирования:', 'color: #36D1DC; font-size: 16px;');
  console.log('%cloadDemoData() - загрузить демо-данные', 'color: #4CAF50;');
  console.log('%clocalStorage.clear() - очистить статистику', 'color: #FF4757;');
  console.log('%cupdateGameScore(1, 5000) - обновить рекорд для игры с ID 1', 'color: #FFD700;');
}

// Функция для обновления рекорда игры (для консоли)
window.updateGameScore = function(gameId, score) {
  saveGameStats(gameId, score, 5);
  console.log(`Рекорд игры ${gameId} обновлен: ${score}`);
};

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initPage);