import { model, models, Schema } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

const userSchema = new Schema(
  {
    name: { type: String, requried: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// This models?.User means that if the User model is already defined in the models object (which is a cache of all defined models), we use that. Otherwise, we create a new model using the userSchema. This is important to prevent errors in development when the code is reloaded and models are redefined.
const User = models?.User || model<IUser>("User", userSchema);
export default User;
