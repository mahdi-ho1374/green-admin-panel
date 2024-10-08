import mongoose,{Document} from "mongoose";

export enum ProductCategory {
  TechEssentials = "Tech Essentials",
  OutdoorAdventures = "Outdoor Adventures",
  HomeAndLifestyle = "Home & Lifestyle",
  FashionForward = "Fashion Forward",
  HealthAndWellness = "Health & Wellness",
}

export interface IProduct extends Document {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  price: mongoose.Types.Decimal128 | number;
  quantity: number;
  description: string;
  salesNumber: number;
  category: ProductCategory;
  createdAt?: Date;
  updatedAt?: Date;
};

export const allowedSortProps = {
  id: "_id",
  _id: "_id",
  name: "name",
  quantity: "quantity",
  price: "price",
  revenue: "revenue",
  salesnumber: "salesNumber",
} as const;

export type AllowedSortProps = typeof allowedSortProps[keyof typeof allowedSortProps];

export const allowedFilterProps = {
quantity: "quantity",
price: "price",
salesnumber: "salesNumber",
revenue: "revenue"
} as const;

export const allowedMinMaxProps = allowedFilterProps;

export type AllowedFilterProps = typeof allowedFilterProps[keyof typeof allowedFilterProps];

export enum AllowedSearchFields {
  Name = "name",
  Category = "category",
  Description = "description"
}
