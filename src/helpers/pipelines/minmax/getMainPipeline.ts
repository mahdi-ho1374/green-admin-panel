export default (prop: string) => [
  {
    $group: {
      _id: null,
      min: { $min: `$${prop}` },
      max: { $max:  `$${prop}` },
    },
  },
  {
    $project: {
      _id: 0,
      range: ["$min", "$max"]
    },
  },
];

