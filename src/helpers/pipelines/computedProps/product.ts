const revenue = [
  {
    $addFields: {
      revenue: { $multiply: ["$salesNumber", "$price"] },
    },
  },
];

export default { revenue };
