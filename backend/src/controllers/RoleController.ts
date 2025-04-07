import { Request, Response } from "express";
import RoleService from "../services/RoleService";

class RoleController {
  static async createRole(req: Request, res: Response) {
    const newRole = await RoleService.createRole(req.body);
    if (!newRole) {
      res.status(409).json({ message: "This role already exists!" });
      return;
    }

    res.status(201).json({ _id: newRole._id, name: newRole.name });
    return;
  }

  static async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await RoleService.findAll();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar roles", error });
    }
  }
}

export default RoleController;
