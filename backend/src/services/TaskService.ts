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

  static async findAll() {
    return await TaskModel.find()
      .populate({
        path: "assigned_users",
        select: "-createdAt -updatedAt -__v",
      })
      .select("-__v")
      .exec();
  }

  static async updateStatus(
    taskId: string,
    newStatus: "new" | "progress" | "delivered" | "review" | "done"
  ) {
    const task = await TaskModel.findById(taskId);
    if (!task) return null;

    let updatedFields: Partial<ITask> = { status: newStatus };

    if (task.status === "review" && newStatus === "progress") {
      updatedFields.secondary_status = "reviewing";
    }

    if (newStatus === "review" || newStatus === "done") {
      return await TaskModel.findByIdAndUpdate(
        taskId,
        { $unset: { secondary_status: "" }, status: newStatus }, // Agora removemos corretamente
        { new: true }
      );
    }
    return await TaskModel.findByIdAndUpdate(
      taskId,
      updatedFields,
      { new: true } // Retorna o documento atualizado
    );
  }
}

export default TaskService;
