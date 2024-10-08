import { SortOrder } from "mongoose";
import order from "../computedProps/order";

const productsCount = (sort: SortOrder) => [
  ...order.productsCount,
  {
    $sort: { productsCount: sort },
  },
  {
    $project: {
      productsCount: 0,
    },
  },
];

const itemsCount = (sort: SortOrder) => [
  ...order.itemsCount,
  {
    $sort: {
      itemsCount: sort,
    },
  },
  {
    $project: {
      itemsCount: 0,
    },
  },
];

export default { productsCount, itemsCount };
