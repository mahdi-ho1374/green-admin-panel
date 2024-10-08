import { SortOrder } from "mongoose";
import user from "../computedProps/user";

const ordersCount = (sort: SortOrder) => [
  ...user.ordersCount,
  {
    $sort: { ordersCount: sort },
  },
  {
    $project: {
      ordersCount: 0,
    },
  },
];

export default { ordersCount };
