import mongoose, { Schema} from "mongoose";
import{ ProductCategory, type IProduct } from "../types/product";

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  salesNumber: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(ProductCategory),
    required: true
  },
},{timestamps: true});

export default mongoose.model<IProduct>("Product" , productSchema);
