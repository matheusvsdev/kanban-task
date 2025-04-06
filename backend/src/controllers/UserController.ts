import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserService from "../services/UserService";

class UserController {
  static async registerUser(req: Request, res: Response) {
    try {
      const newUser = await UserService.createUser(req.body);
      if (!newUser) res.status(409).json({ message: "Email já cadastrado" });
      const formattedUserResponse = {
        _id: newUser?._id,
        profilePicture: newUser?.profilePicture,
        name: newUser?.name,
        email: newUser?.email,
        role: {_id: newUser?.role._id, name: newUser?.role.name},
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

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      console.log("Parâmetros da requisição:", req.params); // 🔥 Verificando os parâmetros recebidos

      const userId = req.params.id; // 🔥 Pegando o parâmetro correto
      if (!userId) {
        res.status(400).json({ message: "ID do usuário não fornecido!" });
        return;
      }

      const user = await UserService.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado!" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ message: "Erro ao buscar usuário", error });
    }
  }

  static async userSelf(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      console.log("Token recebido:", token); // 🔥 Confirmação do token no backend

      if (!token) {
        res.status(401).json({ message: "Token não fornecido!" });
        return;
      }

      console.log("JWT_SECRET carregado:", process.env.JWT_SECRET); // 🔥 Debug do segredo

      if (!process.env.JWT_SECRET) {
        res
          .status(500)
          .json({
            message: "Erro interno do servidor: JWT_SECRET não definido!",
          });
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as jwt.JwtPayload;
      console.log("Payload do token:", decoded); // 🔥 Verificar estrutura do token

      if (!decoded || typeof decoded !== "object" || !decoded.userId) {
        res.status(401).json({ message: "Token inválido!" });
        return;
      }

      const userId = decoded.userId; // 🔥 Ajustado para pegar `userId` corretamente

      const user = await UserService.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado!" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário logado:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}

export default UserController;
