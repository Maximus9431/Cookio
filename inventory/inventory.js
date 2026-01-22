// inventory_new.js - Обновленная версия в стиле игровой коллекции

let currentItems = [];
let selectedItemIndex = -1;
let currentCategory = 'all';

// Пример данных предметов
const sampleItems = [
  {
    id: 1,
    name: "Золотое Яйцо",
    description: "Внутри может быть редкий питомец! Откройте, чтобы получить случайного питомца.",
    price: 150,
    rarity: "rare",
    type: "Яйцо",
    icon: "🥚",
    color: "#FFD700",
    date: "2024-01-15",
    stats: {
      value: "150g",
      chance: "Высокая",
      weight: "Легкое"
    }
  },
  {
    id: 2,
    name: "Кристальная Пыль",
    description: "Волшебная пыль для улучшения способностей ваших питомцев.",
    price: 75,
    rarity: "common",
    type: "Ресурс",
    icon: "✨",
    color: "#36D1DC",
    date: "2024-01-14",
    stats: {
      value: "75g",
      quantity: "100шт",
      effect: "+5% к опыту"
    }
  },
  {
    id: 3,
    name: "Легендарный Ключ",
    description: "Открывает легендарные сундуки с гарантированными редкими наградами.",
    price: 500,
    rarity: "legendary",
    type: "Ключ",
    icon: "🔑",
    color: "#FFD700",
    date: "2024-01-13",
    stats: {
      value: "500g",
      rarity: "Легендарный",
      uses: "1 раз"
    }
  },
  {
    id: 4,
    name: "Эликсир Силы",
    description: "Увеличивает урон ваших питомцев на 20% на 1 час.",
    price: 200,
    rarity: "epic",
    type: "Зелье",
    icon: "🧪",
    color: "#9B30FF",
    date: "2024-01-12",
    stats: {
      value: "200g",
      duration: "1 час",
      effect: "+20% урон"
    }
  },
  {
    id: 5,
    name: "Золотая Корона",
    description: "Эксклюзивный предмет для истинных королей арены.",
    price: 1000,
    rarity: "special",
    type: "Косметика",
    icon: "👑",
    color: "#FF5E62",
    date: "2024-01-10",
    stats: {
      value: "1000g",
      rarity: "Особый",
      exclusive: "Да"
    }
  },
  {
    id: 6,
    name: "Меч Воина",
    description: "Острое оружие для битв на арене.",
    price: 350,
    rarity: "rare",
    type: "Оружие",
    icon: "⚔️",
    color: "#1E90FF",
    date: "2024-01-09",
    stats: {
      value: "350g",
      damage: "+15",
      level: "10+"
    }
  },
  {
    id: 7,
    name: "Щит Защитника",
    description: "Надежная защита от вражеских атак.",
    price: 280,
    rarity: "common",
    type: "Броня",
    icon: "🛡️",
    color: "#888888",
    date: "2024-01-08",
    stats: {
      value: "280g",
      defense: "+10",
      durability: "100"
    }
  },
  {
    id: 8,
    name: "Книга Заклинаний",
    description: "Древняя книга с мощными заклинаниями.",
    price: 600,
    rarity: "epic",
    type: "Магия",
    icon: "📖",
    color: "#9B30FF",
    date: "2024-01-07",
    stats: {
      value: "600g",
      spells: "3",
      power: "Сильная"
    }
  }
];

// Загрузка инвентаря
function loadInventory() {
  // Для демонстрации используем пример
  currentItems = [...sampleItems];
  
  createParticles();
  renderItems();
  updateStats();
  setupEventListeners();
  showNotification("🎒 Инвентарь успешно загружен!", "success");
}

// Создание частиц для фона
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 25;
  
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

// Отображение предметов
function renderItems() {
  const itemsGrid = document.getElementById('items-grid');
  
  // Фильтрация по категории
  let filteredItems = currentItems;
  if (currentCategory !== 'all') {
    filteredItems = currentItems.filter(item => item.rarity === currentCategory);
  }
  
  if (filteredItems.length === 0) {
    itemsGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>В этой категории пусто</h3>
        <p>Попробуйте другую категорию или купите новые предметы!</p>
        <button class="btn-primary" onclick="location.href='../shop/shop.html'" style="margin-top: 20px;">
          <i class="fas fa-shopping-cart"></i> Перейти в магазин
        </button>
      </div>
    `;
    return;
  }
  
  itemsGrid.innerHTML = '';
  
  filteredItems.forEach((item, index) => {
    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';
    itemCard.setAttribute('data-rarity', item.rarity);
    itemCard.style.setProperty('--item-color', item.color);
    
    // Получаем статистику предмета
    const stats = Object.entries(item.stats || {});
    
    itemCard.innerHTML = `
      <div class="rarity-badge">${getRarityName(item.rarity)}</div>
      
      <div class="item-header">
        <div class="item-icon" style="background: ${item.color}20; border-color: ${item.color}50;">
          ${item.icon}
        </div>
        <div class="item-title">${item.name}</div>
      </div>
      
      <div class="item-description">
        ${item.description}
      </div>
      
      <div class="item-stats">
        ${stats.slice(0, 3).map(([key, value]) => `
          <div class="stat">
            <div class="stat-value">${value}</div>
            <div class="stat-label">${getStatLabel(key)}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="item-actions">
        <button class="action-btn" data-action="info" data-index="${index}">
          <i class="fas fa-info-circle"></i> Подробнее
        </button>
        <button class="action-btn" data-action="use" data-index="${index}">
          <i class="fas fa-play-circle"></i> Использовать
        </button>
      </div>
    `;
    
    itemsGrid.appendChild(itemCard);
  });
  
  // Добавляем обработчики для кнопок
  setupItemButtons();
}

// Получение названия редкости
function getRarityName(rarity) {
  const names = {
    'common': 'Обычный',
    'rare': 'Редкий',
    'epic': 'Эпический',
    'legendary': 'Легендарный',
    'special': 'Особый'
  };
  return names[rarity] || rarity;
}

// Получение названия статистики
function getStatLabel(key) {
  const labels = {
    'value': 'Цена',
    'chance': 'Шанс',
    'weight': 'Вес',
    'quantity': 'Кол-во',
    'effect': 'Эффект',
    'rarity': 'Редкость',
    'uses': 'Использования',
    'duration': 'Длительность',
    'exclusive': 'Эксклюзив',
    'damage': 'Урон',
    'level': 'Уровень',
    'defense': 'Защита',
    'durability': 'Прочность',
    'spells': 'Заклинания',
    'power': 'Сила'
  };
  return labels[key] || key;
}

// Настройка обработчиков для кнопок
function setupItemButtons() {
  document.querySelectorAll('.action-btn[data-action="info"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'));
      showItemModal(index);
    });
  });
  
  document.querySelectorAll('.action-btn[data-action="use"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'));
      useItem(index);
    });
  });
}

// Показать модальное окно предмета
function showItemModal(index) {
  selectedItemIndex = index;
  const item = currentItems[index];
  
  document.getElementById('modal-item-name').textContent = item.name;
  document.getElementById('modal-item-image').src = `https://images.unsplash.com/photo-${item.id + 150}?w=400&h=300&fit=crop`;
  document.getElementById('modal-item-description').textContent = item.description;
  document.getElementById('modal-item-price').textContent = item.price;
  document.getElementById('modal-item-date').textContent = formatDate(item.date);
  document.getElementById('modal-item-type').textContent = item.type;
  
  // Установка редкости
  const rarityElement = document.getElementById('modal-item-rarity');
  rarityElement.textContent = getRarityName(item.rarity);
  rarityElement.className = 'item-rarity-badge';
  rarityElement.style.background = `${item.color}20`;
  rarityElement.style.color = item.color;
  rarityElement.style.border = `1px solid ${item.color}50`;
  
  document.getElementById('item-modal').classList.add('show');
}

// Использовать предмет
function useItem(index) {
  const item = currentItems[index];
  showNotification(`🎯 Вы использовали: ${item.name}`, "success");
  
  // Симуляция использования
  if (item.type === 'Яйцо') {
    setTimeout(() => {
      showNotification('🎉 Из яйца вылупился новый питомец!', "success");
    }, 1000);
  } else if (item.type === 'Зелье') {
    showNotification('⚗️ Эффект зелья активен в течение 1 часа!', "info");
  }
}

// Удалить предмет
function deleteItem() {
  if (selectedItemIndex === -1) return;
  
  const item = currentItems[selectedItemIndex];
  
  if (confirm(`Вы уверены, что хотите удалить "${item.name}"?`)) {
    currentItems.splice(selectedItemIndex, 1);
    
    showNotification(`🗑️ Предмет "${item.name}" удален`, "warning");
    closeModal();
    renderItems();
    updateStats();
  }
}

// Продать предмет
function sellItem() {
  if (selectedItemIndex === -1) return;
  
  const item = currentItems[selectedItemIndex];
  const sellPrice = Math.floor(item.price * 0.7); // 70% от цены
  
  if (confirm(`Продать "${item.name}" за ${sellPrice} золота?`)) {
    // Обновляем золото
    const goldElement = document.getElementById('gold-amount');
    let currentGold = parseInt(goldElement.textContent.replace(',', '')) || 2540;
    goldElement.textContent = (currentGold + sellPrice).toLocaleString();
    
    // Удаляем предмет
    currentItems.splice(selectedItemIndex, 1);
    
    showNotification(`💰 Вы продали "${item.name}" за ${sellPrice} золота`, "success");
    closeModal();
    renderItems();
    updateStats();
  }
}

// Обновление статистики
function updateStats() {
  const counts = {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    special: 0
  };
  
  let totalValue = 0;
  
  currentItems.forEach(item => {
    if (counts.hasOwnProperty(item.rarity)) {
      counts[item.rarity]++;
    }
    totalValue += item.price;
  });
  
  document.getElementById('total-items').textContent = currentItems.length;
  document.getElementById('total-value').textContent = `${totalValue.toLocaleString()} золота`;
  document.getElementById('common-count').textContent = counts.common;
  document.getElementById('rare-count').textContent = counts.rare;
  document.getElementById('epic-count').textContent = counts.epic;
  document.getElementById('legendary-count').textContent = counts.legendary;
  document.getElementById('special-count').textContent = counts.special;
}

// Форматирование даты
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'сегодня';
  if (days === 1) return 'вчера';
  if (days < 7) return `${days} дня назад`;
  if (days < 30) return `${Math.floor(days / 7)} недели назад`;
  
  return date.toLocaleDateString('ru-RU');
}

// Показать уведомление
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  const text = document.getElementById('notification-text');
  
  // Устанавливаем цвет в зависимости от типа
  let borderColor = '#36D1DC';
  if (type === 'success') borderColor = '#00cc88';
  if (type === 'warning') borderColor = '#ffaa00';
  if (type === 'error') borderColor = '#ff4757';
  
  notification.style.borderLeftColor = borderColor;
  text.textContent = message;
  
  // Меняем иконку
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
  document.getElementById('item-modal').classList.remove('show');
  selectedItemIndex = -1;
}

// Настройка обработчиков событий
function setupEventListeners() {
  // Вкладки категорий
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderItems();
    });
  });
  
  // Поиск
  document.getElementById('search-items').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.trim() === '') {
      renderItems();
    } else {
      const filteredItems = currentItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm)
      );
      
      renderFilteredItems(filteredItems);
    }
  });
  
  // Сортировка
  document.getElementById('sort-by').addEventListener('change', (e) => {
    const sortType = e.target.value;
    let sortedItems = [...currentItems];
    
    switch(sortType) {
      case 'newest':
        sortedItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        sortedItems.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'price-high':
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case 'rarity':
        const rarityOrder = { 'legendary': 0, 'epic': 1, 'rare': 2, 'special': 3, 'common': 4 };
        sortedItems.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        break;
    }
    
    currentItems = sortedItems;
    renderItems();
  });
  
  // Переключение вида
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Здесь можно добавить логику переключения между сеткой и списком
    });
  });
  
  // Модальное окно
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.getElementById('sell-item').addEventListener('click', sellItem);
  document.getElementById('delete-item').addEventListener('click', deleteItem);
  document.getElementById('use-item').addEventListener('click', () => {
    if (selectedItemIndex !== -1) {
      useItem(selectedItemIndex);
      closeModal();
    }
  });
  
  // Закрытие модального окна при клике вне его
  document.getElementById('item-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('item-modal')) {
      closeModal();
    }
  });
}

// Отображение отфильтрованных предметов (для поиска)
function renderFilteredItems(items) {
  const itemsGrid = document.getElementById('items-grid');
  
  if (items.length === 0) {
    itemsGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>Ничего не найдено</h3>
        <p>Попробуйте другой поисковый запрос</p>
      </div>
    `;
    return;
  }
  
  itemsGrid.innerHTML = '';
  
  items.forEach((item, index) => {
    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';
    itemCard.setAttribute('data-rarity', item.rarity);
    itemCard.style.setProperty('--item-color', item.color);
    
    const stats = Object.entries(item.stats || {});
    
    itemCard.innerHTML = `
      <div class="rarity-badge">${getRarityName(item.rarity)}</div>
      
      <div class="item-header">
        <div class="item-icon" style="background: ${item.color}20; border-color: ${item.color}50;">
          ${item.icon}
        </div>
        <div class="item-title">${item.name}</div>
      </div>
      
      <div class="item-description">
        ${item.description}
      </div>
      
      <div class="item-stats">
        ${stats.slice(0, 3).map(([key, value]) => `
          <div class="stat">
            <div class="stat-value">${value}</div>
            <div class="stat-label">${getStatLabel(key)}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="item-actions">
        <button class="action-btn" data-action="info">
          <i class="fas fa-info-circle"></i> Подробнее
        </button>
        <button class="action-btn" data-action="use">
          <i class="fas fa-play-circle"></i> Использовать
        </button>
      </div>
    `;
    
    itemsGrid.appendChild(itemCard);
  });
  
  setupItemButtons();
}

// Функции быстрых действий
function sortAllItems() {
  showNotification('📊 Предметы отсортированы по редкости', 'info');
  const sortSelect = document.getElementById('sort-by');
  sortSelect.value = 'rarity';
  sortSelect.dispatchEvent(new Event('change'));
}

function sellAllCommon() {
  const commonItems = currentItems.filter(item => item.rarity === 'common');
  if (commonItems.length === 0) {
    showNotification('⚠️ Обычных предметов для продажи нет', 'warning');
    return;
  }
  
  const totalPrice = commonItems.reduce((sum, item) => sum + Math.floor(item.price * 0.7), 0);
  
  if (confirm(`Продать все обычные предметы (${commonItems.length}шт) за ${totalPrice} золота?`)) {
    currentItems = currentItems.filter(item => item.rarity !== 'common');
    
    const goldElement = document.getElementById('gold-amount');
    let currentGold = parseInt(goldElement.textContent.replace(',', '')) || 2540;
    goldElement.textContent = (currentGold + totalPrice).toLocaleString();
    
    showNotification(`💰 Продано ${commonItems.length} предметов за ${totalPrice} золота`, 'success');
    renderItems();
    updateStats();
  }
}

function backupInventory() {
  showNotification('💾 Инвентарь сохранен в облако', 'success');
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

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();
});