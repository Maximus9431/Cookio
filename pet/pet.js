// Данные о питомцах
const petsData = [
  {
    id: 1,
    name: "Огнегрыз",
    type: "Дракон",
    rarity: "Легендарный",
    icon: "🐲",
    image: "https://via.placeholder.com/120/FF9800/FFFFFF?text=🐲",
    description: "Могущественный дракон, извергающий пламя. Отличный защитник в бою.",
    level: 15,
    health: 95,
    attack: 88,
    defense: 75,
    speed: 60,
    color1: "#FF9800",
    color2: "#FF5722"
  },
  {
    id: 2,
    name: "Пушистик",
    type: "Кот",
    rarity: "Обычный",
    icon: "🐱",
    image: "https://via.placeholder.com/120/4CAF50/FFFFFF?text=🐱",
    description: "Милый и пушистый котенок. Отлично поднимает настроение.",
    level: 5,
    health: 65,
    attack: 45,
    defense: 40,
    speed: 80,
    color1: "#4CAF50",
    color2: "#8BC34A"
  },
  {
    id: 3,
    name: "Молния",
    type: "Единорог",
    rarity: "Редкий",
    icon: "🦄",
    image: "https://via.placeholder.com/120/2196F3/FFFFFF?text=🦄",
    description: "Быстрый как ветер единорог с магическими способностями.",
    level: 10,
    health: 75,
    attack: 70,
    defense: 65,
    speed: 95,
    color1: "#2196F3",
    color2: "#03A9F4"
  },
  {
    id: 4,
    name: "Тень",
    type: "Призрак",
    rarity: "Эпический",
    icon: "👻",
    image: "https://via.placeholder.com/120/9C27B0/FFFFFF?text=👻",
    description: "Загадочный призрак, способный проходить сквозь стены.",
    level: 12,
    health: 80,
    attack: 82,
    defense: 50,
    speed: 70,
    color1: "#9C27B0",
    color2: "#673AB7"
  }
];

// Загружаем сохраненные питомцы из localStorage
function loadPets() {
  const savedPets = JSON.parse(localStorage.getItem('pets')) || petsData;
  
  // Обновляем petsData из сохраненных
  savedPets.forEach((savedPet, index) => {
    if (petsData[index]) {
      Object.assign(petsData[index], savedPet);
    }
  });
  
  updateFooterStats();
}

// Сохраняем питомцев в localStorage
function savePets() {
  localStorage.setItem('pets', JSON.stringify(petsData));
}

// Обновляем статистику в футере
function updateFooterStats() {
  const totalPets = petsData.length;
  const totalLevel = petsData.reduce((sum, pet) => sum + (pet.level || 1), 0);
  const avgLevel = totalPets > 0 ? Math.round(totalLevel / totalPets) : 0;
  
  // Подсчет редкостей
  const rarities = {
    'Обычный': 1,
    'Редкий': 2,
    'Эпический': 3,
    'Легендарный': 4,
    'Мифический': 5
  };
  
  const totalRarity = petsData.reduce((sum, pet) => sum + (rarities[pet.rarity] || 0), 0);
  const avgRarityValue = totalPets > 0 ? totalRarity / totalPets : 0;
  
  let avgRarityText = "Обычный";
  if (avgRarityValue >= 4) avgRarityText = "Легендарный";
  else if (avgRarityValue >= 3) avgRarityText = "Эпический";
  else if (avgRarityValue >= 2) avgRarityText = "Редкий";
  
  document.getElementById('total-pets').textContent = totalPets;
  document.getElementById('avg-rarity').textContent = avgRarityText;
  document.getElementById('total-level').textContent = totalLevel;
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
      'rgba(76, 175, 80, 0.2)',
      'rgba(33, 150, 243, 0.2)',
      'rgba(156, 39, 176, 0.2)',
      'rgba(255, 152, 0, 0.2)',
      'rgba(255, 87, 34, 0.2)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    particlesContainer.appendChild(particle);
  }
}

// Определяем стили для редкости
function getRarityStyles(rarity) {
  switch(rarity) {
    case 'Обычный':
      return {
        gradient: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
        bg: 'rgba(76, 175, 80, 0.2)',
        color: '#4CAF50',
        border: 'rgba(76, 175, 80, 0.3)'
      };
    case 'Редкий':
      return {
        gradient: 'linear-gradient(135deg, #2196F3, #03A9F4)',
        bg: 'rgba(33, 150, 243, 0.2)',
        color: '#2196F3',
        border: 'rgba(33, 150, 243, 0.3)'
      };
    case 'Эпический':
      return {
        gradient: 'linear-gradient(135deg, #9C27B0, #673AB7)',
        bg: 'rgba(156, 39, 176, 0.2)',
        color: '#9C27B0',
        border: 'rgba(156, 39, 176, 0.3)'
      };
    case 'Легендарный':
      return {
        gradient: 'linear-gradient(135deg, #FF9800, #FF5722)',
        bg: 'rgba(255, 152, 0, 0.2)',
        color: '#FF9800',
        border: 'rgba(255, 152, 0, 0.3)'
      };
    case 'Мифический':
      return {
        gradient: 'linear-gradient(135deg, #FF4081, #E91E63)',
        bg: 'rgba(255, 64, 129, 0.2)',
        color: '#FF4081',
        border: 'rgba(255, 64, 129, 0.3)'
      };
    default:
      return {
        gradient: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
        bg: 'rgba(76, 175, 80, 0.2)',
        color: '#4CAF50',
        border: 'rgba(76, 175, 80, 0.3)'
      };
  }
}

// Отображаем питомцев
function renderPets() {
  const petsGrid = document.getElementById('pets-grid');
  petsGrid.innerHTML = '';
  
  petsData.forEach(pet => {
    const petCard = document.createElement('div');
    petCard.className = 'pet-card';
    
    const rarityStyles = getRarityStyles(pet.rarity);
    
    // Устанавливаем CSS переменные для градиента
    petCard.style.setProperty('--rarity-gradient', rarityStyles.gradient);
    petCard.style.setProperty('--rarity-bg', rarityStyles.bg);
    petCard.style.setProperty('--rarity-color', rarityStyles.color);
    petCard.style.setProperty('--rarity-border', rarityStyles.border);
    
    petCard.innerHTML = `
      <div class="rarity-badge">
        ${pet.rarity}
      </div>
      
      <div class="pet-header">
        <div class="pet-icon">
          <img src="${pet.image}" alt="${pet.name}" onerror="this.src='https://via.placeholder.com/60/cccccc/333333?text=${encodeURIComponent(pet.icon)}'">
        </div>
        <div class="pet-title">${pet.name}</div>
      </div>
      
      <div class="pet-description">
        ${pet.description}
      </div>
      
      <div class="pet-stats">
        <div class="stat">
          <div class="stat-value">${pet.level || 1}</div>
          <div class="stat-label">Уровень</div>
        </div>
        <div class="stat">
          <div class="stat-value">${pet.health || 50}</div>
          <div class="stat-label">Здоровье</div>
        </div>
        <div class="stat">
          <div class="stat-value">${pet.attack || 30}</div>
          <div class="stat-label">Атака</div>
        </div>
        <div class="stat">
          <div class="stat-value">${pet.defense || 20}</div>
          <div class="stat-label">Защита</div>
        </div>
        <div class="stat">
          <div class="stat-value">${pet.speed || 50}</div>
          <div class="stat-label">Скорость</div>
        </div>
        <div class="stat">
          <div class="stat-value">${pet.type || 'Неизвестно'}</div>
          <div class="stat-label">Тип</div>
        </div>
      </div>
      
      <button class="details-button" data-pet-id="${pet.id}">
        <i class="fas fa-info-circle"></i> Подробнее
      </button>
    `;
    
    petsGrid.appendChild(petCard);
  });
  
  // Добавляем обработчики для кнопок
  document.querySelectorAll('.details-button').forEach(button => {
    button.addEventListener('click', function() {
      const petId = parseInt(this.getAttribute('data-pet-id'));
      const pet = petsData.find(p => p.id === petId);
      
      if (pet) {
        showPetDetails(pet);
      }
    });
  });
}

// Показываем детали питомца
function showPetDetails(pet) {
  const modal = document.createElement('div');
  modal.className = 'pet-modal';
  
  const rarityStyles = getRarityStyles(pet.rarity);
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header" style="background: ${rarityStyles.gradient}">
        <h2>${pet.name}</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="pet-detail-image">
          <img src="${pet.image}" alt="${pet.name}" onerror="this.src='https://via.placeholder.com/200/cccccc/333333?text=${encodeURIComponent(pet.icon)}'">
          <div class="pet-detail-rarity" style="background: ${rarityStyles.bg}; color: ${rarityStyles.color}; border-color: ${rarityStyles.border}">
            ${pet.rarity}
          </div>
        </div>
        <div class="pet-detail-info">
          <p><strong>Тип:</strong> ${pet.type || 'Неизвестно'}</p>
          <p><strong>Описание:</strong> ${pet.description}</p>
          <div class="pet-detail-stats">
            <div class="stat-detail">
              <div class="stat-bar">
                <div class="stat-label">Здоровье</div>
                <div class="stat-value">${pet.health || 50}/100</div>
              </div>
              <div class="stat-progress" style="width: ${(pet.health || 50)}%; background: ${rarityStyles.color}"></div>
            </div>
            <div class="stat-detail">
              <div class="stat-bar">
                <div class="stat-label">Атака</div>
                <div class="stat-value">${pet.attack || 30}/100</div>
              </div>
              <div class="stat-progress" style="width: ${(pet.attack || 30)}%; background: ${rarityStyles.color}"></div>
            </div>
            <div class="stat-detail">
              <div class="stat-bar">
                <div class="stat-label">Защита</div>
                <div class="stat-value">${pet.defense || 20}/100</div>
              </div>
              <div class="stat-progress" style="width: ${(pet.defense || 20)}%; background: ${rarityStyles.color}"></div>
            </div>
            <div class="stat-detail">
              <div class="stat-bar">
                <div class="stat-label">Скорость</div>
                <div class="stat-value">${pet.speed || 50}/100</div>
              </div>
              <div class="stat-progress" style="width: ${(pet.speed || 50)}%; background: ${rarityStyles.color}"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-btn upgrade-btn">
          <i class="fas fa-arrow-up"></i> Улучшить (Ур. ${pet.level || 1})
        </button>
        <button class="modal-btn close-btn">Закрыть</button>
      </div>
    </div>
  `;
  
  // Стили для модального окна
  modal.style.cssText = `
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
  
  const content = modal.querySelector('.modal-content');
  content.style.cssText = `
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    border-radius: 20px;
    max-width: 600px;
    width: 90%;
    overflow: hidden;
    animation: slideUp 0.5s ease;
    border: 2px solid rgba(255, 255, 255, 0.1);
  `;
  
  // Добавляем стили для модального окна
  const style = document.createElement('style');
  style.textContent = `
    .modal-header {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h2 {
      margin: 0;
      color: white;
    }
    
    .modal-close {
      background: none;
      border: none;
      color: white;
      font-size: 28px;
      cursor: pointer;
      line-height: 1;
    }
    
    .modal-body {
      padding: 20px;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .pet-detail-image {
      flex: 1;
      min-width: 200px;
      position: relative;
    }
    
    .pet-detail-image img {
      width: 100%;
      border-radius: 15px;
      border: 3px solid rgba(255, 255, 255, 0.2);
    }
    
    .pet-detail-rarity {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: bold;
      border: 1px solid;
    }
    
    .pet-detail-info {
      flex: 2;
      min-width: 300px;
    }
    
    .pet-detail-info p {
      margin: 10px 0;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .pet-detail-stats {
      margin-top: 20px;
    }
    
    .stat-detail {
      margin: 15px 0;
    }
    
    .stat-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    
    .stat-progress {
      height: 8px;
      border-radius: 4px;
      background: #4CAF50;
    }
    
    .modal-footer {
      padding: 20px;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .modal-btn {
      padding: 10px 20px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      font-family: 'Comic Sans MS', sans-serif;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    
    .upgrade-btn {
      background: linear-gradient(135deg, #4CAF50, #8BC34A);
      color: white;
    }
    
    .close-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    .modal-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
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
  
  // Обработчики событий
  const closeBtn = modal.querySelector('.modal-close');
  const closeModalBtn = modal.querySelector('.close-btn');
  const upgradeBtn = modal.querySelector('.upgrade-btn');
  
  const closeModal = () => {
    modal.remove();
    style.remove();
  };
  
  closeBtn.addEventListener('click', closeModal);
  closeModalBtn.addEventListener('click', closeModal);
  
  upgradeBtn.addEventListener('click', () => {
    // Логика улучшения питомца
    pet.level = (pet.level || 1) + 1;
    pet.health = Math.min(100, (pet.health || 50) + 5);
    pet.attack = Math.min(100, (pet.attack || 30) + 3);
    pet.defense = Math.min(100, (pet.defense || 20) + 2);
    pet.speed = Math.min(100, (pet.speed || 50) + 2);
    
    savePets();
    renderPets();
    updateFooterStats();
    showNotification(`${pet.name} улучшен до уровня ${pet.level}!`);
    closeModal();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.body.appendChild(modal);
}

// Показываем уведомление
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4CAF50, #8BC34A);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    z-index: 3000;
    animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
    style.remove();
  }, 3000);
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

// Добавление нового питомца (для тестирования)
window.addDemoPet = function() {
  const newPet = {
    id: Date.now(),
    name: ["Снежок", "Искра", "Брони", "Зефир", "Гром"][Math.floor(Math.random() * 5)],
    type: ["Пингвин", "Феникс", "Черепаха", "Зайчик", "Волк"][Math.floor(Math.random() * 5)],
    rarity: ["Обычный", "Редкий", "Эпический"][Math.floor(Math.random() * 3)],
    icon: ["🐧", "🔥", "🐢", "🐰", "🐺"][Math.floor(Math.random() * 5)],
    image: `https://via.placeholder.com/120/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${encodeURIComponent(["🐧", "🔥", "🐢", "🐰", "🐺"][Math.floor(Math.random() * 5)])}`,
    description: "Новый питомец присоединился к вашей коллекции!",
    level: Math.floor(Math.random() * 5) + 1,
    health: Math.floor(Math.random() * 50) + 50,
    attack: Math.floor(Math.random() * 40) + 30,
    defense: Math.floor(Math.random() * 30) + 20,
    speed: Math.floor(Math.random() * 50) + 50,
    color1: "#" + Math.floor(Math.random()*16777215).toString(16),
    color2: "#" + Math.floor(Math.random()*16777215).toString(16)
  };
  
  petsData.push(newPet);
  savePets();
  renderPets();
  updateFooterStats();
  showNotification(`Добавлен новый питомец: ${newPet.name}!`);
};

// Удаление питомца
window.removePet = function(petId) {
  const index = petsData.findIndex(p => p.id === petId);
  if (index !== -1) {
    const petName = petsData[index].name;
    petsData.splice(index, 1);
    savePets();
    renderPets();
    updateFooterStats();
    showNotification(`Питомец ${petName} удален!`);
  }
};

// Инициализация страницы
function initPage() {
  loadPets();
  createParticles();
  renderPets();
  initMenu();
  
  // Консольные команды для тестирования
  console.log('%c🐾 Команды для тестирования:', 'color: #4CAF50; font-size: 16px;');
  console.log('%caddDemoPet() - добавить демо-питомца', 'color: #2196F3;');
  console.log('%cremovePet(1) - удалить питомца с ID 1', 'color: #FF5722;');
  console.log('%clocalStorage.clear() - очистить всех питомцев', 'color: #FF9800;');
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initPage);