import getMainPipeline from "./getMainPipeline";
import firstOrder from "../user/firstBuy";

const firstBuy = (groupBy: "monthly" | "daily") => [
  ...firstOrder,
  ...getMainPipeline("firstBuy", groupBy),
];

const signUp = (groupBy: "monthly" | "daily") => [
  ...getMainPipeline("signUp", groupBy),
];

export default { signUp, firstBuy };
