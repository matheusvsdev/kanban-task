import { Document, Schema, model } from "mongoose";

export interface IRole extends Document {
  name: string;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const RoleModel = model<IRole>("Role", RoleSchema);

export default RoleModel;
