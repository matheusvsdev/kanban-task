import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", userRoutes);

export default app;
