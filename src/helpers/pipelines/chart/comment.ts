import getMainPipeline from "./getMainPipeline";

const createdAt = (groupedBy: "monthly" | "daily") => [
 ...getMainPipeline("createdAt",groupedBy)
];

export default {createdAt};
