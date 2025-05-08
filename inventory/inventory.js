const inventoryItemsContainer = document.getElementById('inventory-items');
const donatItemsContainer = document.getElementById('donat-items');

// Загружаем предметы из localStorage
function loadInventory() {
  const items = JSON.parse(localStorage.getItem('inventory')) || [];
  const donatItems = JSON.parse(localStorage.getItem('donatInventory')) || [];

  inventoryItemsContainer.innerHTML = ''; // Очищаем контейнер
  donatItemsContainer.innerHTML = ''; // Очищаем контейнер для донатных предметов

  if (items.length === 0) {
    inventoryItemsContainer.innerHTML = '<p>Ваш инвентарь пуст.</p>';
  } else {
    items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('inventory-item');
      itemElement.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="delete-button" data-index="${index}">Удалить</button>
      `;
      inventoryItemsContainer.appendChild(itemElement);
    });
  }

  if (donatItems.length === 0) {
    donatItemsContainer.innerHTML = '<p>У вас нет донатных предметов.</p>';
  } else {
    donatItems.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('inventory-item');
      itemElement.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="delete-button" data-index="${index}" data-type="donat">Удалить</button>
      `;
      donatItemsContainer.appendChild(itemElement);
    });
  }

  // Добавляем обработчики событий для кнопок "Удалить"
  document.querySelectorAll('.delete-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index');
      const type = event.target.getAttribute('data-type');

      if (type === 'donat') {
        deleteDonatItem(index);
      } else {
        deleteItem(index);
      }
    });
  });
}

// Удаление обычного предмета
function deleteItem(index) {
  const items = JSON.parse(localStorage.getItem('inventory')) || [];
  items.splice(index, 1); // Удаляем элемент по индексу
  localStorage.setItem('inventory', JSON.stringify(items)); // Сохраняем обновленный инвентарь
  loadInventory(); // Обновляем отображение
}

// Удаление донатного предмета
function deleteDonatItem(index) {
  const donatItems = JSON.parse(localStorage.getItem('donatInventory')) || [];
  donatItems.splice(index, 1); // Удаляем элемент по индексу
  localStorage.setItem('donatInventory', JSON.stringify(donatItems)); // Сохраняем обновленный инвентарь
  loadInventory(); // Обновляем отображение
}

// Загружаем инвентарь при загрузке страницы
loadInventory();

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