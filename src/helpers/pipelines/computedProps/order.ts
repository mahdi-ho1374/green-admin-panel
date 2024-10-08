const productsCount = [
  {
    $addFields: {
      productsCount: { $size: "$items" },
    },
  },
];

const itemsCount = [
  {
    $addFields: { itemsCount: { $sum: "$items.amount" } },
  },
];

export default { productsCount, itemsCount };
