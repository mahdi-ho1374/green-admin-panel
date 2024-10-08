"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = __importDefault(require("../computedProps/order"));
const productsCount = (sort) => [
    ...order_1.default.productsCount,
    {
        $sort: { productsCount: sort },
    },
    {
        $project: {
            productsCount: 0,
        },
    },
];
const itemsCount = (sort) => [
    ...order_1.default.itemsCount,
    {
        $sort: {
            itemsCount: sort,
        },
    },
    {
        $project: {
            itemsCount: 0,
        },
    },
];
exports.default = { productsCount, itemsCount };
