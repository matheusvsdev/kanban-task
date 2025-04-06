import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";

class AuthService {
  static async loginUser(
    email: string,
    password: string
  ): Promise<{ token: string; expiresIn: number } | { error: string } | null> {
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      console.log("Usuário não encontrado!");
      return null;
    }

    console.log("Usuário encontrado:", user);

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log("Senha inválida!");
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET não está definido!");

    const expiresIn = 2 * 60 * 60; // Expira em 2 horas

    // Retornamos o token incluindo o role diretamente
    const token = jwt.sign(
      { userId: user._id, role: user.role.name, name: user.name }, // Incluímos `role.name` no token
      jwtSecret,
      { expiresIn }
    );

    return { token, expiresIn }; // Retornamos `role` junto ao token
  }
}

export default AuthService;
