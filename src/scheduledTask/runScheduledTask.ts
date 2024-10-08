import fs from "fs";
import path from "path";
import createSomeFakeData from "./tasks/createSomeFakeData";
import updateLowStockProducts from "./tasks/updateLowStockProducts";

const filePath = path.join(
  __dirname,
  "..",
  "scheduledTaskStatus.json"
);

const runScheduledTask = () => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const today = new Date().toLocaleDateString();
  const lastRun = data.lastRun;
  if (today === lastRun) {
    return;
  } else {
    createSomeFakeData();
    updateLowStockProducts();
    fs.writeFileSync(
      filePath,
      JSON.stringify({ lastRun: today }, null, 2),
      "utf-8"
    );
  }
};

export default runScheduledTask;