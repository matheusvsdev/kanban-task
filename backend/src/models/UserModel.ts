import { Document, Types, Schema, model } from "mongoose";

export interface IUser extends Document {
    profile_picture: string;
    name: string;
    email: string;
    password: string;
    role: Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
    {
        profile_picture: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;