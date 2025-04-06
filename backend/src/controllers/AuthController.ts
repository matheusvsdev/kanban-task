import { Request, Response } from "express";
import AuthService from "../services/AuthService";

class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email e senha são obrigatórios!" });
        return;
      }

      const authData = await AuthService.loginUser(email, password);
      if (!authData) {
        res.status(401).json({ message: "Credenciais inválidas!" });
        return;
      }

      console.log("Login bem-sucedido! Usuário autenticado:", authData);

      res.status(200).json(authData); // Retorna { token, role } para o frontend
      return;
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro interno no servidor!" });
      return;
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("token"); // 🔥 Opcional: Limpa o cookie, se estiver armazenado

    console.log("Logout realizado com sucesso!");

    res.status(200).json({ message: "Logout realizado com sucesso!" });
    return;
  }
}

export default AuthController;
