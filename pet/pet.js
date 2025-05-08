// Проверяем, есть ли сохраненные питомцы в localStorage
let pets = JSON.parse(localStorage.getItem('pets')) || [];

// Контейнер для питомцев
const petsContainer = document.getElementById('pets-container');

// Отображение питомцев
function displayPets() {
  petsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением
  if (pets.length === 0) {
    petsContainer.innerHTML = '<p class="empty-message">У вас пока нет питомцев. Выбейте их из яиц!</p>';
    return;
  }

  pets.forEach((pet) => {
    const petCard = document.createElement('div');
    petCard.classList.add('pet-card');

    petCard.innerHTML = `
      <img src="${pet.image}" alt="${pet.name}">
      <h3>${pet.name}</h3>
      <p>${pet.rarity}</p>
      <div class="rarity">${pet.rarity}</div>
    `;

    petsContainer.appendChild(petCard);
  });
}

// Функция для добавления нового питомца
function addPet(pet) {
  pets.push(pet);
  localStorage.setItem('pets', JSON.stringify(pets));
  displayPets();
}

// Запуск функции отображения питомцев
displayPets();

// Меню раскрытия
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
