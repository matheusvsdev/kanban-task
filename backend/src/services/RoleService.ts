import RoleModel, { IRole } from "../models/RoleModel";

class RoleService {
  static async createRole(roleData: Partial<IRole>): Promise<IRole | null> {
    try {
      if (!roleData.name || typeof roleData.name != "string") {
        throw new Error("Role invalid!");
      }

      const existingRole = await RoleModel.findOne({ name: roleData.name });
      if (existingRole) {
        return null;
      }

      return await RoleModel.create(roleData);
    } catch (error: any) {
      throw new Error("Erro interno ao criar Role!");
    }
  }

  static async findAll() {
    return await RoleModel.find().exec();
  }
}

export default RoleService;
