const starsElement = document.getElementById('stars');
const buyButtons = document.querySelectorAll('.buy-button');

// Получаем количество звезд
let stars = parseInt(localStorage.getItem('stars')) || 100; // Пример: 100 звезд
starsElement.textContent = stars;

// Уникальный идентификатор разработчика
const developerId = 'admin'; // Замените на ваш уникальный идентификатор

// Показываем кнопку для добавления звезд только для разработчика
const addStarsButton = document.getElementById('add-stars-button');
if (localStorage.getItem('developerId') === developerId) {
  addStarsButton.style.display = 'block';
}

// Функция для обновления количества звезд
function updateStars(newStars) {
  stars = newStars;
  localStorage.setItem('stars', stars);
  starsElement.textContent = stars;
}

// Функция для выдачи валюты (только для разработчика)
function addStars(amount) {
  const currentDeveloperId = localStorage.getItem('developerId');
  if (currentDeveloperId === developerId) {
    updateStars(stars + amount);
    alert(`Вы добавили ${amount} ⭐. Теперь у вас ${stars} ⭐.`);
  } else {
    alert('У вас нет прав для выполнения этой операции.');
  }
}

// Обработчик покупки
buyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const price = parseInt(button.getAttribute('data-price'));
    const itemName = button.parentElement.querySelector('h2').textContent;
    const itemDescription = button.parentElement.querySelector('p').textContent;

    if (stars >= price) {
      updateStars(stars - price);

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

// Функция для покупки донатного яйца
function buyDonateEgg() {
  const eggPrice = 100;

  if (stars < eggPrice) {
    alert('Недостаточно звезд для покупки донатного яйца!');
    return;
  }

  // Списываем звезды
  updateStars(stars - eggPrice);

  // Добавляем эксклюзивного питомца
  const exclusivePets = [
    { name: "Феникс", rarity: "Эксклюзивный", image: "../pets/exclusive_phoenix.png" },
    { name: "Единорог", rarity: "Эксклюзивный", image: "../pets/exclusive_unicorn.png" },
    { name: "Дракон", rarity: "Эксклюзивный", image: "../pets/exclusive_dragon.png" },
  ];

  const randomIndex = Math.floor(Math.random() * exclusivePets.length);
  const selectedPet = exclusivePets[randomIndex];

  // Сохраняем питомца в localStorage
  let pets = JSON.parse(localStorage.getItem('pets')) || [];
  pets.push(selectedPet);
  localStorage.setItem('pets', JSON.stringify(pets));

  alert(`Поздравляем! Вы выбили эксклюзивного питомца: ${selectedPet.name}!`);
}