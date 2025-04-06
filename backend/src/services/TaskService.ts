import UserModel from "../models/UserModel";
import TaskModel, { ITask } from "../models/TaskModel";

class TaskService {
  static async createTask(taskData: Partial<ITask>): Promise<ITask | null> {
    if (!taskData.assigned_users || taskData.assigned_users.length === 0)
      return null;

    // ** Verifica se o usuário existe **
    const usersExist = await UserModel.find({
      _id: { $in: taskData.assigned_users },
    });
    if (usersExist.length !== taskData.assigned_users.length) {
      throw new Error("Um ou mais usuários atribuídos não existem no banco.");
    }
    return await TaskModel.create(taskData);
  }

  static async findAll(userId: string, userRole: string) {
    const normalizedRole = userRole.toLowerCase();

    let query = {};

    // Se não for admin, manager ou tech, filtra apenas as tarefas do usuário
    if (["admin", "manager", "tech"].includes(normalizedRole)) {
      query = {};
    } else {
      query = { assigned_users: userId };
    }

    return await TaskModel.find(query)
      .populate({
        path: "assigned_users",
        select: "-createdAt -updatedAt",
      })
      .exec();
  }

  static async updateStatus(
    taskId: string,
    newStatus: "new" | "progress" | "delivered" | "review" | "done",
    userRole: string
  ) {
    const task = await TaskModel.findById(taskId);
    if (!task) return null;

    if (
      ["new", "review", "done"].includes(newStatus) &&
      !["admin", "manager"].includes(userRole)
    ) {
      throw new Error(
        "Permissão negada: Apenas admins e managers podem definir este status."
      );
    }

    let updatedFields: Partial<ITask> = { status: newStatus };

    return await TaskModel.findByIdAndUpdate(
      taskId,
      updatedFields,
      { new: true } // Retorna o documento atualizado
    );
  }
}

export default TaskService;
