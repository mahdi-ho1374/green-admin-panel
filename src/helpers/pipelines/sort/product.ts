import { SortOrder } from "mongoose";
import product from "../computedProps/product";

const revenue = (sort: SortOrder) => [
  ...product.revenue,
  {
    $sort: {
      revenue: sort,
    },
  },
  {
    $project: {
      revenue: 0,
    },
  },
];

export default { revenue };
