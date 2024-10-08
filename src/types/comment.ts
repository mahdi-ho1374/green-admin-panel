import mongoose, { Document } from "mongoose";
import { IUser } from "./user";
import { allowedDateFilterProps,allowedDateSortProps } from "./common";

export interface IComment extends Document {
  _id?: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  text: string;
  timestamp: Date;
  approved: boolean;
  seen: boolean;
  replied: boolean;
  repliedText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TransformedComment = Omit<Exclude<IComment, Document>, "userId"> & {
  user: IUser;
};

export const allowedSortProps = {
  _id: "_id",
  id: "_id",
  user: "user",
  approved: "approved",
  seen: "seen",
  replied: "replied",
...allowedDateSortProps} as const;

export type AllowedSortProps =
  (typeof allowedSortProps)[keyof typeof allowedSortProps];

export const allowedFilterProps = {
  approved: "approved",
  seen: "seen",
  replied: "replied",
...allowedDateFilterProps} as const;

export type AllowedFilterProps =
  (typeof allowedFilterProps)[keyof typeof allowedFilterProps];

export enum AllowedSearchFields {
  Text = "text",
  RepliedText = "repliedText"
}
