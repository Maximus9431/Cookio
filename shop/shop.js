// shop.js - Улучшенная версия

// Инициализация данных
let playerGold = 500;
let totalSpent = 0;
let itemsBought = 0;
let playerLevel = 1;

const items = [
  { 
    name: "Золотое Яйцо", 
    price: 150, 
    originalPrice: 200,
    image: "https://images.unsplash.com/photo-1519690889869-e705e59f72e1?w=400&h=300&fit=crop", 
    rarity: "rare",
    discount: 25
  },
  { 
    name: "Кристальное Яйцо", 
    price: 200, 
    originalPrice: 250,
    image: "https://images.unsplash.com/photo-1542773998-9325f0a098d7?w-400&h=300&fit=crop", 
    rarity: "epic",
    discount: 20
  },
  { 
    name: "Легендарное Яйцо", 
    price: 300, 
    originalPrice: 400,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop", 
    rarity: "legendary",
    discount: 25
  },
  { 
    name: "Мистическое Яйцо", 
    price: 180, 
    originalPrice: 200,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop", 
    rarity: "common",
    discount: 10
  },
  { 
    name: "Огненное Яйцо", 
    price: 250, 
    originalPrice: 300,
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=300&fit=crop", 
    rarity: "epic",
    discount: 17
  },
  { 
    name: "Ледяное Яйцо", 
    price: 220, 
    originalPrice: 280,
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop", 
    rarity: "rare",
    discount: 21
  }
];

// Функция для отображения предметов
function renderShop() {
  const itemGrid = document.getElementById('item-grid');
  itemGrid.innerHTML = '';

  items.forEach((item, index) => {
    const itemCard = document.createElement('div');
    itemCard.classList.add('item-card');
    
    // Определяем цвет рамки по редкости
    let rarityColor = '#888';
    if (item.rarity === 'rare') rarityColor = '#1E90FF';
    if (item.rarity === 'epic') rarityColor = '#9B30FF';
    if (item.rarity === 'legendary') rarityColor = '#FFD700';

    itemCard.innerHTML = `
      ${item.discount ? `<div class="discount-badge">-${item.discount}%</div>` : ''}
      <img src="${item.image}" alt="${item.name}" class="item-image">
      <div class="item-info">
        <h3>${item.name}</h3>
        <div class="item-price">
          <i class="fas fa-coins"></i>
          ${item.price} золота
          ${item.originalPrice ? `<span class="original-price">${item.originalPrice}</span>` : ''}
        </div>
        <div class="rarity" style="color: ${rarityColor}; margin-top: 10px;">
          <i class="fas fa-gem"></i> ${item.rarity.toUpperCase()}
        </div>
      </div>
      <button class="buy-button" data-index="${index}" ${playerGold < item.price ? 'disabled' : ''}>
        <i class="fas fa-shopping-cart"></i>
        ${playerGold >= item.price ? 'Купить сейчас' : 'Недостаточно золота'}
      </button>
    `;

    itemGrid.appendChild(itemCard);
  });

  // Обновляем статистику
  updateStats();
  
  // Добавляем обработчики
  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', buyItem);
  });
}

// Функция покупки
function buyItem(event) {
  const index = event.currentTarget.getAttribute('data-index');
  const item = items[index];
  
  if (playerGold >= item.price) {
    playerGold -= item.price;
    totalSpent += item.price;
    itemsBought++;
    
    // Проверяем уровень
    if (totalSpent >= 1000 && playerLevel < 2) {
      playerLevel = 2;
      showNotification(`🎉 Поздравляем! Вы достигли уровня ${playerLevel}!`);
    } else if (totalSpent >= 2000 && playerLevel < 3) {
      playerLevel = 3;
      showNotification(`🏆 Уровень ${playerLevel} разблокирован!`);
    }
    
    // Обновляем интерфейс
    document.getElementById('gold-amount').textContent = playerGold;
    
    // Показываем уведомление
    showNotification(`✅ Вы купили ${item.name} за ${item.price} золота!`, 'success');
    
    // Обновляем кнопки
    document.querySelectorAll('.buy-button').forEach(btn => {
      const btnIndex = btn.getAttribute('data-index');
      const btnItem = items[btnIndex];
      if (playerGold < btnItem.price) {
        btn.innerHTML = '<i class="fas fa-lock"></i> Недостаточно золота';
        btn.disabled = true;
      }
    });
    
    // Обновляем статистику
    updateStats();
    
    // Анимация покупки
    event.currentTarget.innerHTML = '<i class="fas fa-check"></i> Куплено!';
    event.currentTarget.disabled = true;
    
    setTimeout(() => {
      renderShop();
    }, 1500);
    
  } else {
    showNotification('❌ Недостаточно золота для покупки!', 'error');
  }
}

// Функция обновления статистики
function updateStats() {
  document.getElementById('total-spent').textContent = totalSpent;
  document.getElementById('total-items').textContent = itemsBought;
  document.getElementById('player-level').textContent = playerLevel;
}

// Функция показа уведомлений
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const text = document.getElementById('notification-text');
  
  text.textContent = message;
  notification.style.borderLeftColor = type === 'success' ? '#00cc88' : '#ff4757';
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
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

// Клавиатурный доступ
expandButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    expandButton.click();
  }
});

// Автоматическое обновление золота (для демонстрации)
setInterval(() => {
  playerGold += 10;
  document.getElementById('gold-amount').textContent = playerGold;
  renderShop();
}, 10000); // +10 золота каждые 10 секунд

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  renderShop();
  showNotification('🎮 Добро пожаловать в магазин Brawl Stars!', 'success');
  
  // Добавляем анимацию заголовку
  const title = document.querySelector('.shop-title');
  title.style.animation = 'glow 2s ease-in-out infinite alternate';
  
  // Добавляем стиль для анимации свечения
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glow {
      from { text-shadow: 0 0 10px #8535cf, 0 0 20px #8535cf; }
      to { text-shadow: 0 0 20px #ffcc00, 0 0 30px #ffcc00; }
    }
  `;
  document.head.appendChild(style);
});