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
}

export default TaskController;
