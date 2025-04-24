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
  const hatchText = document.querySelector('#pet h2'); // Находим текст
  let crackStage = 0;

  egg.addEventListener('click', () => {
    egg.classList.add('wiggle');
    setTimeout(() => egg.classList.remove('wiggle'), 800);

    crackStage++;
    if (crackStage < 3) {
      egg.src = `egg_${crackStage}.png`;
    } else {
      egg.style.display = 'none';
      const petImages = [
        "pet_1.png",
        "pet_2.png",
        "pet_3.png",
        "pet_4.png",
        "pet_5.png",
        "pet_6.png"
      ];
      const randomPetImage = petImages[Math.floor(Math.random() * petImages.length)];
      pet.src = randomPetImage;
      pet.classList.add('show');

      // Убираем текст
      if (hatchText) {
        hatchText.style.display = 'none';
      }
    }
  });
});
