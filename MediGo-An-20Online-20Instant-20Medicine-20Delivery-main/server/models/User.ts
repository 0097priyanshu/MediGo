import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Avoid model overwrite errors during hot-reload
const User = (mongoose.models && (mongoose.models as any).User) ? (mongoose.models as any).User as mongoose.Model<IUser> : mongoose.model<IUser>("User", userSchema);

export { User };
export default User;