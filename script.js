const tg = window.Telegram.WebApp;

// Получение ID пользователя
const userId = tg.initDataUnsafe.user.id;

// Функция для загрузки данных пользователя
async function loadUserData() {
    const response = await fetch(`http://127.0.0.1:5000/api/user/${userId}`);
    const data = await response.json();
    document.getElementById('coins').textContent = data.coins;
    document.getElementById('energy').textContent = data.energy;
    document.getElementById('hunger').textContent = data.hunger;
    document.getElementById('mood').textContent = data.mood;
}

// Функция для сохранения данных пользователя
async function saveUserData(data) {
    await fetch(`http://127.0.0.1:5000/api/user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Действия
async function earnCoins() {
    let data = await fetch(`http://127.0.0.1:5000/api/user/${userId}`).then(res => res.json());
    data.coins += 10;
    data.energy -= 10;
    saveUserData(data);
    loadUserData();
}

async function feedPet() {
    let data = await fetch(`http://127.0.0.1:5000/api/user/${userId}`).then(res => res.json());
    if (data.coins >= 5) {
        data.coins -= 5;
        data.hunger += 20;
        data.mood += 10;
        saveUserData(data);
        loadUserData();
    } else {
        alert("❌ Недостаточно монет!");
    }
}

async function playWithPet() {
    let data = await fetch(`http://127.0.0.1:5000/api/user/${userId}`).then(res => res.json());
    data.mood += 15;
    data.energy -= 10;
    saveUserData(data);
    loadUserData();
}

async function restPet() {
    let data = await fetch(`http://127.0.0.1:5000/api/user/${userId}`).then(res => res.json());
    data.energy += 30;
    data.mood -= 5;
    saveUserData(data);
    loadUserData();
}

// Загрузка данных при старте
loadUserData();