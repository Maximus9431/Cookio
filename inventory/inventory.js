// inventory.js - Улучшенная версия

let currentItems = [];
let selectedItemIndex = -1;

// Пример данных предметов (в реальности будет загружаться из localStorage)
const sampleItems = [
  {
    id: 1,
    name: "Золотое Яйцо",
    description: "Внутри может быть редкий питомец!",
    price: 150,
    rarity: "rare",
    image: "https://images.unsplash.com/photo-1519690889869-e705e59f72e1?w=400&h=300&fit=crop",
    date: "2024-01-15",
    type: "egg"
  },
  {
    id: 2,
    name: "Кристальная Пыль",
    description: "Для улучшения способностей",
    price: 75,
    rarity: "common",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    date: "2024-01-14",
    type: "resource"
  },
  {
    id: 3,
    name: "Легендарный Ключ",
    description: "Открывает легендарные сундуки",
    price: 500,
    rarity: "legendary",
    image: "https://images.unsplash.com/photo-1542773998-9325f0a098d7?w=400&h=300&fit=crop",
    date: "2024-01-13",
    type: "key"
  },
  {
    id: 4,
    name: "Эликсир Силы",
    description: "+20% к урону на 1 час",
    price: 200,
    rarity: "epic",
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=300&fit=crop",
    date: "2024-01-12",
    type: "potion"
  },
  {
    id: 5,
    name: "Золотая Корона",
    description: "Эксклюзивный донатный предмет",
    price: 1000,
    rarity: "donat",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop",
    date: "2024-01-10",
    type: "cosmetic"
  }
];

// Загрузка инвентаря
function loadInventory() {
  // В реальном приложении загружаем из localStorage
  // let items = JSON.parse(localStorage.getItem('inventory')) || [];
  // let donatItems = JSON.parse(localStorage.getItem('donatInventory')) || [];
  
  // Для демонстрации используем пример
  currentItems = [...sampleItems];
  
  // Объединяем обычные и донатные предметы
  // const allItems = [...items, ...donatItems.map(item => ({...item, isDonat: true}))];
  
  renderInventory(currentItems);
  updateStats(currentItems);
}

// Отображение инвентаря
function renderInventory(items) {
  const inventoryGrid = document.getElementById('inventory-grid');
  
  if (items.length === 0) {
    inventoryGrid.innerHTML = `
      <div class="empty-state" id="empty-state">
        <i class="fas fa-box-open fa-3x"></i>
        <h3>Инвентарь пуст</h3>
        <p>Купите предметы в магазине или получите их в награду!</p>
        <button class="btn-primary" onclick="location.href='../shop/shop.html'">
          <i class="fas fa-shopping-cart"></i> Перейти в магазин
        </button>
      </div>
    `;
    return;
  }
  
  inventoryGrid.innerHTML = '';
  
  items.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('inventory-item');
    itemElement.setAttribute('data-rarity', item.rarity);
    itemElement.setAttribute('data-index', index);
    
    // Цвет редкости
    let rarityColor = '#888';
    let rarityName = 'Обычный';
    switch(item.rarity) {
      case 'rare': rarityColor = '#1E90FF'; rarityName = 'Редкий'; break;
      case 'epic': rarityColor = '#9B30FF'; rarityName = 'Эпический'; break;
      case 'legendary': rarityColor = '#FFD700'; rarityName = 'Легендарный'; break;
      case 'donat': rarityColor = '#FFAA00'; rarityName = 'Донатный'; break;
    }
    
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="item-image">
      <div class="item-info">
        <div class="item-name">
          <span>${item.name}</span>
          <span class="item-rarity ${item.rarity}">${rarityName}</span>
        </div>
        <p class="item-description">${item.description}</p>
        <div class="item-footer">
          <div class="item-price">
            <i class="fas fa-coins"></i>
            ${item.price}
          </div>
          <div class="item-actions">
            <button class="btn-action" data-action="info" data-index="${index}">
              <i class="fas fa-info-circle"></i>
            </button>
            <button class="btn-action" data-action="use" data-index="${index}">
              <i class="fas fa-play-circle"></i>
            </button>
            <button class="btn-action" data-action="delete" data-index="${index}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    inventoryGrid.appendChild(itemElement);
  });
  
  // Добавляем обработчики для предметов
  document.querySelectorAll('.inventory-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-action')) {
        const index = item.getAttribute('data-index');
        showItemModal(index);
      }
    });
  });
  
  // Обработчики для кнопок действий
  document.querySelectorAll('.btn-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = btn.getAttribute('data-index');
      const action = btn.getAttribute('data-action');
      
      switch(action) {
        case 'info':
          showItemModal(index);
          break;
        case 'use':
          useItem(index);
          break;
        case 'delete':
          deleteItem(index);
          break;
      }
    });
  });
}

// Показать модальное окно предмета
function showItemModal(index) {
  selectedItemIndex = index;
  const item = currentItems[index];
  
  document.getElementById('modal-item-name').textContent = item.name;
  document.getElementById('modal-item-image').src = item.image;
  document.getElementById('modal-item-description').textContent = item.description;
  document.getElementById('modal-item-price').textContent = item.price;
  document.getElementById('modal-item-date').textContent = formatDate(item.date);
  
  // Установка редкости
  const rarityElement = document.getElementById('modal-item-rarity');
  let rarityText = '';
  switch(item.rarity) {
    case 'common': rarityText = 'Обычный'; break;
    case 'rare': rarityText = 'Редкий'; break;
    case 'epic': rarityText = 'Эпический'; break;
    case 'legendary': rarityText = 'Легендарный'; break;
    case 'donat': rarityText = 'Донатный'; break;
  }
  rarityElement.textContent = rarityText;
  rarityElement.className = `item-rarity ${item.rarity}`;
  
  // Показать модальное окно
  document.getElementById('item-modal').classList.add('show');
}

// Использовать предмет
function useItem(index) {
  const item = currentItems[index];
  showNotification(`Вы использовали: ${item.name}`, 'success');
  
  // В реальном приложении здесь была бы логика использования
  // Например, если это яйцо - открыть его
  if (item.type === 'egg') {
    setTimeout(() => {
      showNotification('🎉 Из яйца вылупился новый питомец!', 'success');
    }, 1000);
  }
  
  // Обновляем статистику
  updateStats(currentItems);
}

// Удалить предмет
function deleteItem(index) {
  if (confirm('Вы уверены, что хотите удалить этот предмет?')) {
    const item = currentItems[index];
    
    // В реальном приложении удаляем из localStorage
    // let items = JSON.parse(localStorage.getItem('inventory')) || [];
    // items.splice(index, 1);
    // localStorage.setItem('inventory', JSON.stringify(items));
    
    // Удаляем из текущего массива
    currentItems.splice(index, 1);
    
    showNotification(`Предмет "${item.name}" удален`, 'warning');
    renderInventory(currentItems);
    updateStats(currentItems);
  }
}

// Продать предмет (вызывается из модального окна)
function sellItem() {
  if (selectedItemIndex === -1) return;
  
  const item = currentItems[selectedItemIndex];
  const sellPrice = Math.floor(item.price * 0.7); // 70% от цены
  
  if (confirm(`Продать "${item.name}" за ${sellPrice} золота?`)) {
    // В реальном приложении добавляем золото
    const goldElement = document.getElementById('gold-amount');
    let currentGold = parseInt(goldElement.textContent.replace(',', ''));
    goldElement.textContent = (currentGold + sellPrice).toLocaleString();
    
    // Удаляем предмет
    currentItems.splice(selectedItemIndex, 1);
    
    showNotification(`Вы продали "${item.name}" за ${sellPrice} золота`, 'success');
    closeModal();
    renderInventory(currentItems);
    updateStats(currentItems);
  }
}

// Обновление статистики
function updateStats(items) {
  const counts = {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    donat: 0
  };
  
  let totalValue = 0;
  
  items.forEach(item => {
    if (counts.hasOwnProperty(item.rarity)) {
      counts[item.rarity]++;
    }
    totalValue += item.price;
  });
  
  document.getElementById('total-items').textContent = items.length;
  document.getElementById('common-count').textContent = counts.common;
  document.getElementById('rare-count').textContent = counts.rare;
  document.getElementById('epic-count').textContent = counts.epic;
  document.getElementById('legendary-count').textContent = counts.legendary;
  document.getElementById('donat-count').textContent = counts.donat;
  document.getElementById('total-value').innerHTML = `${totalValue.toLocaleString()} <i class="fas fa-coins"></i>`;
  
  // Расчет "счета редкости"
  const rarityScore = 
    counts.common * 1 + 
    counts.rare * 3 + 
    counts.epic * 5 + 
    counts.legendary * 10 + 
    counts.donat * 7;
  document.getElementById('rarity-score').textContent = rarityScore;
}

// Показать уведомление
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  const text = document.getElementById('notification-text');
  
  // Устанавливаем цвет в зависимости от типа
  let borderColor = '#00cc88'; // success по умолчанию
  if (type === 'warning') borderColor = '#ffaa00';
  if (type === 'error') borderColor = '#ff4757';
  if (type === 'info') borderColor = '#1E90FF';
  
  notification.style.borderLeftColor = borderColor;
  text.textContent = message;
  notification.classList.add('show');
  
  // Меняем иконку в зависимости от типа
  const icon = notification.querySelector('i');
  if (type === 'success') icon.className = 'fas fa-check-circle';
  if (type === 'warning') icon.className = 'fas fa-exclamation-triangle';
  if (type === 'error') icon.className = 'fas fa-times-circle';
  if (type === 'info') icon.className = 'fas fa-info-circle';
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
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

// Закрыть модальное окно
function closeModal() {
  document.getElementById('item-modal').classList.remove('show');
  selectedItemIndex = -1;
}

// Фильтрация по вкладкам
function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Убираем активный класс у всех вкладок
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      // Добавляем активный класс текущей вкладке
      tab.classList.add('active');
      
      const tabType = tab.getAttribute('data-tab');
      let filteredItems = [];
      
      if (tabType === 'all') {
        filteredItems = currentItems;
      } else {
        filteredItems = currentItems.filter(item => item.rarity === tabType);
      }
      
      renderInventory(filteredItems);
    });
  });
}

// Поиск предметов
function setupSearch() {
  const searchInput = document.getElementById('search-items');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.trim() === '') {
      // Если поиск пустой, показываем все предметы
      const activeTab = document.querySelector('.tab.active');
      const tabType = activeTab.getAttribute('data-tab');
      
      let filteredItems = [];
      if (tabType === 'all') {
        filteredItems = currentItems;
      } else {
        filteredItems = currentItems.filter(item => item.rarity === tabType);
      }
      
      renderInventory(filteredItems);
    } else {
      // Фильтруем предметы по поисковому запросу
      const filteredItems = currentItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm)
      );
      
      renderInventory(filteredItems);
    }
  });
}

// Сортировка предметов
function setupSorting() {
  const sortSelect = document.getElementById('sort-by');
  sortSelect.addEventListener('change', (e) => {
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
        const rarityOrder = { 'legendary': 0, 'epic': 1, 'rare': 2, 'donat': 3, 'common': 4 };
        sortedItems.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        break;
    }
    
    currentItems = sortedItems;
    renderInventory(currentItems);
  });
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

// Обработчики для модального окна
document.querySelector('.close-modal').addEventListener('click', closeModal);
document.getElementById('sell-item').addEventListener('click', sellItem);
document.getElementById('delete-item').addEventListener('click', () => {
  if (selectedItemIndex !== -1) {
    deleteItem(selectedItemIndex);
    closeModal();
  }
});
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

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();
  setupTabs();
  setupSearch();
  setupSorting();
  
  showNotification('🎒 Инвентарь успешно загружен!', 'success');
  
  // Добавляем анимацию заголовку
  const title = document.querySelector('.inventory-header h1');
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