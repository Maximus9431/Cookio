// Проверяем, есть ли сохраненные питомцы в localStorage
let pets = JSON.parse(localStorage.getItem('pets')) || [];

// Контейнер для питомцев
const petsContainer = document.getElementById('pets-container');

// Отображение питомцев
function displayPets() {
  petsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением
  if (pets.length === 0) {
    petsContainer.innerHTML = '<p>У вас пока нет питомцев. Выбейте их из яиц!</p>';
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
  localStorage.setItem('pets', JSON.stringify(pets)); // Сохраняем в localStorage
  displayPets(); // Обновляем отображение
}

// Запуск функции отображения питомцев
displayPets();