import getMinMax from "./getMainPipeline";
import product from "../computedProps/product";

const revenue = [...product.revenue, ...getMinMax("revenue")];

export default { revenue };
