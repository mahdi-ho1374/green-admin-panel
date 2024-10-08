"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../../../types/order");
const getMainPipeline_1 = __importDefault(require("./getMainPipeline"));
const amount = (groupBy) => [
    {
        $match: {
            status: { $ne: order_1.Status.CANCELED },
        },
    },
    { $unwind: "$items" },
    ...(0, getMainPipeline_1.default)("amount", groupBy, "items.amount")
];
const revenue = (groupBy) => [
    {
        $match: {
            status: { $ne: order_1.Status.CANCELED },
        },
    },
    ...(0, getMainPipeline_1.default)("revenue", groupBy, "totalPrice")
];
exports.default = { amount, revenue };
