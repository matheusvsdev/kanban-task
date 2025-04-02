/*
Função anônima

Código sem função separada (mais simples, direto)

const buttonToggle = document.querySelector("#light-mode-toggle");

buttonToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  // Atualiza o ícone do botão
  buttonToggle.innerHTML = document.body.classList.contains("light-mode")
    ? '<i class="fa-solid fa-toggle-on"></i>'
    : '<i class="fa-solid fa-toggle-off"></i>';
});
*/

const buttonToggle = document.querySelector("#light-mode-toggle");

// Verifica se o usuário já tem um tema salvo
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
  buttonToggle.innerHTML = '<i class="fa-solid fa-toggle-on"></i>';
}

function toggleDarkMode() {
  document.body.classList.toggle("light-mode");

  // Atualiza o botão
  buttonToggle.innerHTML = document.body.classList.contains("light-mode")
    ? '<i class="fa-solid fa-toggle-on"></i>'
    : '<i class="fa-solid fa-toggle-off"></i>';

  // Salva a preferência no localstorage
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode") ? "light" : "dark"
  );
}
buttonToggle.addEventListener("click", toggleDarkMode);

const tasks = document.querySelectorAll(".task");
const containers = document.querySelectorAll(".card");

tasks.forEach((task) => {
  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
  });
});

containers.forEach((card) => {
  card.addEventListener("dragover", (event) => {
    event.preventDefault();
    const draggingTask = document.querySelector(".dragging");
    card.appendChild(draggingTask);
  });
});


