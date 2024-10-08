import { AllowedSortProps, computedFilterProps } from "../types/common";
import { Model } from "mongoose";
import { Request, Response } from "express";
import queries from "./pipelines/minmax";

interface Props {
  collection: Model<any>;
  req: Request;
  res: Response;
  allowedMinMaxProps: Record<string, string>;
  populate?: string;
}

export default async ({ collection, req, res, allowedMinMaxProps }: Props) => {
  const prop = req.params.prop.toLowerCase();
  if (!prop || !Object.keys(allowedMinMaxProps).includes(prop)) {
    res.status(400).send("The Prop you sent is not valid.");
    return null;
  }
  const transformedProp = allowedMinMaxProps[prop];
  const query = Object.keys(computedFilterProps).includes(prop)
    ? (queries[transformedProp as keyof typeof queries] as any[])
    : (queries.get(transformedProp as AllowedSortProps) as any[]);
  const data = (await collection.aggregate(query)) as unknown as [
    {
      range: [string, string];
    }
  ];

  const range = data[0]?.range.map((item) => Number(item));
  return range;
};
