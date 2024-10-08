"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createSomeFakeData_1 = __importDefault(require("./tasks/createSomeFakeData"));
const updateLowStockProducts_1 = __importDefault(require("./tasks/updateLowStockProducts"));
const filePath = path_1.default.join(__dirname, "..", "scheduledTaskStatus.json");
const runScheduledTask = () => {
    const data = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
    const today = new Date().toLocaleDateString();
    const lastRun = data.lastRun;
    if (today === lastRun) {
        return;
    }
    else {
        (0, createSomeFakeData_1.default)();
        (0, updateLowStockProducts_1.default)();
        fs_1.default.writeFileSync(filePath, JSON.stringify({ lastRun: today }, null, 2), "utf-8");
    }
};
exports.default = runScheduledTask;
