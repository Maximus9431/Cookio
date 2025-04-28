const egg = document.getElementById('egg');
const petImage = document.getElementById('pet-image');
const petName = document.getElementById('pet-name');
const hatchText = document.getElementById('hatch-text');

if (egg) {
  let clicks = 0;
  egg.addEventListener('click', () => {
    clicks++;
    if (clicks >= 5) {
      egg.style.display = 'none';
      petImage.src = 'images/pet1.png';
      petImage.style.display = 'block';
      petName.textContent = "Твой новый питомец!";
      petName.style.display = 'block';
      hatchText.style.display = 'none';
    } else {
      egg.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
    }
  });
}