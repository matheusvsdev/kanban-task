import { Document, Schema, model } from "mongoose";

export interface IRole extends Document {
    name: string;
    description: string;
    createdAt: Date;
}

const RoleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const RoleModel = model<IRole>("Role", RoleSchema);

export default RoleModel;