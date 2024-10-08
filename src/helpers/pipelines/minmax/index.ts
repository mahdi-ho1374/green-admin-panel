import user from "./user";
import product from "./product";
import order from "./order";
import { AllowedSortProps } from "../../../types/common";
import getMinMax from "./getMainPipeline";

export default {
  ...user,
  ...order,
  ...product,
  get: (sortProp: AllowedSortProps) => getMinMax(sortProp),
};
