import { Document, Types, Schema, model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  delivery_date: Date;
  status: "new" | "progress" | "delivered" | "review" | "done";
  secondary_status?: "reviewing"; // Campo opcional para quando não for aprovada na revisão
  assigned_users: Types.ObjectId[];
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    delivery_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "progress", "review", "done"],
      default: "new",
    },
    secondary_status: {
      type: String,
      enum: ["reviewing"], // Apenas "reviewing" pode ser usado
      required: false, // Começa sem "reviewing"
    },
    assigned_users: {
      type: [{ type: Types.ObjectId, ref: "User" }], // 🔥 Define como um ARRAY de ObjectId
      validate: {
        validator: function (users: Types.ObjectId[]) {
          return (
            Array.isArray(users) &&
            users.length <= 3 &&
            users.every((user) => Types.ObjectId.isValid(user))
          );
        },
        message:
          "A tarefa deve ter no máximo 3 usuários, e todos devem ser ObjectId válidos!",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TaskModel = model<ITask>("Task", TaskSchema);

export default TaskModel;
