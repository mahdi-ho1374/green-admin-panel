import order from "../computedProps/order";
import getMatchQuery from "./getMainPipeline";

const productsCount = ([min, max]: [number, number],withinRange?: boolean) => [
  ...order.productsCount,
  ...getMatchQuery("productsCount", [min, max] , withinRange),
  {
    $project: {
      productsCount: 0,
    },
  },
];

const itemsCount = ([min, max]: [number, number] , withinRange?: boolean) => [
  ...order.itemsCount,
  ...getMatchQuery("itemsCount", [min, max] , withinRange),
  {
    $project: {
      itemsCount: 0,
    },
  },
];

export default { productsCount, itemsCount };
