import { Document, Types } from "mongoose";
import type { IUser } from "./user";
import { allowedDateSortProps,allowedDateFilterProps } from "./common";

export interface ProductItem {
  _id: Types.ObjectId | string;
  name: string;
  price: Types.Decimal128 | number;
  amount: number;
}

export enum Operator {
  INC = "increase",
  DEC = "decrease",
  FALSE = "",
}

export interface IOrder extends Document {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  items: ProductItem[];
  totalPrice: Types.Decimal128 | number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Status {
  DELIVERED = "delivered",
  CANCELED = "canceled",
  PENDING = "pending",
}

export type TransformedOrder = Omit<Exclude<IOrder, Document>, "userId"> & {
  user: IUser;
};

export const allowedSortProps = {
  id: "_id",
  _id: "_id",
  user: "user",
  totalprice: "totalPrice",
  itemscount: "itemsCount",
  productscount: "productsCount",
  ...allowedDateSortProps
} as const;

export type AllowedSortProps =
  (typeof allowedSortProps)[keyof typeof allowedSortProps];

export const allowedFilterProps = {
  totalprice: "totalPrice",
  itemscount: "itemsCount",
  productscount: "productsCount",
  status: "status",
  ...allowedDateFilterProps
} as const;

export const allowedMinMaxProps = allowedFilterProps;

export type AllowedFilterProps =
  (typeof allowedFilterProps)[keyof typeof allowedFilterProps];
