import product from "../computedProps/product";
import getMatchQuery from "./getMainPipeline";

const revenue = ([min, max]: [number, number], withinRange?: boolean) => [
  ...product.revenue,
  ...getMatchQuery("revenue", [min, max], withinRange),
  {
    $project: {
      revenue: 0,
    },
  },
];
export default { revenue };
