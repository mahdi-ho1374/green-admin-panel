export default (
  prop: string,
  groupBy: "monthly" | "daily",
  sumField?: string
) => 
  groupBy === "monthly"
    ? ([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            year: { $first: { $year: "$createdAt" } },
            month: { $first: { $month: "$createdAt" } },
            [prop]: { $sum: sumField ? `$${sumField}` : 1 },
          },
        },
        {
          $sort: {
            year: 1,
            month: 1
          }
        }
      ]) as any[]
    : ([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },  
            },
            day: { $first: { $dayOfMonth: "$createdAt" } },
            [prop]: { $sum: sumField ? `$${sumField}` : 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
          },
        },
      ]) as any[];

     