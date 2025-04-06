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
}

export default RoleController;
