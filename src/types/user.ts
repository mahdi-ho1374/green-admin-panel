import mongoose, { Document } from "mongoose";
import { allowedDateSortProps,allowedDateFilterProps } from "./common";

export interface IUser extends Document {
  _id?: mongoose.Types.ObjectId | string;
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  password: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  orders: mongoose.Types.ObjectId[] | string[];
  totalSpent: mongoose.Types.Decimal128;
  createdAt: Date;
  updatedAt: Date;
}

export const allowedSortProps = {
  id: "_id",
  _id: "_id",
  username: "username",
  email: "email",
  totalspent: "totalSpent",
  orderscount: "ordersCount",
...allowedDateSortProps} as const;

export type AllowedSortProps =
  (typeof allowedSortProps)[keyof typeof allowedSortProps];

export const allowedFilterProps = {
  totalspent: "totalSpent",
  orderscount: "ordersCount",
...allowedDateFilterProps} as const;

export const allowedMinMaxProps = allowedFilterProps;

export type AllowedFilterProps =
  (typeof allowedFilterProps)[keyof typeof allowedFilterProps];

export enum AllowedSearchFields {
    Username = "username",
    FirstName = "firstName",
    LastName = "lastName",
    Email = "email",
    Address = "address",
}
