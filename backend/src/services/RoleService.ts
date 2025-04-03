import RoleModel, { IRole } from "../models/RoleModel";

class RoleService {
  static async createRole(roleData: Partial<IRole>): Promise<IRole | null> {
    const existingRole = await RoleModel.findOne({ name: roleData.name });
    if (existingRole) return null;
    return await RoleModel.create(roleData);
  }
}

export default RoleService;
