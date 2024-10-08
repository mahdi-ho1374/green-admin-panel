import { SortOrder } from "mongoose";
import product from "./product";
import user from "./user";
import order from "./order";
import basedOnUser from "./basedOnUser";
import { AllowedSortProps } from "../../../types/common";

const sort = (sortProp: AllowedSortProps, sortType: SortOrder) => [
  {
    $sort: {
      [sortProp]: sortType,
    },
  },
];

type SortQueryFunction = (sortType: SortOrder) => any[];
type SortQueries = Record<string, SortQueryFunction> & {
  get: (sortProp: AllowedSortProps) => SortQueryFunction;
};

const sortQueries = {
  ...product,
  ...user,
  ...order,
  user: basedOnUser,
  get: (sortProp: AllowedSortProps) => (sortType: SortOrder) => {
    return sort(sortProp, sortType);
  },
} as unknown as SortQueries;

export default sortQueries;
