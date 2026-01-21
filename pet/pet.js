// Проверяем, есть ли сохраненные питомцы в localStorage
let pets = JSON.parse(localStorage.getItem('pets')) || [];

// Если нет питомцев, добавляем демо-питомцев
if (pets.length === 0) {
  pets = [
    {
      id: 1,
      name: "Огнегрыз",
      rarity: "Легендарный",
      image: "https://via.placeholder.com/120/FF5722/FFFFFF?text=🐲",
      type: "Дракон",
      level: 15,
      health: 95,
      attack: 88
    },
    {
      id: 2,
      name: "Пушистик",
      rarity: "Обычный",
      image: "https://via.placeholder.com/120/4CAF50/FFFFFF?text=🐱",
      type: "Кот",
      level: 5,
      health: 65,
      attack: 45
    },
    {
      id: 3,
      name: "Молния",
      rarity: "Редкий",
      image: "https://via.placeholder.com/120/2196F3/FFFFFF?text=⚡",
      type: "Единорог",
      level: 10,
      health: 75,
      attack: 70
    },
    {
      id: 4,
      name: "Тень",
      rarity: "Эпический",
      image: "https://via.placeholder.com/120/9C27B0/FFFFFF?text=👻",
      type: "Призрак",
      level: 12,
      health: 80,
      attack: 82
    }
  ];
  localStorage.setItem('pets', JSON.stringify(pets));
}

// Контейнер для питомцев
const petsContainer = document.getElementById('pets-container');

// Цвета для редкостей
const rarityColors = {
  'Обычный': '#4CAF50',
  'Редкий': '#2196F3',
  'Эпический': '#9C27B0',
  'Легендарный': '#FF9800',
  'Мифический': '#FF5722'
};

// Отображение питомцев
function displayPets() {
  petsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением
  
  if (pets.length === 0) {
    petsContainer.innerHTML = `
      <div class="empty-message">
        <p>У вас пока нет питомцев 😢</p>
        <p>Выбивайте их из яиц в магазине!</p>
        <button onclick="addDemoPet()" style="margin-top: 20px; padding: 10px 20px; border-radius: 10px; background: #ff5722; color: white; border: none; cursor: pointer; font-size: 16px;">
          Добавить демо-питомца
        </button>
      </div>
    `;
    return;
  }

  pets.forEach((pet) => {
    const petCard = document.createElement('div');
    petCard.classList.add('pet-card');
    petCard.dataset.id = pet.id;

    petCard.innerHTML = `
      <div class="rarity" style="background: ${rarityColors[pet.rarity] || '#FF9800'}">
        ${pet.rarity}
      </div>
      <img src="${pet.image}" alt="${pet.name}" onerror="this.src='https://via.placeholder.com/120/cccccc/333333?text=?'">
      <h3>${pet.name}</h3>
      <p>${pet.type || 'Неизвестный тип'}</p>
      <div class="pet-stats">
        <div class="stat">
          <div class="value">${pet.level || 1}</div>
          <div class="label">Уровень</div>
        </div>
        <div class="stat">
          <div class="value">${pet.health || 50}</div>
          <div class="label">Здоровье</div>
        </div>
        <div class="stat">
          <div class="value">${pet.attack || 30}</div>
          <div class="label">Атака</div>
        </div>
      </div>
    `;

    // Добавляем обработчик клика для детальной информации
    petCard.addEventListener('click', () => showPetDetails(pet));
    
    petsContainer.appendChild(petCard);
  });
}

// Функция добавления нового питомца
function addPet(pet) {
  pet.id = Date.now(); // Уникальный ID
  pets.push(pet);
  localStorage.setItem('pets', JSON.stringify(pets));
  displayPets();
  showNotification(`Добавлен новый питомец: ${pet.name}!`);
}

// Добавление демо-питомца
function addDemoPet() {
  const demoPets = [
    { name: "Снежок", rarity: "Обычный", type: "Пингвин", level: 3, health: 55, attack: 40 },
    { name: "Искра", rarity: "Редкий", type: "Феникс", level: 8, health: 70, attack: 65 },
    { name: "Брони", rarity: "Эпический", type: "Черепаха", level: 11, health: 95, attack: 50 }
  ];
  
  const randomPet = demoPets[Math.floor(Math.random() * demoPets.length)];
  const newPet = {
    ...randomPet,
    image: `https://via.placeholder.com/120/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${encodeURIComponent(randomPet.type.charAt(0))}`
  };
  
  addPet(newPet);
}

// Показать детали питомца
function showPetDetails(pet) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
  `;
  
  modal.innerHTML = `
    <div style="background: linear-gradient(135deg, #2c3e50, #4a6491);
                padding: 30px;
                border-radius: 20px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                position: relative;
                animation: cardAppear 0.5s ease;">
      <button onclick="this.parentElement.parentElement.remove()" 
              style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: white; font-size: 24px; cursor: pointer;">×</button>
      <img src="${pet.image}" alt="${pet.name}" 
           style="width: 150px; height: 150px; border-radius: 50%; border: 5px solid ${rarityColors[pet.rarity] || '#FF9800'}; margin-bottom: 20px;">
      <h2 style="margin: 10px 0; color: white;">${pet.name}</h2>
      <div style="background: ${rarityColors[pet.rarity] || '#FF9800'}; 
                  display: inline-block; 
                  padding: 5px 15px; 
                  border-radius: 15px; 
                  margin: 10px 0;
                  font-weight: bold;">${pet.rarity}</div>
      <p style="color: #ccc; margin: 15px 0;">Тип: ${pet.type || 'Неизвестно'}</p>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
        <div>
          <div style="font-size: 24px; color: #4ecdc4;">${pet.level || 1}</div>
          <div style="font-size: 12px; color: #aaa;">Уровень</div>
        </div>
        <div>
          <div style="font-size: 24px; color: #ff6b6b;">${pet.health || 50}</div>
          <div style="font-size: 12px; color: #aaa;">Здоровье</div>
        </div>
        <div>
          <div style="font-size: 24px; color: #ffd93d;">${pet.attack || 30}</div>
          <div style="font-size: 12px; color: #aaa;">Атака</div>
        </div>
      </div>
      <button onclick="removePet(${pet.id}); this.parentElement.parentElement.remove()" 
              style="background: #ff4757; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; margin-top: 10px;">
        Удалить питомца
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Удаление питомца
function removePet(petId) {
  pets = pets.filter(pet => pet.id !== petId);
  localStorage.setItem('pets', JSON.stringify(pets));
  displayPets();
  showNotification('Питомец удален!');
}

// Уведомления
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #ff9800, #ff5722);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 3000;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Меню раскрытия
const expandButton = document.getElementById('expand-button');
const menuButtons = document.getElementById('menu-buttons');
let menuVisible = false;

expandButton.addEventListener('click', (e) => {
  e.stopPropagation();
  menuVisible = !menuVisible;
  menuButtons.classList.toggle('show');
  expandButton.setAttribute('aria-expanded', menuVisible);
  expandButton.style.transform = menuVisible ? 'scale(1.15) rotate(45deg)' : 'scale(1) rotate(0deg)';
  expandButton.textContent = menuVisible ? '✕' : '⚡';
});

// Закрытие при клике вне меню
document.addEventListener('click', (e) => {
  if (menuVisible && !e.target.closest('#expandable-menu')) {
    menuVisible = false;
    menuButtons.classList.remove('show');
    expandButton.setAttribute('aria-expanded', 'false');
    expandButton.style.transform = 'scale(1) rotate(0deg)';
    expandButton.textContent = '⚡';
  }
});

// Клавиатурный доступ
expandButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    expandButton.click();
  }
});

// Анимации для CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);

// Запуск функции отображения питомцев
displayPets();

// Консольные команды для тестирования
console.log('%c🐾 Команды для тестирования:', 'color: #ff9800; font-size: 16px;');
console.log('%caddDemoPet() - добавить демо-питомца', 'color: #4CAF50;');
console.log('%clocalStorage.clear() - очистить всех питомцев', 'color: #FF5722;');