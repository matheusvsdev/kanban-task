import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/kanban_workroom";

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB conectado com sucesso!");
    } catch (error) {
        console.error("Erro ao tentar conectar ao MongoDB: ", error);
        process.exit(1);
    }
}

export default connectDB;