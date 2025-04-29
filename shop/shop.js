document.querySelectorAll('.buy-button').forEach((button) => {
  button.addEventListener('click', (event) => {
    const itemName = event.target.parentElement.querySelector('h2').textContent;
    const itemDescription = event.target.parentElement.querySelector('p').textContent;

    // Получаем текущий инвентарь из localStorage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    // Добавляем новый предмет
    inventory.push({ name: itemName, description: itemDescription });

    // Сохраняем обновленный инвентарь в localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));

    alert(`Вы купили: ${itemName}`);
  });
});