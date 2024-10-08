import { Response } from "express";
import { sortType } from "../types/common";

export interface Props {
  sortField: string;
  sortBy: string | number;
  allowedSortProps: Record<string, string>;
  allowedFilterProps: Record<string, string>;
  withinRange: string;
  filterField: string;
  filterTerm: string;
  res: Response;
}

export default ({
  sortField,
  sortBy,
  allowedSortProps,
  res,
  filterField,
  withinRange,
  filterTerm,
  allowedFilterProps,
}: Props) => {
  if (!!sortBy !== !!sortField) {
    res
      .status(400)
      .send(
        "Please provide both sortField keyword and sortBy keyword, or don't include them at all."
      );
    return false;
  }
  if (!!filterField !== !!filterTerm) {
    res
      .status(400)
      .send(
        "Please provide both filterField keyword and filterTerm keyword, or don't include them at all."
      );
    return false;
  }
  if (
    ![undefined,null,""].includes(filterField) &&
    !Object.keys(allowedFilterProps).includes(filterField)
  ) {
    res.status(400).send("The filterField keyword entered is not valid");
    return false;
  }

  if (
    ![undefined,null,""].includes(sortField) &&
    !Object.keys(allowedSortProps).includes(sortField)
  ) {
    res.status(400).send("The sortField keyword entered is not valid.");
    return false;
  }
  if(![undefined,null,"","true","false"].includes(withinRange)) {
    res.status(400).send("The withinRange keyword entered is not valid.it must be true or false")
  }

  if (
    ![undefined ,null, ""].includes(sortBy as string) &&
    !Object.keys(sortType).includes(sortBy as string)
  ) {
    res
      .status(400)
      .send(
        "Please specify whether you want to sort in ascending or descending order. You can use asc or desc keywords"
      );
    return false;
  }
  return true;
};