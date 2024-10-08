import { Model } from "mongoose";

export interface GetSearchResultsProps {
  term: string;
  fields: string[];
  autoComplete?: boolean;
  model: Model<any>;
  nextStages?: any[];
}

export default async ({
  term,
  fields,
  autoComplete,
  model,
  nextStages = [],
}: GetSearchResultsProps) => {
  const regexQuery = fields.map((field) => ({
    [field]: { $regex: new RegExp(term, "i")},
  }));
  const query: any[] = [
    {
      $match: {
        $or: [...regexQuery],
      },
    },
    ...nextStages,
  ];

  const data = await model.aggregate(query);
  if (autoComplete) {
    const valuesArray: string[] = [];
    data.forEach((item) =>
      fields.forEach((field) =>
        new RegExp(term, "i").test(item[field])
          ? valuesArray.push(item[field])
          : null
      )
    );
    const values = [...new Set(valuesArray)].slice(0, 10);
    return values;
  }
  return data;
};
