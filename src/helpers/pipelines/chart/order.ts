import getMainPipeline from "./getMainPipeline";

const createdAt = (groupBy: "daily" | "monthly") => [
  ...getMainPipeline("createdAt", groupBy),
];

export default { createdAt };
