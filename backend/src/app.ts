import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index"; // Aqui mantém todas as rotas unificadas!

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));

app.use("/api", routes); // Agora todas as rotas estão disponíveis em `/api`


export default app;
