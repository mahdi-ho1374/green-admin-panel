import { Status } from "../../../types/order";
import getMainPipeline from "./getMainPipeline";

const amount = (groupBy: "monthly" | "daily") => [
  {
    $match: {
      status: { $ne: Status.CANCELED },
    },
  },
  { $unwind: "$items" },
  ...getMainPipeline("amount",groupBy,"items.amount")
];

const revenue = (groupBy: "monthly" | "daily") => [
  {
    $match: {
      status: { $ne: Status.CANCELED },
    },
  },
  ...getMainPipeline("revenue",groupBy,"totalPrice")
];

export default {amount,revenue};
