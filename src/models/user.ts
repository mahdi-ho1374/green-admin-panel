import mongoose, { Schema } from "mongoose";
import type { IUser } from "../types/user";
import Order from "./order";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    orders: {
      type: [{ type: Schema.Types.ObjectId, ref: Order.modelName }],
      required: true,
      default: [],
    },
    totalSpent: {
      type: Schema.Types.Decimal128,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
