import { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
  static async registerUser(req: Request, res: Response) {
    try {
      const newUser = await UserService.createUser(req.body);
      if (!newUser) res.status(409).json({ message: "Email já cadastrado" });
      const formattedUserResponse = {
        _id: newUser?._id,
        name: newUser?.name,
        email: newUser?.email,
        profile_picture: newUser?.profile_picture,
        role: newUser?.role,
        createdAt: newUser?.createdAt
      };
      res.status(201).json(formattedUserResponse);
    } catch (error) {
      res.status(500).json({ message: "Erro ao registrar usuário", error });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários", error });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await UserService.findById(req.params.id);
      if (!user) res.status(404).json({ message: "Usuário não encontrado" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuário", error });
    }
  }
}

export default UserController;
