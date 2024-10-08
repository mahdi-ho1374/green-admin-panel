import user from "./user";
import product from "./product";
import order from "./order";
import { AllowedFilterProps } from "../../../types/common";
import getMatchQuery from "./getMainPipeline";

type MatchQueryFunction = (
  term: boolean | [number, number] | string,
  withinRange?: boolean
) => any[];
type FilterQueries = Record<string, MatchQueryFunction> & {
  get: (filterProp: AllowedFilterProps) => MatchQueryFunction;
};

export default {
  ...order,
  ...product,
  ...user,
  get:
    (filterProp: AllowedFilterProps) =>
    (term: boolean | [number, number], withinRange?: boolean) => {
      return getMatchQuery(filterProp, term, withinRange);
    },
} as unknown as FilterQueries;
