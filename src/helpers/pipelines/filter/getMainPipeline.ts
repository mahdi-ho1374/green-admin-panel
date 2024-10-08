export default (
  field: string,
  term: boolean | [number, number],
  withinRange?: boolean
) => {
  if (typeof term === "object") {
    const operator = withinRange ? "$and" : "$or";
    const gte = withinRange ? term[0] : term[1];
    const lte = withinRange ? term[1] : term[0];
    const greaterOP = withinRange ? "$gte" : "$gt";
    const lowerOP = withinRange ? "$lte" : "$lt";
    return [
      {
        $match: {
          [operator]: [
            { [field]: { [greaterOP]: gte } },
            { [field]: { [lowerOP]: lte } },
          ],
        },
      },
    ];
  } else {
    return [
      {
        $match: {
          [field]: term,
        },
      },
    ];
  }
};
