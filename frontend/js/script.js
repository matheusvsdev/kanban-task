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

async function fetchTasks() {
  try {
    const response = await fetch("http://localhost:3001/api/tasks");
    if (!response.ok) throw new Error("Erro ao buscar tarefas do servidor");

    const tasks = await response.json();
    console.log("Tarefas carregadas:", tasks);

    renderTasks(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
  }
}

// 🔥 Função para determinar status baseado na classe do card
function getStatusFromCard(card) {
  return card.classList.contains("new")
    ? "new"
    : card.classList.contains("progress")
    ? "progress"
    : card.classList.contains("delivered")
    ? "delivered"
    : card.classList.contains("review")
    ? "review"
    : card.classList.contains("done")
    ? "done"
    : null;
}

// 🔥 Criação dinâmica de elementos de tarefa
function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.draggable = task.status !== "done";
  taskElement.dataset.id = task._id;

  const mainStatusClass = task.secondary_status === "reviewing" ? "hidden" : "";

  taskElement.innerHTML = `
    <h4>${task.title}</h4>
    <p class="description">${task.description}</p>
    <div class="tag-users">
      <span class="tag ${task.status} ${mainStatusClass}">${task.status}</span>
      ${
        task.secondary_status === "reviewing"
          ? '<span class="tag reviewing">reviewing</span>'
          : ""
      }
      <div class="assigned-users">
        ${task.assigned_users
          .map(
            (user) => `
          <div class="container-img-task">
            <img src="${user.profile_picture || "img/profile-img.jpg"}" alt="${
              user.name
            }" />
          </div>
        `
          )
          .join("")}
      </div>
    </div>
    <div class="date-details">
      <p class="date">Prazo: ${new Date(
        task.delivery_date
      ).toLocaleDateString()}</p>
      <span class="details">...</span>
    </div>
  `;

  return taskElement;
}

// 🔥 Renderiza todas as tarefas nos seus respectivos cards
function renderTasks(tasks) {
  const taskContainers = {
    new: document.querySelector(".card.new"),
    progress: document.querySelector(".card.progress"),
    delivered: document.querySelector(".card.delivered"),
    review: document.querySelector(".card.review"),
    done: document.querySelector(".card.completed"),
  };

  Object.values(taskContainers).forEach((container) => {
    const titleElement = container.querySelector("h3");
    container.innerHTML = "";
    container.appendChild(titleElement);
  });

  tasks.forEach((task) => {
    const taskElement = createTaskElement(task);

    taskElement.addEventListener("dragstart", () =>
      taskElement.classList.add("dragging")
    );
    taskElement.addEventListener("dragend", () =>
      taskElement.classList.remove("dragging")
    );

    taskContainers[task.status]?.appendChild(taskElement);
  });
}

// 🔥 Adiciona uma nova tarefa e renderiza sem recarregar
async function addNewTask(taskData) {
  try {
    const response = await fetch("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Erro ao adicionar tarefa: ${response.statusText}`);
    }

    const newTask = await response.json(); // Pegamos a nova tarefa criada

    console.log("Tarefa adicionada com sucesso!");

    // 🔥 Adiciona a nova tarefa diretamente no DOM
    const newTaskElement = createTaskElement(newTask);
    document.querySelector(".card.new").appendChild(newTaskElement);
  } catch (error) {
    console.error("Erro ao adicionar nova tarefa:", error);
    alert("Erro ao adicionar tarefa. Tente novamente.");
  }
}

// Atualiza o status de uma tarefa e reflete no frontend sem recarregar
async function updateTaskStatus(taskElement, card) {
  const taskId = taskElement.dataset.id;
  const oldStatus = taskElement.querySelector(".tag").textContent.trim();
  const newStatus = getStatusFromCard(card);

  if (!newStatus) return;

  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar status: ${response.statusText}`);
    }

    console.log(`Status atualizado para: ${newStatus}`);

    // Remove a classe antiga e adiciona a nova (corrige cor e estilo)
    const statusTag = taskElement.querySelector(".tag");
    statusTag.classList.remove(oldStatus);
    statusTag.classList.add(newStatus);
    statusTag.textContent = newStatus;

    // Move a tarefa para o novo status no frontend
    const updatedTaskContainer = document.querySelector(`.card.${newStatus}`);
    if (updatedTaskContainer) {
      updatedTaskContainer.appendChild(taskElement);
    }

    // Se saiu de "review" para "progress", adicionamos a tag "reviewing"
    if (oldStatus === "review" && newStatus === "progress") {
      let reviewingTag = taskElement.querySelector(".tag.reviewing");
      if (!reviewingTag) {
        reviewingTag = document.createElement("span");
        reviewingTag.classList.add("tag", "reviewing");
        reviewingTag.textContent = "reviewing";
        taskElement.querySelector(".tag-users").prepend(reviewingTag);
      }
    }

    // Se voltou para "review", remove a tag "reviewing"
    if (newStatus === "review") {
      const reviewingTag = taskElement.querySelector(".tag.reviewing");
      if (reviewingTag) reviewingTag.remove();
    }
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    alert("Erro ao atualizar status da tarefa. Tente novamente.");
  }
}

fetchTasks();

// Chamar `fetchTasks()` automaticamente a cada 5 segundos para buscar novas tarefas
setInterval(() => {
  const expandedTask = document.querySelector(".task.expanded"); // Verifica se há um card expandido

  if (!expandedTask) {
    fetchTasks(); // Só atualiza se não houver card expandido
  }
}, 5000);

// Configuração de arrasto e movimentação
document.addEventListener("dragstart", (event) => {
  const taskElement = event.target;
  if (taskElement.classList.contains("task")) {
    const statusTag = taskElement.querySelector(".tag").textContent.trim();
    if (statusTag === "done") {
      event.preventDefault();
    }
  }
});

const containers = document.querySelectorAll(".card");

containers.forEach((card) => {
  card.addEventListener("dragover", (event) => {
    event.preventDefault(); // Permite arrastar para a área válida, mas não altera o status ainda
  });
  card.addEventListener("drop", (event) => {
    event.preventDefault();
    const draggingTask = document.querySelector(".dragging");
    if (!draggingTask) return;

    const currentStatus = draggingTask.querySelector(".tag").textContent.trim();
    const newStatus = getStatusFromCard(card);

    // Impede que uma tarefa pule etapas
    const statusOrder = {
      new: ["progress"],
      progress: ["delivered"],
      delivered: [], // Não permite avançar além de "delivered"
    };

    if (
      currentStatus in statusOrder &&
      !statusOrder[currentStatus].includes(newStatus)
    ) {
      return;
    }

    card.appendChild(draggingTask);
    updateTaskStatus(draggingTask, card);
  });
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("details")) {
    const taskElement = event.target.closest(".task");

    taskElement.classList.add("expanded"); // Expande o card
    let closeButton = taskElement.querySelector(".close-icon");

    if (!closeButton) {
      closeButton = document.createElement("span");
      closeButton.classList.add("close-icon");
      closeButton.innerHTML = "&times;";

      closeButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Impede que o clique no "X" feche o card por engano
        taskElement.classList.remove("expanded"); // Restaura o card ao estado normal
        closeButton.remove();
      });

      taskElement.appendChild(closeButton);
    }
  }
});
