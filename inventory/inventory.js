// Получаем контейнер для предметов
const inventoryItemsContainer = document.getElementById('inventory-items');

// Загружаем предметы из localStorage
function loadInventory() {
  const items = JSON.parse(localStorage.getItem('inventory')) || [];
  inventoryItemsContainer.innerHTML = ''; // Очищаем контейнер

  if (items.length === 0) {
    inventoryItemsContainer.innerHTML = '<p>Ваш инвентарь пуст.</p>';
    return;
  }

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

  // Добавляем обработчики событий для кнопок "Удалить"
  document.querySelectorAll('.delete-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index');
      deleteItem(index);
    });
  });
}

// Удаление предмета из localStorage
function deleteItem(index) {
  const items = JSON.parse(localStorage.getItem('inventory')) || [];
  items.splice(index, 1); // Удаляем элемент по индексу
  localStorage.setItem('inventory', JSON.stringify(items)); // Сохраняем обновленный инвентарь
  loadInventory(); // Обновляем отображение
}

// Загружаем инвентарь при загрузке страницы
loadInventory();