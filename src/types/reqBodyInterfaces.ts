import type { IProduct } from "./product";
import type { IUser } from "./user";
import type { IComment } from "./comment";
import type { IOrder } from "./order";
import mongoose, { Document } from "mongoose";

type ExcludeDocument<T> = Exclude<keyof T, keyof Document> | "_id";
type ExcludeTimestampFields<T> = Exclude<
  ExcludeDocument<T>,
  "createdAt" | "updatedAt"
>;

interface GetAllBody {
  currentPage: number;
  perPage: number;
}

interface DeleteOneBody {
  _id: mongoose.Types.ObjectId | string;
}

export type GetProductsBody = GetAllBody;
export type GetUsersBody = GetAllBody;
export type GetCommentsBody = GetAllBody;
export type GetOrdersBody = GetAllBody;

export type AddProductBody = Readonly<
  Pick<IProduct, ExcludeTimestampFields<IProduct>>
>;
export type AddUserBody = Readonly<Pick<IUser, ExcludeDocument<IUser>>>;

export type AddOrderBody = Readonly<
  Pick<IOrder, ExcludeTimestampFields<IOrder>>
>;

export type AddCommentBody = Partial<
  Readonly<Pick<IComment, ExcludeTimestampFields<IComment>>>
>;

export type UpdateOrderBody = Partial<AddOrderBody>;
export type UpdateUserBody = Partial<AddUserBody>;
export type UpdateProductBody = Partial<AddProductBody>;
export type UpdateCommentBody = Partial<AddCommentBody>;

export type DeleteProductBody = DeleteOneBody;
export type DeleteUserBody = DeleteOneBody;
export type DeleteOrderBody = DeleteOneBody;
export type DeleteCommentBody = DeleteOneBody;

export type GetProductsByIdBody = { ids: string[] };
