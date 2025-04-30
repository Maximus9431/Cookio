const starsElement = document.getElementById('stars');
const buyButtons = document.querySelectorAll('.buy-button');

// Изначальное количество звезд
let stars = 100; // Установите начальное количество звезд
starsElement.textContent = stars;

// Обработчик покупки
buyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const price = parseInt(button.getAttribute('data-price'));
    const itemName = button.parentElement.querySelector('h2').textContent;
    const itemDescription = button.parentElement.querySelector('p').textContent;

    if (stars >= price) {
      stars -= price;
      starsElement.textContent = stars;

      // Сохраняем предмет в localStorage
      const donatInventory = JSON.parse(localStorage.getItem('donatInventory')) || [];
      donatInventory.push({ name: itemName, description: itemDescription });
      localStorage.setItem('donatInventory', JSON.stringify(donatInventory));

      alert('Покупка успешна! Предмет добавлен в инвентарь.');
    } else {
      alert('Недостаточно звезд!');
    }
  });
});