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

function toggleDarkMode() {
  document.body.classList.toggle("light-mode");

  const buttonToggle = document.querySelector("#light-mode-toggle");
  buttonToggle.innerHTML = document.body.classList.contains("light-mode")
    ? '<i class="fa-solid fa-toggle-on"></i>'
    : '<i class="fa-solid fa-toggle-off"></i>';
}

buttonToggle.addEventListener("click", toggleDarkMode);
