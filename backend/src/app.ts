import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use("/api", userRoutes);

export default app;
