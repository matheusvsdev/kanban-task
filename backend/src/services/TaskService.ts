import UserModel from "../models/UserModel";
import TaskModel, { ITask } from "../models/TaskModel";

class TaskService {
  static async createTask(taskData: Partial<ITask>): Promise<ITask | null> {
    if (!taskData.assigned_users || taskData.assigned_users.length === 0)
      return null;

    // **Verifica se o usuário existe**
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
}

export default TaskService;
