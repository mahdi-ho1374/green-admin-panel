const ordersCount = [
  {
    $addFields: {
      ordersCount: { $size: "$orders" },
    },
  },
];

export default {ordersCount};
