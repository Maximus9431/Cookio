const items = [
  { name: "Сердце", price: 20, img: "heart.png" },
  { name: "Энергия", price: 10, sale: 50, img: "energy.png" },
  { name: "Подарок", price: 15, img: "gift.png" },
  { name: "Кристалл", price: 25, img: "crystal.png" },
  { name: "Мясо", price: 5, img: "meat.png" },
  { name: "Золото", price: 15, img: "gold.png" },
  { name: "Дерево", price: 7, img: "wood.png" },
  { name: "Книга", price: 10, img: "book.png" },
  { name: "Камень", price: 15, sale: 10, img: "rock.png" },
  { name: "Зелье", price: 15, img: "potion.png" },
  { name: "Ветка", price: 5, sale: 40, img: "stick.png" },
  { name: "Хлопок", price: 7, img: "cotton.png" },
  { name: "Веревка", price: 5, sale: 30, img: "rope.png" },
  { name: "Фляга", price: 10, img: "flask.png" },
  { name: "Батарея", price: 15, sale: 20, img: "battery.png" },
];

const container = document.getElementById('shop-items');

items.forEach(item => {
  const el = document.createElement('div');
  el.className = 'shop-item';

  el.innerHTML = `
    ${item.sale ? `<div class="sale-tag">-${item.sale}%</div>` : ''}
    <img src="images/${item.img}" alt="${item.name}">
    <div>${item.name}</div>
    <div class="price">${item.price}$</div>
    <button class="buy-button">Купить</button>
  `;

  el.querySelector('.buy-button').addEventListener('click', () => {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    inventory.push({ name: item.name, price: item.price });
    localStorage.setItem('inventory', JSON.stringify(inventory));
    alert(`Вы купили: ${item.name}`);
  });

  container.appendChild(el);
});

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