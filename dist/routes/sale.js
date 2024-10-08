"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sale_1 = __importDefault(require("../controllers/sale"));
const router = (0, express_1.Router)();
router.get("/sales/chart", sale_1.default.getChartData);
router.get("/sales/top-buyers", sale_1.default.getTopBuyers);
router.get("/sales/most-sold-products", sale_1.default.getMostSoldProducts);
exports.default = router;
