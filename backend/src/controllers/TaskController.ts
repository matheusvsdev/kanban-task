import { io } from "../server";
import { Request, Response } from "express";
import TaskService from "../services/TaskService";

class TaskController {
  static async createTask(req: Request, res: Response) {
    try {
      console.log("Recebendo requisição para criar tarefa...");

      if (!req.user) {
        throw new Error("Usuário não autenticado.");
      }

      console.log("Usuário autenticado:", req.user);

      const allowedRoles = ["admin", "manager", "tech"];
      if (!req.user.role || !allowedRoles.includes(req.user.role)) {
        throw new Error(
          "Permissão negada! Apenas administradores, gerentes e técnicos podem criar tarefas."
        );
      }

      console.log("Usuário autorizado. Dados da requisição:", req.body);

      if (!req.body.title || !req.body.description || !req.body.delivery_date) {
        throw new Error(
          "Dados inválidos! Certifique-se de enviar título, descrição e data de entrega."
        );
      }

      const newTask = await TaskService.createTask(req.body);

      if (!newTask) {
        throw new Error("Erro ao criar tarefa! Verifique os dados enviados.");
      }

      console.log("Tarefa criada com sucesso!", newTask);

      console.log("🔥 Enviando tarefa via WebSocket:", newTask); 
      io.emit("newTask", newTask);

      res.status(201).json({
        _id: newTask._id,
        title: newTask.title,
        description: newTask.description,
        delivery_date: newTask.delivery_date,
        status: newTask.status,
        assigned_users: newTask.assigned_users,
      });
      return;
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Erro ao registrar tarefa:", error);
      res
        .status(500)
        .json({ message: "Erro ao registrar tarefa", error: err.message });
      return;
    }
  }

  static async getAllTasks(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Usuário não autenticado!" }); // Evita erro de `undefined`
        return;
      }
      const tasks = await TaskService.findAll(req.user.id, req.user.role);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar tarefas", error });
    }
  }

  static async updateTaskStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userRole: string = (req.user as { role: string }).role || "user";

      // **Validação: Status deve ser válido**
      const validStatus = ["new", "progress", "delivered", "review", "done"];
      if (!validStatus.includes(status)) {
        res.status(400).json({ message: "Status inválido." });
        return;
      }

      // Agora chamamos o Service para atualizar corretamente
      const updatedTask = await TaskService.updateStatus(id, status, userRole);

      if (!updatedTask) {
        res.status(404).json({ message: "Tarefa não encontrada." });
        return;
      }

      io.emit("updatedTask", updatedTask);

      res.status(200).json({
        message: "Status atualizado com sucesso!",
        task: updatedTask,
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      res.status(500).json({
        message: "Erro ao atualizar status da tarefa",
        error,
      });
    }
  }
}

export default TaskController;
