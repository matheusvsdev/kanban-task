import RoleModel from "../models/RoleModel";
import UserModel, { IUser } from "../models/UserModel";

class UserService {
  static async createUser(userData: Partial<IUser>): Promise<IUser | null> {
    if (!userData.email || !userData.role) {
      return null;
    }

    // ✅ **Verifica se a Role existe**
    const roleExists = await RoleModel.findById(userData.role);
    if (!roleExists) {
      throw new Error("Role inválida! Essa Role não existe no banco.");
    }

    // ✅ **Verifica se o email já está cadastrado**
    const existingUser = await UserModel.findOne({ email: userData.email });

    if (existingUser) {
      return null;
    }
    return await UserModel.create(userData);
  }

  static async findAll() {
    return await UserModel.find()
      .populate({ path: "role", select: "-createdAt -updatedAt -__v" })
      .select("-__v")
      .exec();
  }

  static async findById(userId: string) {
    return await UserModel.findById(userId).populate("role").exec();
  }

  static async updateUser(userId: string, updatedFields: Partial<IUser>) {
    return await UserModel.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    }).exec();
  }

  static async deleteUser(userId: string) {
    return await UserModel.findByIdAndDelete(userId).exec();
  }
}

export default UserService;
