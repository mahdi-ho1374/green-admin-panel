import user from "../computedProps/user";
import getMatchQuery from "./getMainPipeline";

const ordersCount = ([min, max]: [number, number], withinRange?: boolean) => [
  ...user.ordersCount,
  ...getMatchQuery("ordersCount", [min, max],withinRange),
  {
    $project: {
      ordersCount: 0,
    },
  },
];

export default { ordersCount };
