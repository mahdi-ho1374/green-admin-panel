import getMinMax from "./getMainPipeline";
import order from "../computedProps/order";

const productsCount = [...order.productsCount, ...getMinMax("productsCount")];

const itemsCount = [...order.itemsCount, ...getMinMax("itemsCount")];

export default { productsCount, itemsCount };
