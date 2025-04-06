import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET não está definido!");

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Verifica apenas o header!

  if (!token) {
    res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
      name: string;
    };

    console.log("Payload do token:", decoded); // Debug para ver os dados

    req.user = {
      id: decoded.userId,
      role: decoded.role || "user",
      name: decoded.name,
    };

    next();
  } catch (error: any) {
    console.error("Erro ao validar token:", error);

    if (error.name === "TokenExpiredError") {
      res
        .status(401)
        .json({ message: "Token expirado. Faça login novamente." });
    } else {
      res.status(401).json({ message: "Token inválido ou corrompido." });
    }
  }
};
