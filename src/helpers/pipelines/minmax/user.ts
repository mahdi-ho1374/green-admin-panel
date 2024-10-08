import getMinMax from "./getMainPipeline";
import user from "../computedProps/user";

const ordersCount = [...user.ordersCount, ...getMinMax("ordersCount")];

export default { ordersCount };
