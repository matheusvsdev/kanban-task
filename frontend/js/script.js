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

document.addEventListener("DOMContentLoaded", () => {
  console.log("Página atual:", window.location.pathname);

  const token = localStorage.getItem("token");
  const isLoginPage = window.location.pathname.includes("login.html");
  const isIndexPage = window.location.pathname.includes("index.html");

  if (isLoginPage) setupLogin();
  if (isIndexPage) setupIndexPage(token);
});

function setupLogin() {
  console.log("Estamos na página de login!");

  const form = document.getElementById("form-container");
  if (!form) {
    console.error("Erro: O formulário não foi encontrado!");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Tentando fazer login...");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      if (!response.ok) throw new Error(data.message || "Erro no login");

      console.log("Login bem-sucedido! Token recebido:", data.token);
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert(`Erro: ${error.message}`);
    }
  });
}

function setupIndexPage(token) {
  console.log("Estamos na página protegida!");

  if (!token) {
    alert("Acesso negado! Faça login primeiro.");
    window.location.href = "login.html";
    return;
  }

  console.log("Token encontrado! Carregando tarefas...");
  updateUserInterface(token);
  fetchTasks();
}

function updateUserInterface(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  console.log("Dados do token:", decodedToken);

  const userName = decodedToken.name;
  const userRole = decodedToken.role;

  console.log(`Usuário autenticado: ${userName} (${userRole})`);

  const greetingElement = document.querySelector("#second-bar-items h4");
  if (greetingElement) {
    greetingElement.textContent = `Olá, ${userName}`;
  }

  const firstBarItems = document.getElementById("first-bar-items");
  if (["admin", "manager", "tech"].includes(userRole)) {
    console.log("Usuário tem permissões especiais! Exibindo ícones...");
    firstBarItems.insertAdjacentHTML(
      "afterbegin",
      `
      <a href="#"><i class="fa-solid fa-square-plus"></i></a>
      <a href="#"><i class="fa-solid fa-user-plus"></i></a>
      <a href="#"><i class="fa-solid fa-flag"></i></a>
    `
    );
  } else {
    console.warn("Usuário não tem permissões especiais:", userRole);
  }

  setupModeToggle();
  setupLogout();
}

function setupModeToggle() {
  const buttonToggle = document.querySelector("#light-mode-toggle");

  if (buttonToggle) {
    console.log("Modo escuro/claro ativado!");

    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-mode");
      buttonToggle.innerHTML = '<i class="fa-solid fa-toggle-on"></i>';
    }

    buttonToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      buttonToggle.innerHTML = document.body.classList.contains("light-mode")
        ? '<i class="fa-solid fa-toggle-on"></i>'
        : '<i class="fa-solid fa-toggle-off"></i>';

      localStorage.setItem(
        "theme",
        document.body.classList.contains("light-mode") ? "light" : "dark"
      );
    });
  }
}

function setupLogout() {
  const logoutButton = document.querySelector(".fa-right-from-bracket");

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("Logout clicado! Removendo token...");
      localStorage.removeItem("token");
      console.log("Token removido! Redirecionando para login...");
      window.location.href = "login.html";
    });
  }
}

async function fetchTasks() {
  if (!window.location.pathname.includes("index.html")) return;

  console.log("Buscando tarefas...");

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Usuário não autenticado!");

    const tasks = await getTasksFromAPI(token);
    console.log("Tarefas carregadas:", tasks);

    renderTasks(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
  }
}

async function getTasksFromAPI(token) {
  const response = await fetch("http://localhost:3001/api/auth/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Erro ao buscar tarefas do servidor");

  return await response.json();
}

function getStatusFromCard(card) {
  switch (true) {
    case card.classList.contains("new"):
      return "new";
    case card.classList.contains("progress"):
      return "progress";
    case card.classList.contains("delivered"):
      return "delivered";
    case card.classList.contains("review"):
      return "review";
    case card.classList.contains("completed"):
      return "done";
    default:
      return null;
  }
}

function createTaskElement(task) {
  try {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.draggable = task.status !== "done";
    taskElement.dataset.id = task._id;

    taskElement.innerHTML = `
      <h4>${task.title}</h4>
      <p class="description">${task.description}</p>
      <div class="tag-users">
        <span class="tag ${task.status}">${task.status}</span>
        <div class="assigned-users">
          ${task.assigned_users
            .map(
              (user) => `
            <div class="container-img-task">
              <img src="${user.profilePicture || "img/profile-img.jpg"}" alt="${
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
  } catch (error) {
    console.error("Erro ao criar elemento de tarefa:", error);
    return document.createElement("div"); // 🔥 Retorna um elemento vazio em caso de erro
  }
}

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

    if (taskContainers[task.status]) {
      taskContainers[task.status].appendChild(taskElement);
    } else {
      console.warn(`Tarefa com status desconhecido: ${task.status}`, task);
    }
  });
}

// 🔥 Garante que o modal comece fechado ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("taskModal").style.display = "none";
});

// 🔥 Evento para abrir o modal ao clicar no ícone de adicionar tarefa
document.addEventListener("click", (event) => {
  const button = event.target.closest("a");
  if (button && button.querySelector(".fa-square-plus")) {
    event.preventDefault();
    console.log("Abrindo modal...");
    document.getElementById("taskModal").style.display = "block";
  }
});

// 🔥 Fecha o modal ao clicar no botão "X"
document.getElementById("closeModal").addEventListener("click", () => {
  console.log("Fechando modal...");
  document.getElementById("taskModal").style.display = "none";
});

// 🔥 Fecha o modal ao clicar fora dele
window.addEventListener("click", (event) => {
  if (event.target.id === "taskModal") {
    console.log("Fechando modal ao clicar fora...");
    document.getElementById("taskModal").style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userModal").style.display = "none";
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("a");
  if (button && button.querySelector(".fa-user-plus")) {
    event.preventDefault();
    console.log("Abrindo modal...");
    document.getElementById("userModal").style.display = "block";
  }
});

// 🔥 Fecha o modal ao clicar no botão "X"
document.getElementById("closeModal").addEventListener("click", () => {
  console.log("Fechando modal...");
  document.getElementById("userModal").style.display = "none";
});

// 🔥 Fecha o modal ao clicar fora dele
window.addEventListener("click", (event) => {
  if (event.target.id === "userModal") {
    console.log("Fechando modal ao clicar fora...");
    document.getElementById("userModal").style.display = "none";
  }
});

document.getElementById("loadUsers").addEventListener("click", async () => {
  const userListDiv = document.getElementById("userList");

  if (
    userListDiv.style.display === "none" ||
    userListDiv.style.display === ""
  ) {
    userListDiv.style.display = "flex";
  } else {
    userListDiv.style.display = "none";
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/api/auth/user");
    if (!response.ok) throw new Error("Erro ao buscar usuários");

    const users = await response.json();
    userListDiv.innerHTML = "";

    users.forEach((user) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = user._id; // 🔥 Aqui garantimos que pegamos o ID, não o nome!
      checkbox.classList.add("user-checkbox");

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(user.name));
      userListDiv.appendChild(label);
    });

    console.log("Profissionais carregados com sucesso!");
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    alert("Erro ao carregar lista de profissionais. Tente novamente.");
  }
});

document
  .getElementById("taskForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    let deliveryDate = document.getElementById("taskDeadline").value;
    deliveryDate = new Date(deliveryDate + "T00:00:00")
      .toISOString()
      .split("T")[0]; // 🔥 Garante que fique no formato correto

    const taskData = {
      title: document.getElementById("taskTitle").value,
      description: document.getElementById("taskDescription").value,
      delivery_date: deliveryDate, // 🔥 Data correta em UTC
      assigned_users: Array.from(
        document.querySelectorAll(".user-checkbox:checked")
      ).map((el) => el.value),
    };

    console.log("Dados enviados para API:", taskData); // 🔥 Teste para ver se a data está correta

    addNewTask(taskData);
  });

  document
  .getElementById("userForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const userData = {
      name: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      role: document.getElementById("role").value,
    };

    console.log("Dados enviados para API:", userData); // 🔥 Teste para ver se a data está correta

    addNewUser(userData);
  });

const socket = io("http://localhost:3001"); // Conecta ao servidor WebSocket
socket.on("connect", () => {
  console.log("Conectado ao WebSocket do servidor!");
});

async function addNewTask(taskData) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Erro: Usuário não autenticado!");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3001/api/auth/tasks/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      }
    );

    const responseData = await response.json();
    console.log("Resposta do servidor:", responseData);

    if (!response.ok) {
      throw new Error(
        `Erro ao adicionar tarefa: ${
          responseData.message || response.statusText
        }`
      );
    }

    console.log("Tarefa adicionada com sucesso!", responseData);
    alert("Tarefa adicionada com sucesso!");

    // 🔥 Fecha o modal após a criação da tarefa
    document.getElementById("taskModal").style.display = "none";

    // 🔥 Criar o elemento da nova tarefa no DOM sem recarregar
    const newTaskElement = createTaskElement(responseData); // Gera visualmente a nova tarefa
    document.querySelector(".card.new").appendChild(newTaskElement);

    socket.emit("newTask", responseData);
  } catch (error) {
    console.error("Erro ao adicionar nova tarefa:", error);
    alert(`Erro ao adicionar tarefa: ${error.message}`);
  }
}

socket.on("newTask", (task) => {
  console.log("Nova tarefa recebida via WebSocket:", task); // Teste para ver se o frontend recebeu o evento

  const newTaskElement = createTaskElement(task);
  document.querySelector(".card.new").appendChild(newTaskElement);
});

async function updateTaskStatus(taskElement, card, isFromSocket = false) {
  // Adicionando isFromSocket
  const taskId = taskElement.dataset.id;
  const oldStatus = taskElement.querySelector(".tag").textContent.trim();
  const newStatus = getStatusFromCard(card);

  if (!newStatus) return;

  console.log("Atualizando tarefa:", taskId, "Novo status:", newStatus);

  try {
    if (!isFromSocket) {
      // 🔥 Só faz requisição se NÃO for do WebSocket
      const response = await fetch(
        `http://localhost:3001/api/auth/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const responseData = await response.json();
      console.log("Resposta do servidor:", responseData);

      if (!response.ok) {
        throw new Error(
          `Erro ao atualizar tarefa: ${
            responseData.message || response.statusText
          }`
        );
      }

      console.log("Tarefa atualizada com sucesso!", responseData);

      // **Emite evento WebSocket apenas se NÃO veio do WebSocket**
      socket.emit("updatedTask", responseData);
    }

    // 🔥 Ajusta visualmente o card na interface sem recarregar a página
    const statusTag = taskElement.querySelector(".tag");
    statusTag.classList.remove(oldStatus);
    statusTag.classList.add(newStatus);
    statusTag.textContent = newStatus;

    // 🔥 Move a tarefa para o novo status
    const updatedTaskContainer = document.querySelector(`.card.${newStatus}`);
    if (updatedTaskContainer) {
      updatedTaskContainer.appendChild(taskElement);
    }

  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    alert("Erro ao atualizar status da tarefa. Tente novamente.");
  }
}

socket.on("updatedTask", (task) => {
  console.log("🔥 Tarefa atualizada recebida via WebSocket:", task);

  const taskElement = document.querySelector(`[data-id='${task._id}']`);

  if (!taskElement) {
    console.warn("Tarefa não encontrada no DOM:", task._id);
    return;
  }

  const updatedTaskContainer = document.querySelector(`.card.${task.status}`);

  if (!updatedTaskContainer) {
    console.warn("Container do novo status não encontrado:", task.status);
    return;
  }

  // 🔥 Agora passa o parâmetro isFromSocket = true
  updateTaskStatus(taskElement, updatedTaskContainer, true);
});

fetchTasks();

async function addNewUser(userData) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Erro: Usuário não autenticado!");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3001/api/auth/user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );

    const responseData = await response.json();
    console.log("Resposta do servidor:", responseData);

    if (!response.ok) {
      throw new Error(
        `Erro ao adicionar usuário: ${
          responseData.message || response.statusText
        }`
      );
    }

    console.log("Usuário adicionado com sucesso!", responseData);
    alert("Usuário adicionada com sucesso!");

    // 🔥 Fecha o modal após a criação da tarefa
    document.getElementById("userModal").style.display = "none";

  } catch (error) {
    console.error("Erro ao adicionar novo usuário:", error);
    alert(`Erro ao adicionar usuário: ${error.message}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Página carregada, configurando arrasto e movimentação...");

  document.addEventListener("dragstart", (event) => {
    const taskElement = event.target;
    if (taskElement.classList.contains("task")) {
      const statusTag = taskElement.querySelector(".tag").textContent.trim();
      if (statusTag === "done") {
        event.preventDefault();
      } else {
        taskElement.classList.add("dragging"); // 🔥 Mantém o elemento marcado como arrastando
      }
    }
  });

  document.addEventListener("dragend", (event) => {
    const taskElement = event.target;
    if (taskElement.classList.contains("task")) {
      taskElement.classList.remove("dragging"); // 🔥 Remove a classe após o drop
    }
  });

  const containers = document.querySelectorAll(".card");

  containers.forEach((card) => {
    card.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    card.addEventListener("drop", (event) => {
      event.preventDefault();
      const draggingTask = document.querySelector(".dragging");
      if (!draggingTask) return;

      const currentStatus = draggingTask
        .querySelector(".tag")
        .textContent.trim();
      const newStatus = getStatusFromCard(card);

      console.log("Movendo tarefa:", draggingTask.dataset.id);
      console.log("Status atual:", currentStatus, "Novo status:", newStatus);

      // Impede mudanças inválidas
      const statusOrder = {
        new: ["progress"],
        progress: ["delivered"], // 🔥 `progress` pode ir para `delivered` ou `review`
        delivered: ["review"], // 🔥 Usuário comum não pode avançar além de `delivered`
        review: ["progress", "done"], // 🔥 `review` só pode ir para `progress` ou `done`
      };

      const token = localStorage.getItem("token");
      const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
      const userRole = decodedToken?.role || "user";

      // 🔥 Apenas `admin` e `manager` podem mover para `review` ou `done`
      const allowedRolesForAdvancedStatuses = ["admin", "manager"];

      console.log("Movendo tarefa:", draggingTask.dataset.id);
      console.log("Status atual:", currentStatus, "Novo status:", newStatus);
      console.log("Usuário autenticado, role:", userRole);

      if (
        ["review", "done"].includes(newStatus) &&
        !allowedRolesForAdvancedStatuses.includes(userRole)
      ) {
        console.warn("Usuário sem permissão para mover para:", newStatus);
        alert(
          `Permissão negada! Apenas admins e managers podem mover para "${newStatus}".`
        );
        return;
      }

      if (
        statusOrder[currentStatus] &&
        !statusOrder[currentStatus].includes(newStatus)
      ) {
        console.warn("Movimentação inválida:", currentStatus, "→", newStatus);
        return;
      }

      console.log(
        "Movimentação permitida, enviando atualização para o backend..."
      );

      card.appendChild(draggingTask);
      updateTaskStatus(draggingTask, card);
    });
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
