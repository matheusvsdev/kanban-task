import { Document, Types, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IRole } from "./RoleModel";

const SALT_ROUNDS = 12;

export interface IUser extends Document {
  profilePicture: string;
  name: string;
  email: string;
  password: string;
  role: IRole;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    profilePicture: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Hash da senha antes de salvar
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return this.password
    ? bcrypt.compare(candidatePassword, this.password)
    : false;
};

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
