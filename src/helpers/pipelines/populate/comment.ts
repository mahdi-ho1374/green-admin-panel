const userId = [
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userId",
    },
  },
  {$unwind: "$userId"}
];

export default { userId };
