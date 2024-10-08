import { SortOrder } from "mongoose";
import { AllowedSortProps as UserAllowedSortProps } from "./user";
import { AllowedSortProps as ProductAllowedSortProps } from "./product";
import { AllowedSortProps as CommentAllowedSortProps } from "./comment";
import { AllowedSortProps as OrderAllowedSortProps } from "./order";

import { AllowedFilterProps as UserAllowedFilterProps } from "./user";
import { AllowedFilterProps as ProductAllowedFilterProps } from "./product";
import { AllowedFilterProps as CommentAllowedFilterProps } from "./comment";
import { AllowedFilterProps as OrderAllowedFilterProps } from "./order";

export const sortType = {
  asc: 1,
  desc: -1,
  descending: -1,
  ascending: 1,
} as { [key: string]: SortOrder };

export const computedSortProps = {
  orderscount: "ordersCount",
  itemscount: "itemsCount",
  productscount: "productsCount",
  revenue: "revenue",
  user: "user",
};

export type AllowedSortProps =
  | UserAllowedSortProps
  | ProductAllowedSortProps
  | CommentAllowedSortProps
  | OrderAllowedSortProps;

export type AllowedFilterProps =
  | UserAllowedFilterProps
  | ProductAllowedFilterProps
  | CommentAllowedFilterProps
  | OrderAllowedFilterProps;

export const allowedDateFilterProps = {
  createdat: "createdAt",
  updatedat: "updatedAt"
}

export const allowedDateSortProps = {
  createdat: "createdAt",
  updatedat: "updatedAt"
}

const { user, ...otherKeys } = computedSortProps;
export const computedFilterProps = otherKeys;
