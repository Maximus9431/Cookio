// script.js - Улучшенная версия

let clicks = 0;
let currentPet = null;
let petStats = {
  name: "",
  level: 1,
  exp: 0,
  maxExp: 100,
  power: 10,
  health: 100,
  energy: 50,
  happiness: 75,
  mood: "happy"
};

// Элементы DOM
const egg = document.getElementById('egg');
const eggContainer = document.getElementById('egg-container');
const crackOverlay = document.getElementById('crack-overlay');
const clickCounter = document.getElementById('click-counter');
const progressFill = document.getElementById('progress-fill');
const eggStage = document.getElementById('egg-stage');
const petStage = document.getElementById('pet-stage');
const petImage = document.getElementById('pet-image');
const petRarityBadge = document.getElementById('pet-rarity-badge');
const petDisplayName = document.getElementById('pet-display-name');
const petHealth = document.getElementById('pet-health');
const petEnergy = document.getElementById('pet-energy');
const petHappiness = document.getElementById('pet-happiness');
const petName = document.getElementById('pet-name');
const petLevel = document.getElementById('pet-level');
const petExp = document.getElementById('pet-exp');
const petPower = document.getElementById('pet-power');
const levelFill = document.getElementById('level-fill');
const moodFill = document.getElementById('mood-fill');
const moodText = document.getElementById('mood-text');

// Звуки
const eggCrackSound = document.getElementById('egg-crack-sound');
const clickSound = document.getElementById('click-sound');
const petSound = document.getElementById('pet-sound');
const levelUpSound = document.getElementById('level-up-sound');
const achievementSound = document.getElementById('achievement-sound');

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  loadPetFromStorage();
  createParticles();
  setupEventListeners();
  
  // Показать приветственное сообщение
  setTimeout(() => {
    showNotification("🐾 Добро пожаловать в мир питомцев!", "info");
  }, 1000);
});

// Загрузка питомца из хранилища
function loadPetFromStorage() {
  const savedPet = localStorage.getItem('currentPet');
  const savedStats = localStorage.getItem('petStats');
  
  if (savedPet) {
    try {
      currentPet = JSON.parse(savedPet);
      if (savedStats) {
        petStats = JSON.parse(savedStats);
      }
      showPetStage();
      updatePetStatsDisplay();
    } catch (e) {
      console.error('Ошибка загрузки питомца:', e);
      localStorage.removeItem('currentPet');
      localStorage.removeItem('petStats');
    }
  }
}

// Создание частиц для фона
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 15 + 5;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const color = Math.random() > 0.5 ? 'rgba(133, 53, 207, 0.3)' : 'rgba(255, 204, 0, 0.2)';
    
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${posX}%;
      top: ${posY}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;
    
    particlesContainer.appendChild(particle);
  }
}

// Обработчик клика по яйцу
eggContainer.addEventListener('click', () => {
  clickSound.currentTime = 0;
  clickSound.play();
  
  clicks++;
  clickCounter.textContent = clicks;
  
  // Обновляем прогресс
  const progress = (clicks / 3) * 100;
  progressFill.style.width = `${progress}%`;
  
  // Показываем трещины
  if (clicks === 1) {
    egg.src = 'eggs/egg_1.jpeg';
    crackOverlay.style.backgroundImage = 'url("cracks/crack1.png")';
    crackOverlay.style.opacity = '0.3';
    eggCrackSound.currentTime = 0;
    eggCrackSound.play();
  } else if (clicks === 2) {
    egg.src = 'eggs/egg_2.jpeg';
    crackOverlay.style.backgroundImage = 'url("cracks/crack2.png")';
    crackOverlay.style.opacity = '0.6';
    eggCrackSound.currentTime = 0;
    eggCrackSound.play();
    
    // Анимация тряски
    eggContainer.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      eggContainer.style.animation = '';
    }, 500);
  } else if (clicks === 3) {
    egg.src = 'eggs/egg_3.jpeg';
    crackOverlay.style.backgroundImage = 'url("cracks/crack3.png")';
    crackOverlay.style.opacity = '1';
    eggCrackSound.currentTime = 0;
    eggCrackSound.play();
    
    // Задержка перед вылуплением
    setTimeout(() => {
      hatchEgg();
    }, 1000);
  }
});

// Вылупление яйца
function hatchEgg() {
  // Генерируем питомца
  currentPet = generatePet();
  
  // Показываем анимацию вылупления
  eggContainer.style.transform = 'scale(1.2)';
  eggContainer.style.opacity = '0';
  
  setTimeout(() => {
    eggStage.classList.add('hidden');
    showPetStage();
    
    // Показываем модальное окно с именем
    setTimeout(() => {
      showNameModal();
    }, 500);
  }, 500);
  
  // Сохраняем в localStorage
  localStorage.setItem('currentPet', JSON.stringify(currentPet));
  localStorage.setItem('petStats', JSON.stringify(petStats));
  
  // Показать уведомление
  showNotification(`🎉 Вылупился ${currentPet.rarity.toLowerCase()} питомец!`, "success");
}

// Генерация питомца
function generatePet() {
  const rarityChances = [
    { rarity: 'Легендарный', chance: 0.8, image: 'legendary_pet.png', color: '#FFD700' },
    { rarity: 'Эпический', chance: 7.2, image: 'epic_pet.png', color: '#9B30FF' },
    { rarity: 'Сверхредкий', chance: 15.8, image: 'super_rare_pet.png', color: '#1E90FF' },
    { rarity: 'Редкий', chance: 33.2, image: 'rare_pet.png', color: '#1E90FF' },
    { rarity: 'Обычный', chance: 44, image: 'common_pet.png', color: '#888' },
  ];

  const random = Math.random() * 100;
  let cumulative = 0;

  for (const rarity of rarityChances) {
    cumulative += rarity.chance;
    if (random <= cumulative) {
      return {
        rarity: rarity.rarity,
        image: rarity.image,
        color: rarity.color
      };
    }
  }
  
  return rarityChances[rarityChances.length - 1];
}

// Показать стадию питомца
function showPetStage() {
  if (!currentPet) return;
  
  petStage.classList.remove('hidden');
  petImage.src = `pets/${currentPet.image}`;
  petRarityBadge.textContent = currentPet.rarity;
  petRarityBadge.style.background = currentPet.color;
  
  // Обновляем отображение статистики
  updatePetStatsDisplay();
}

// Обновление отображения статистики
function updatePetStatsDisplay() {
  petDisplayName.textContent = petStats.name || "Безымянный";
  petHealth.textContent = petStats.health;
  petEnergy.textContent = petStats.energy;
  petHappiness.textContent = petStats.happiness;
  
  petName.textContent = petStats.name || "Неизвестно";
  petLevel.textContent = petStats.level;
  petExp.textContent = `${petStats.exp}/${petStats.maxExp}`;
  petPower.textContent = petStats.power;
  
  // Обновляем прогресс-бары
  const levelProgress = (petStats.exp / petStats.maxExp) * 100;
  levelFill.style.width = `${levelProgress}%`;
  
  const moodProgress = petStats.happiness;
  moodFill.style.width = `${moodProgress}%`;
  
  // Обновляем смайлик настроения
  let moodEmoji = "😊";
  if (petStats.happiness >= 80) moodEmoji = "😍";
  else if (petStats.happiness >= 60) moodEmoji = "😊";
  else if (petStats.happiness >= 40) moodEmoji = "😐";
  else if (petStats.happiness >= 20) moodEmoji = "😔";
  else moodEmoji = "😭";
  
  moodText.textContent = moodEmoji;
}

// Показать модальное окно с именем
function showNameModal() {
  if (!currentPet) return;
  
  const modal = document.getElementById('name-modal');
  const modalPetImage = document.getElementById('modal-pet-image');
  const modalPetRarity = document.getElementById('modal-pet-rarity');
  const nameInput = document.getElementById('pet-name-input');
  const saveButton = document.getElementById('save-name');
  
  modalPetImage.src = `pets/${currentPet.image}`;
  modalPetRarity.textContent = currentPet.rarity;
  modalPetRarity.style.background = currentPet.color;
  
  modal.classList.add('show');
  
  // Обработчики для кнопок предложенных имен
  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      nameInput.value = btn.dataset.name;
    });
  });
  
  // Обработчик сохранения имени
  saveButton.onclick = () => {
    const name = nameInput.value.trim();
    if (name.length > 0) {
      petStats.name = name;
      updatePetStatsDisplay();
      localStorage.setItem('petStats', JSON.stringify(petStats));
      
      showNotification(`✅ Питомец назван: ${name}`, "success");
      modal.classList.remove('show');
      
      // Проиграть звук счастья
      petSound.currentTime = 0;
      petSound.play();
    } else {
      showNotification("⚠️ Введите имя питомца", "warning");
    }
  };
  
  // Закрытие модального окна
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  });
  
  // Закрытие при клике вне модального окна
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
}

// Взаимодействие с питомцем
document.getElementById('pet-interact-btn').addEventListener('click', () => {
  if (!currentPet) return;
  
  petStats.happiness = Math.min(100, petStats.happiness + 5);
  petStats.energy = Math.max(0, petStats.energy - 2);
  
  updatePetStatsDisplay();
  localStorage.setItem('petStats', JSON.stringify(petStats));
  
  // Анимация реакции
  petImage.style.transform = 'scale(1.1)';
  setTimeout(() => {
    petImage.style.transform = 'scale(1)';
  }, 300);
  
  // Звук
  petSound.currentTime = 0;
  petSound.play();
  
  showNotification("❤️ Питомец доволен!", "success");
});

// Кормление питомца
document.getElementById('feed-btn').addEventListener('click', () => {
  if (!currentPet) {
    showNotification("⚠️ Сначала вылупите питомца", "warning");
    return;
  }
  
  petStats.health = Math.min(100, petStats.health + 10);
  petStats.happiness = Math.min(100, petStats.happiness + 3);
  petStats.energy = Math.min(100, petStats.energy + 5);
  
  updatePetStatsDisplay();
  localStorage.setItem('petStats', JSON.stringify(petStats));
  
  showNotification("🍎 Питомец покормлен!", "success");
});

// Игра с питомцем
document.getElementById('play-btn').addEventListener('click', () => {
  if (!currentPet) {
    showNotification("⚠️ Сначала вылупите питомца", "warning");
    return;
  }
  
  if (petStats.energy < 10) {
    showNotification("⚠️ У питомца недостаточно энергии", "warning");
    return;
  }
  
  petStats.happiness = Math.min(100, petStats.happiness + 15);
  petStats.energy = Math.max(0, petStats.energy - 10);
  petStats.exp = Math.min(petStats.maxExp, petStats.exp + 5);
  
  // Проверка уровня
  checkLevelUp();
  
  updatePetStatsDisplay();
  localStorage.setItem('petStats', JSON.stringify(petStats));
  
  showNotification("🎮 Питомец поиграл и получил опыт!", "success");
});

// Тренировка питомца
document.getElementById('train-btn').addEventListener('click', () => {
  if (!currentPet) {
    showNotification("⚠️ Сначала вылупите питомца", "warning");
    return;
  }
  
  if (petStats.energy < 20) {
    showNotification("⚠️ У питомца недостаточно энергии", "warning");
    return;
  }
  
  petStats.power += 1;
  petStats.energy = Math.max(0, petStats.energy - 20);
  petStats.exp = Math.min(petStats.maxExp, petStats.exp + 10);
  petStats.happiness = Math.max(0, petStats.happiness - 5);
  
  // Проверка уровня
  checkLevelUp();
  
  updatePetStatsDisplay();
  localStorage.setItem('petStats', JSON.stringify(petStats));
  
  showNotification("💪 Питомец потренировался! Сила +1", "success");
});

// Проверка повышения уровня
function checkLevelUp() {
  if (petStats.exp >= petStats.maxExp) {
    petStats.level++;
    petStats.exp = 0;
    petStats.maxExp = Math.floor(petStats.maxExp * 1.5);
    petStats.health = 100;
    petStats.energy = 100;
    petStats.happiness = 100;
    
    levelUpSound.currentTime = 0;
    levelUpSound.play();
    
    showNotification(`🎉 Уровень повышен! Теперь уровень ${petStats.level}`, "success");
    
    // Анимация уровня
    const levelElement = document.getElementById('pet-level');
    levelElement.style.transform = 'scale(1.5)';
    levelElement.style.color = '#FFD700';
    
    setTimeout(() => {
      levelElement.style.transform = 'scale(1)';
      levelElement.style.color = '';
    }, 1000);
  }
}

// Получение ежедневной награды
document.getElementById('claim-reward').addEventListener('click', () => {
  const today = new Date().getDate();
  const lastClaim = localStorage.getItem('lastClaim');
  
  if (lastClaim && parseInt(lastClaim) === today) {
    showNotification("⚠️ Вы уже получили награду сегодня", "warning");
    return;
  }
  
  // Даем награду
  const goldElement = document.getElementById('gold-amount');
  let currentGold = parseInt(goldElement.textContent.replace(',', '')) || 0;
  const reward = 100;
  goldElement.textContent = (currentGold + reward).toLocaleString();
  
  localStorage.setItem('lastClaim', today.toString());
  
  showNotification(`🎁 Ежедневная награда: ${reward} золота`, "success");
  
  // Анимация кнопки
  const claimBtn = document.getElementById('claim-reward');
  claimBtn.disabled = true;
  claimBtn.innerHTML = '<i class="fas fa-check"></i> Награда получена';
  claimBtn.style.background = 'var(--success)';
});

// Переименование питомца
document.getElementById('rename-btn').addEventListener('click', () => {
  showNameModal();
});

// Поделиться питомцем
document.getElementById('share-btn').addEventListener('click', () => {
  if (!currentPet) {
    showNotification("⚠️ Сначала вылупите питомца", "warning");
    return;
  }
  
  const shareText = `Посмотрите на моего питомца в Pet Game! ${currentPet.rarity} питомец ${petStats.name}, уровень ${petStats.level}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Мой питомец в Pet Game',
      text: shareText,
      url: window.location.href
    });
  } else {
    // Копирование в буфер обмена
    navigator.clipboard.writeText(shareText);
    showNotification("✅ Информация о питомце скопирована в буфер обмена", "success");
  }
});

// Показать уведомление
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  const text = document.getElementById('notification-text');
  
  let borderColor = '#1E90FF'; // info по умолчанию
  let iconClass = 'fas fa-info-circle';
  
  if (type === 'success') {
    borderColor = '#00cc88';
    iconClass = 'fas fa-check-circle';
  } else if (type === 'warning') {
    borderColor = '#ffaa00';
    iconClass = 'fas fa-exclamation-triangle';
  } else if (type === 'error') {
    borderColor = '#ff4757';
    iconClass = 'fas fa-times-circle';
  }
  
  notification.style.borderLeftColor = borderColor;
  text.textContent = message;
  
  const icon = notification.querySelector('i');
  icon.className = iconClass;
  
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Настройка обработчиков событий
function setupEventListeners() {
  // Закрытие модальных окон
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal').classList.remove('show');
    });
  });
  
  // Клики по модальным окнам
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  });
  
  // Анимация при наведении на яйцо
  eggContainer.addEventListener('mouseenter', () => {
    if (clicks < 3) {
      eggContainer.style.transform = 'scale(1.05)';
    }
  });
  
  eggContainer.addEventListener('mouseleave', () => {
    if (clicks < 3) {
      eggContainer.style.transform = 'scale(1)';
    }
  });
  
  // Добавляем стили для анимаций
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px) rotate(-5deg); }
      75% { transform: translateX(10px) rotate(5deg); }
    }
    
    @keyframes glow {
      from { text-shadow: 0 0 10px #8535cf, 0 0 20px #8535cf; }
      to { text-shadow: 0 0 20px #ffcc00, 0 0 30px #ffcc00; }
    }
  `;
  document.head.appendChild(style);
  
  // Добавляем анимацию заголовку
  const title = document.querySelector('h1');
  if (title) {
    title.style.animation = 'glow 2s ease-in-out infinite alternate';
  }
}

// Автоматическое восстановление энергии
setInterval(() => {
  if (currentPet && petStats.energy < 100) {
    petStats.energy = Math.min(100, petStats.energy + 1);
    updatePetStatsDisplay();
    localStorage.setItem('petStats', JSON.stringify(petStats));
  }
}, 60000); // Каждую минуту

// Ежедневный сброс
function checkDailyReset() {
  const today = new Date().toDateString();
  const lastReset = localStorage.getItem('lastReset');
  
  if (lastReset !== today) {
    // Сброс энергии и здоровья
    petStats.energy = 100;
    petStats.health = 100;
    localStorage.setItem('petStats', JSON.stringify(petStats));
    localStorage.setItem('lastReset', today);
    
    showNotification("🌅 Новый день! Энергия и здоровье восстановлены", "info");
  }
}

// Проверка при загрузке
checkDailyReset();

// Выдвигающееся меню (как в game.html)
function initMenu() {
  const expandButton = document.getElementById('expand-button');
  const menuButtons = document.getElementById('menu-buttons');
  let menuVisible = false;
  
  if (!expandButton || !menuButtons) return;
  
  expandButton.addEventListener('click', (e) => {
    e.stopPropagation();
    menuVisible = !menuVisible;
    menuButtons.classList.toggle('show');
    expandButton.setAttribute('aria-expanded', menuVisible);
    expandButton.style.transform = menuVisible ? 'scale(1.15) rotate(45deg)' : 'scale(1) rotate(0deg)';
  });
  
  // Закрытие меню при клике вне
  document.addEventListener('click', (e) => {
    if (menuVisible && !e.target.closest('#expandable-menu')) {
      menuVisible = false;
      menuButtons.classList.remove('show');
      expandButton.setAttribute('aria-expanded', 'false');
      expandButton.style.transform = 'scale(1) rotate(0deg)';
    }
  });
}

// Обновляем функцию setupEventListeners
function setupEventListeners() {
  // ... существующий код ...
  
  // Инициализация меню
  initMenu();
}
