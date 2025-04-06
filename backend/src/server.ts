import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/database";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;
const server = createServer(app); // 🔥 Criando servidor HTTP
let io: Server; // 🔥 Declara `io` globalmente, sem inicializá-lo ainda

connectDB()
  .then(() => {
    io = new Server(server, {
      cors: {
        origin: ["http://localhost:3001", "http://127.0.0.1:5500"],
        methods: ["GET", "POST", "PUT", "PATCH"],
      }, // 🔥 Permitir conexões do frontend
    });

    io.on("connection", (socket) => {
      console.log("Novo cliente conectado!");

      socket.on("disconnect", () => {
        console.log("Cliente desconectado!");
      });
    });

    // 🔥 Inicia o servidor
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Falha ao conectar ao banco de dados!", error);
  });

// 🔥 Exportamos `io` agora que ele existe globalmente
export { io };
