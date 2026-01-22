// shop.js - Игровой магазин

// Инициализация данных
let playerGold = 500;
let playerGems = 25;
let playerTickets = 10;
let totalSpent = 0;
let itemsBought = 0;
let shopLevel = 1;
let dailyStreak = 1;

const items = [
  { 
    id: 1,
    name: "Золотое Яйцо", 
    price: 150,
    originalPrice: 200,
    currency: "gold",
    image: "https://images.unsplash.com/photo-1519690889869-e705e59f72e1?w=400&h=300&fit=crop", 
    rarity: "rare",
    category: "eggs",
    description: "Шанс получить редкого или эпического питомца",
    discount: 25
  },
  { 
    id: 2,
    name: "Кристальное Яйцо", 
    price: 200,
    originalPrice: 250,
    currency: "gold",
    image: "https://images.unsplash.com/photo-1542773998-9325f0a098d7?w=400&h=300&fit=crop", 
    rarity: "epic",
    category: "eggs",
    description: "Гарантированный эпический питомец + шанс на легендарного",
    discount: 20
  },
  { 
    id: 3,
    name: "Легендарное Яйцо", 
    price: 5,
    originalPrice: 8,
    currency: "gems",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop", 
    rarity: "legendary",
    category: "eggs",
    description: "Гарантированный легендарный питомец с уникальными способностями",
    discount: 37
  },
  { 
    id: 4,
    name: "Бустер опыта x2", 
    price: 50,
    currency: "gold",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop", 
    rarity: "common",
    category: "boosters",
    description: "Удваивает получаемый опыт на 1 час",
    discount: 0
  },
  { 
    id: 5,
    name: "Бустер удачи", 
    price: 3,
    currency: "gems",
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=300&fit=crop", 
    rarity: "rare",
    category: "boosters",
    description: "Увеличивает шанс выпадения редких предметов на 50%",
    discount: 0
  },
  { 
    id: 6,
    name: "Мешок золота", 
    price: 2,
    originalPrice: 3,
    currency: "gems",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop", 
    rarity: "rare",
    category: "currency",
    description: "Содержит 500-1000 золотых монет",
    discount: 33
  },
  { 
    id: 7,
    name: "Набор новичка", 
    price: 300,
    originalPrice: 500,
    currency: "gold",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop", 
    rarity: "epic",
    category: "special",
    description: "Яйцо + бустер опыта + 100 золота",
    discount: 40
  },
  { 
    id: 8,
    name: "Мистическая шкатулка", 
    price: 10,
    currency: "gems",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop", 
    rarity: "legendary",
    category: "special",
    description: "Случайный легендарный предмет или питомец",
    discount: 0
  }
];

// Ежедневные предложения (обновляются каждый день)
const dailyOffers = [
  { 
    name: "Счастливое Яйцо",
    price: 100,
    currency: "gold",
    discount: 50,
    limit: 3
  },
  { 
    name: "Набор для игры",
    price: 1,
    currency: "gems",
    discount: 80,
    limit: 1
  },
  { 
    name: "Подарочный набор",
    price: 250,
    currency: "gold",
    discount: 30,
    limit: 2
  }
];

let selectedItem = null;
let currentCategory = 'all';

// Функция для отображения предметов
function renderShop() {
  const itemGrid = document.getElementById('item-grid');
  itemGrid.innerHTML = '';

  // Фильтруем товары по категории
  const filteredItems = currentCategory === 'all' 
    ? items 
    : items.filter(item => item.category === currentCategory);

  filteredItems.forEach((item) => {
    const itemCard = document.createElement('div');
    itemCard.classList.add('item-card');
    
    // Определяем цвет рамки по редкости
    let rarityClass = 'rarity-common';
    if (item.rarity === 'rare') rarityClass = 'rarity-rare';
    if (item.rarity === 'epic') rarityClass = 'rarity-epic';
    if (item.rarity === 'legendary') rarityClass = 'rarity-legendary';

    // Проверяем, хватает ли валюты
    let canAfford = false;
    let currencyIcon = '';
    let currencyClass = '';
    
    if (item.currency === 'gold') {
      canAfford = playerGold >= item.price;
      currencyIcon = '<i class="fas fa-coins"></i>';
      currencyClass = 'price-gold';
    } else if (item.currency === 'gems') {
      canAfford = playerGems >= item.price;
      currencyIcon = '<i class="fas fa-gem"></i>';
      currencyClass = 'price-gems';
    }

    itemCard.innerHTML = `
      ${item.discount ? `<div class="discount-badge">-${item.discount}%</div>` : ''}
      <div class="rarity-badge ${rarityClass}">${item.rarity.toUpperCase()}</div>
      <img src="${item.image}" alt="${item.name}" class="item-image">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p class="item-description">${item.description}</p>
        <div class="item-price ${currencyClass}">
          ${currencyIcon}
          ${item.price} ${item.currency === 'gold' ? 'золота' : 'самоцветов'}
          ${item.originalPrice ? `<span class="original-price">${item.originalPrice}</span>` : ''}
        </div>
      </div>
      <button class="buy-button" data-id="${item.id}" ${!canAfford ? 'disabled' : ''}>
        <i class="fas fa-shopping-cart"></i>
        ${canAfford ? 'Купить сейчас' : 'Недостаточно средств'}
      </button>
    `;

    itemGrid.appendChild(itemCard);
  });

  // Обновляем статистику
  updateStats();
  
  // Добавляем обработчики кнопок
  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = parseInt(e.currentTarget.getAttribute('data-id'));
      const item = items.find(i => i.id === itemId);
      if (item) {
        showPurchaseModal(item);
      }
    });
  });
}

// Функция для отображения ежедневных предложений
function renderDailyOffers() {
  const offersContainer = document.getElementById('daily-offers');
  offersContainer.innerHTML = '';

  dailyOffers.forEach((offer, index) => {
    const offerCard = document.createElement('div');
    offerCard.classList.add('offer-card');
    
    const currencyIcon = offer.currency === 'gold' 
      ? '<i class="fas fa-coins"></i>' 
      : '<i class="fas fa-gem"></i>';
    
    offerCard.innerHTML = `
      <h4>${offer.name}</h4>
      <div class="item-price ${offer.currency === 'gold' ? 'price-gold' : 'price-gems'}">
        ${currencyIcon}
        ${offer.price} ${offer.currency === 'gold' ? 'золота' : 'самоцветов'}
        <span class="original-price">${Math.round(offer.price / (1 - offer.discount/100))}</span>
      </div>
      <p>Скидка: <span style="color: #ff4757; font-weight: bold;">${offer.discount}%</span></p>
      <p>Лимит: ${offer.limit} шт/день</p>
      <button class="buy-button" data-offer="${index}" style="margin-top: 10px; width: 100%;">
        <i class="fas fa-bolt"></i> Купить
      </button>
    `;

    offersContainer.appendChild(offerCard);
  });

  // Обработчики для предложений
  document.querySelectorAll('.offer-card .buy-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const offerIndex = parseInt(e.currentTarget.getAttribute('data-offer'));
      const offer = dailyOffers[offerIndex];
      
      // Создаем временный объект товара
      const tempItem = {
        id: 100 + offerIndex,
        name: offer.name,
        price: offer.price,
        currency: offer.currency,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
        rarity: 'epic',
        description: 'Специальное ежедневное предложение'
      };
      
      showPurchaseModal(tempItem);
    });
  });
}

// Функция показа модального окна покупки
function showPurchaseModal(item) {
  selectedItem = item;
  const modal = document.getElementById('purchase-modal');
  const modalImage = document.getElementById('modal-item-image');
  const modalName = document.getElementById('modal-item-name');
  const modalDescription = document.getElementById('modal-item-description');
  const modalPrice = document.getElementById('modal-price-amount');
  const modalCurrency = document.getElementById('modal-price-currency');
  const modalGoldBalance = document.getElementById('modal-gold-balance');
  const modalGemsBalance = document.getElementById('modal-gems-balance');
  
  // Заполняем данные
  modalImage.src = item.image;
  modalImage.alt = item.name;
  modalName.textContent = item.name;
  modalDescription.textContent = item.description;
  modalPrice.textContent = item.price;
  modalPrice.style.color = item.currency === 'gold' ? '#FFD700' : '#9C27B0';
  modalCurrency.innerHTML = item.currency === 'gold' 
    ? '<i class="fas fa-coins"></i> золота' 
    : '<i class="fas fa-gem"></i> самоцветов';
  
  modalGoldBalance.textContent = playerGold;
  modalGemsBalance.textContent = playerGems;
  
  // Показываем модальное окно
  modal.classList.add('show');
  
  // Обработчики кнопок модального окна
  const closeBtn = modal.querySelector('.modal-close');
  const cancelBtn = modal.querySelector('.cancel-btn');
  const confirmBtn = modal.querySelector('.confirm-btn');
  
  const closeModal = () => {
    modal.classList.remove('show');
    selectedItem = null;
  };
  
  closeBtn.onclick = closeModal;
  cancelBtn.onclick = closeModal;
  
  confirmBtn.onclick = () => {
    purchaseItem(selectedItem);
    closeModal();
  };
  
  // Закрытие при клике вне окна
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeModal();
    }
  };
}

// Функция покупки
function purchaseItem(item) {
  let canAfford = false;
  
  if (item.currency === 'gold' && playerGold >= item.price) {
    playerGold -= item.price;
    canAfford = true;
  } else if (item.currency === 'gems' && playerGems >= item.price) {
    playerGems -= item.price;
    canAfford = true;
  }
  
  if (canAfford) {
    totalSpent += item.price;
    itemsBought++;
    
    // Проверяем уровень магазина
    if (totalSpent >= 1000 && shopLevel < 2) {
      shopLevel = 2;
      showNotification(`🎉 Поздравляем! Уровень магазина повышен до ${shopLevel}!`, 'success');
    } else if (totalSpent >= 3000 && shopLevel < 3) {
      shopLevel = 3;
      showNotification(`🏆 Уровень магазина ${shopLevel} разблокирован! Новые товары доступны!`, 'success');
    }
    
    // Обновляем интерфейс
    document.getElementById('gold-amount').textContent = playerGold;
    document.getElementById('gems-amount').textContent = playerGems;
    
    // Показываем уведомление
    showNotification(`✅ Вы купили "${item.name}" за ${item.price} ${item.currency === 'gold' ? 'золота' : 'самоцветов'}!`, 'success');
    
    // Обновляем статистику
    updateStats();
    
    // Обновляем магазин
    renderShop();
    
  } else {
    showNotification(`❌ Недостаточно ${item.currency === 'gold' ? 'золота' : 'самоцветов'} для покупки!`, 'error');
  }
}

// Функция обновления статистики
function updateStats() {
  document.getElementById('total-spent').textContent = totalSpent;
  document.getElementById('total-items').textContent = itemsBought;
  document.getElementById('shop-level').textContent = shopLevel;
  document.getElementById('daily-streak').textContent = dailyStreak;
}

// Функция показа уведомлений
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const text = document.getElementById('notification-text');
  
  text.textContent = message;
  notification.className = 'notification';
  notification.classList.add(type);
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Функция обновления таймера ежедневных предложений
function updateDailyTimer() {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  const timerElement = document.getElementById('daily-timer');
  timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Инициализация меню
function initMenu() {
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
  
  // Категории товаров
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      // Убираем активный класс у всех вкладок
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      
      // Добавляем активный класс текущей вкладке
      e.currentTarget.classList.add('active');
      
      // Устанавливаем текущую категорию
      currentCategory = e.currentTarget.getAttribute('data-category');
      
      // Обновляем отображение товаров
      renderShop();
    });
  });
}

// Создание частиц для фона
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.prepend(particlesContainer);
  
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
      'rgba(133, 53, 207, 0.2)',
      'rgba(54, 209, 220, 0.2)',
      'rgba(255, 153, 102, 0.2)',
      'rgba(255, 152, 0, 0.2)',
      'rgba(156, 39, 176, 0.2)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    particlesContainer.appendChild(particle);
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderShop();
  renderDailyOffers();
  initMenu();
  
  // Обновляем таймер каждую секунду
  updateDailyTimer();
  setInterval(updateDailyTimer, 1000);
  
  // Автоматическое получение валюты (для демонстрации)
  setInterval(() => {
    playerGold += 5;
    document.getElementById('gold-amount').textContent = playerGold;
    renderShop();
  }, 30000); // +5 золота каждые 30 секунд
  
  // Приветственное сообщение
  setTimeout(() => {
    showNotification('🎮 Добро пожаловать в Игровой Магазин!', 'success');
  }, 1000);
});

// Функции для консоли (для тестирования)
window.addGold = function(amount) {
  playerGold += amount;
  document.getElementById('gold-amount').textContent = playerGold;
  renderShop();
  showNotification(`💰 Добавлено ${amount} золота!`, 'success');
};

window.addGems = function(amount) {
  playerGems += amount;
  document.getElementById('gems-amount').textContent = playerGems;
  renderShop();
  showNotification(`💎 Добавлено ${amount} самоцветов!`, 'success');
};

window.resetShop = function() {
  playerGold = 500;
  playerGems = 25;
  totalSpent = 0;
  itemsBought = 0;
  shopLevel = 1;
  dailyStreak = 1;
  
  document.getElementById('gold-amount').textContent = playerGold;
  document.getElementById('gems-amount').textContent = playerGems;
  updateStats();
  renderShop();
  showNotification('🔄 Магазин сброшен!', 'warning');
};