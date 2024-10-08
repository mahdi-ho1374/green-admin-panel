import {
  AllowedSortProps,
  sortType,
  AllowedFilterProps,
} from "../types/common";
import { computedSortProps, computedFilterProps } from "../types/common";
import sortQueries from "./pipelines/sort";
import filterQueries from "./pipelines/filter";
import populateQueries from "./pipelines/populate";
import { Model } from "mongoose";
import { Request, Response } from "express";
import validateFetchRequest from "./validateFetchRequest";

interface Props {
  collection: Model<any>;
  req: Request;
  res: Response;
  allowedSortProps: Record<string, string>;
  allowedFilterProps: Record<string, string>;
  populate?: string;
}

export default async ({
  collection,
  req,
  res,
  allowedSortProps,
  allowedFilterProps,
  populate = "",
}: Props) => {
  const sortField = ((req.query?.sortField || "") as string)
    .trim()
    .toLowerCase() as keyof typeof allowedSortProps;
  const sortBy = ((req.query?.sortBy || "") as string)
    .trim()
    .toLowerCase() as keyof typeof sortType;
  const filterField = ((req.query?.filterField || "") as string)
    .trim()
    .toLowerCase() as keyof typeof allowedFilterProps;
  const filterTerm = ((req.query?.filterTerm || "") as string)
    .trim()
    .toLowerCase();
  const withinRange = req.query?.withinRange as any;

  const isValid = validateFetchRequest({
    sortField,
    sortBy,
    allowedSortProps,
    res,
    filterField,
    filterTerm,
    withinRange,
    allowedFilterProps,
  });
  if (!isValid) {
    return {};
  }
  const perPage = Number(req.query.perPage) || 30;
  const currentPage = Number(req.params.currentPage) || 1;
  const skippedDataCount = (currentPage - 1) * perPage;
  const filterValue = filterTerm.includes(",")
    ? (filterTerm
        .split(",")
        .map((item) =>
          item.includes("-") ? new Date(item) : Number(item)
        ) as [number, number])
    : !["true", "false"].includes(filterTerm)
    ? filterTerm
    : filterTerm === "true"
    ? true
    : false;
  const sortOrder = sortType[sortBy];
  const sortProp = allowedSortProps[sortField];
  const filterProp = allowedFilterProps[filterField];

  const isWithinRange = [undefined, null].includes(withinRange)
    ? true
    : withinRange === "false"
    ? false
    : true;

  const sortQuery: any = !Object.keys(computedSortProps).includes(sortField)
    ? sortQueries.get(sortProp as AllowedSortProps)(sortOrder)
    : sortQueries[sortProp as keyof typeof sortQueries](sortOrder);

  const filterQuery = !Object.keys(computedFilterProps).includes(filterField)
    ? filterQueries.get(filterProp as AllowedFilterProps)(
        filterValue,
        isWithinRange
      )
    : filterQueries[filterProp as keyof typeof filterQueries](
        filterValue,
        isWithinRange
      );

  const populateQuery =
    populateQueries[populate as keyof typeof populateQueries];

  const query: any[] = [];
  filterField && query.push(...filterQuery);
  sortField && query.push(...sortQuery);
  populate && query.push(...populateQuery);

  const result = await collection
    .aggregate(
      [
        ...query,
        {
          $facet: {
            data: [{ $skip: skippedDataCount }, { $limit: perPage }],
            count: [{ $count: "count" }],
          },
        },
      ],
      { collation: { locale: "en", strength: 2 } }
    )
    .exec();

  const data = result[0].data;
  const count = result[0]?.count[0]?.count || 0;

  const lastPage = Math.ceil(count / perPage);

  return {
    data,
    lastPage,
  };
};
