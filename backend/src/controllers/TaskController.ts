import { Request, Response } from "express";
import TaskService from "../services/TaskService";

class TaskController {
  static async createTask(req: Request, res: Response) {
    try {
      const newTask = await TaskService.createTask(req.body);
      if (!newTask)
        res.status(400).json({
          message: "Erro ao criar tarefa. Verifique os dados enviados.",
        });
      const formattedTaskResponse = {
        _id: newTask?._id,
        title: newTask?.title,
        description: newTask?.description,
        delivery_date: newTask?.delivery_date,
        status: newTask?.status,
        assigned_users: newTask?.assigned_users,
        createdAt: newTask?.createdAt,
      };
      res.status(201).json(formattedTaskResponse);
    } catch (error) {
      res.status(500).json({ message: "Erro ao registrar tarefa", error });
    }
  }

  static async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await TaskService.findAll();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar tarefas", error });
    }
  }

  static async updateTaskStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // **Validação: Status deve ser válido**
      const validStatus = ["new", "progress", "delivered", "review", "done"];
      if (!validStatus.includes(status)) {
        res.status(400).json({ message: "Status inválido." });
      }

      // Agora chamamos o Service para atualizar corretamente
      const updatedTask = await TaskService.updateStatus(id, status);

      if (!updatedTask) {
        res.status(404).json({ message: "Tarefa não encontrada." });
      }

      res.status(200).json({
        message: "Status atualizado com sucesso!",
        task: updatedTask,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao atualizar status da tarefa",
        error,
      });
    }
  }
}

export default TaskController;
