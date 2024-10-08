import product from "./product";
import user from "./user";
import order from "./order";

export default { ...user, ...product, ...order };
