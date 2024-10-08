"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_1 = __importDefault(require("../controllers/dashboard"));
const router = (0, express_1.Router)();
router.get("/dashboard/totals", dashboard_1.default.getTotals);
router.get("/dashboard/last30days", dashboard_1.default.getLast30DaysData);
router.get("/dashboard/chart", dashboard_1.default.getChartData);
exports.default = router;
