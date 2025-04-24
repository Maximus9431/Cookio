document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabs button");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      contents.forEach(c => c.style.display = "none");
      document.getElementById(target).style.display = "block";
    });
  });

  // Логика вылупления
  const egg = document.getElementById('egg');
  const pet = document.getElementById('pet');
  let crackStage = 0;

  egg.addEventListener('click', () => {
    egg.classList.add('wiggle');
    setTimeout(() => egg.classList.remove('wiggle'), 800);

    crackStage++;
    if (crackStage < 3) {
      egg.src = `egg_${crackStage}.png`;
    } else {
      egg.style.display = 'none';
      const randomPet = `pet_${Math.floor(Math.random() * 6) + 1}.png`;
      pet.src = randomPet;
      pet.classList.add('show');
    }
  });
});
