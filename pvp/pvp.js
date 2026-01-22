// DOM Elements
const playerHealthBar = document.getElementById('player-health-bar');
const enemyHealthBar = document.getElementById('enemy-health-bar');
const playerHealthText = document.getElementById('player-health');
const enemyHealthText = document.getElementById('enemy-health');
const attackButton = document.getElementById('attack-button');
const strongAttackButton = document.getElementById('strong-attack-button');
const turnIndicator = document.getElementById('turn-indicator');
const gameOverModal = document.getElementById('game-over-modal');
const winnerMessage = document.getElementById('winner-message');
const resetGameButton = document.getElementById('reset-game-button');

// Game State
let playerHealth = 100;
let enemyHealth = 100;
let playerTurn = true;
let gameOver = false;

// Update Health Bars and Text
function updateHealth() {
  playerHealthBar.style.width = `${playerHealth}%`;
  enemyHealthBar.style.width = `${enemyHealth}%`;
  playerHealthText.textContent = `${playerHealth} HP`;
  enemyHealthText.textContent = `${enemyHealth} HP`;
}

// Handle Player Attack
function attack(damage) {
  if (!playerTurn || gameOver) return;

  const newEnemyHealth = Math.max(0, enemyHealth - damage);
  enemyHealth = newEnemyHealth;
  updateHealth();

  if (newEnemyHealth === 0) {
    endGame('player');
    return;
  }

  playerTurn = false;
  turnIndicator.textContent = "Enemy's turn...";
  setTimeout(enemyAttack, 1000);
}

// Handle Enemy Attack
function enemyAttack() {
  if (playerTurn || gameOver) return;

  const damage = Math.floor(Math.random() * 20) + 5;
  const newPlayerHealth = Math.max(0, playerHealth - damage);
  playerHealth = newPlayerHealth;
  updateHealth();

  if (newPlayerHealth === 0) {
    endGame('enemy');
    return;
  }

  playerTurn = true;
  turnIndicator.textContent = 'Your turn!';
}

// End Game
function endGame(winner) {
  gameOver = true;
  winnerMessage.textContent = winner === 'player' ? 'You Win!' : 'You Lose!';
  gameOverModal.classList.remove('hidden');
}

// Reset Game
function resetGame() {
  playerHealth = 100;
  enemyHealth = 100;
  playerTurn = true;
  gameOver = false;
  updateHealth();
  turnIndicator.textContent = 'Your turn!';
  gameOverModal.classList.add('hidden');
}

// Event Listeners
attackButton.addEventListener('click', () => attack(10));
strongAttackButton.addEventListener('click', () => attack(20));
resetGameButton.addEventListener('click', resetGame);

// Initialize Game
updateHealth();

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