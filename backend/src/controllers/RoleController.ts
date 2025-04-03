import { Request, Response } from "express";
import RoleService from "../services/RoleService";

class RoleController {
  static async createRole(req: Request, res: Response) {
    try {
      const newRole = await RoleService.createRole(req.body);
      if (!newRole) res.status(409).json({ message: "Nome já cadastrado" });
      const formattedRoleResponse = {
        _id: newRole?._id,
        name: newRole?.name,
        description: newRole?.description,
        createdAt: newRole?.createdAt,
      };
      res.status(201).json(formattedRoleResponse);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar role", error });
    }
  }
}

export default RoleController;
