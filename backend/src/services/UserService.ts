import RoleModel from "../models/RoleModel";
import UserModel, { IUser } from "../models/UserModel";

class UserService {
  static async createUser(userData: Partial<IUser>): Promise<IUser | null> {
    if (!userData.role?._id) {
      throw new Error("Role ID não foi fornecida!");
    }

    // ** Busca a Role pelo nome ou ID fornecido **
    const roleExists = await RoleModel.findById(userData.role._id);
    if (!roleExists) {
      throw new Error("Role inválida! Essa Role não existe no banco.");
    }

    // ** Verifica se o email já está cadastrado **
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      return null;
    }

    // 🔥 Salva o objeto inteiro da Role no usuário
    const userToCreate = {
      ...userData,
      role: roleExists, // Agora `role` está completo
    };

    return await UserModel.create(userToCreate);
  }

  static async findAll() {
    return await UserModel.find().exec();
  }

  static async findById(userId: string) {
    return await UserModel.findById(userId).exec();
  }

  static async updateUser(userId: string, updatedFields: Partial<IUser>) {
    if (updatedFields.role) {
      const roleExists = await RoleModel.findById(updatedFields.role._id);
      if (!roleExists) {
        throw new Error("Role inválida! Essa Role não existe no banco.");
      }
      return await UserModel.findByIdAndUpdate(userId, updatedFields, {
        new: true,
      }).exec();
    }
  }

  static async deleteUser(userId: string) {
    return await UserModel.findByIdAndDelete(userId).exec();
  }
}

export default UserService;
