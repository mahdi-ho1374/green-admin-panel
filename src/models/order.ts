import mongoose, { Schema } from "mongoose";
import { Status, type IOrder } from "./../types/order";

const orderSchema: Schema = new Schema<IOrder>(
  {
    items: {
      type: [
        {
          _id: { type: Schema.Types.ObjectId, required: true, ref: "product" },
          name: { type: String, required: true },
          price: { type: Schema.Types.Decimal128, required: true },
          amount: { type: Number, required: true },
        },
      ],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    totalPrice: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
