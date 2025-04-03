import { Document, Types, Schema, model } from "mongoose";


export interface ITask extends Document  {
    title: string;
    description: string;
    delivery_date: Date;
    status: "new" | "in-progress" | "review" | "done";
    assigned_users: Types.ObjectId[];
}

const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        delivery_date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["new", "in-progress", "review", "done"],
            default: "new"
        },
        assigned_users: [{type: Types.ObjectId, ref: "User"}]
    },
    {
        timestamps: true
    }
);

const TaskModel = model<ITask>("Task", TaskSchema);

export default TaskModel;