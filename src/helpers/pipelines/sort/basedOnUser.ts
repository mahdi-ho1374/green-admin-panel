import { SortOrder } from "mongoose";

const user = (sort: SortOrder) => [
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
    },
  },
  {
    $unwind: "$user",
  },
  {
    $sort: {
      "user.username": 1,
    },
  },
];

export default { user };
