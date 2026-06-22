import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name;
  email;
  password;
}

const userSchema = new Schema<IUser>({
  name{ type, required},
  email{ type, unique, required},
  password{ type, required},
});

// Avoid model overwrite errors during hot-reload
const User = (mongoose.models && (mongoose.models).User) ? (mongoose.models).User userSchema);

export { User };
export default User;