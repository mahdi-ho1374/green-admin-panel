export default (date1: Date,date2: Date) => [
  {
    $match: {
      createdAt: {
        $gte: date1,
        $lte: date2,
      },
    },
  },
];
