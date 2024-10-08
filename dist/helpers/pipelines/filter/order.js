"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = __importDefault(require("../computedProps/order"));
const getMainPipeline_1 = __importDefault(require("./getMainPipeline"));
const productsCount = ([min, max], withinRange) => [
    ...order_1.default.productsCount,
    ...(0, getMainPipeline_1.default)("productsCount", [min, max], withinRange),
    {
        $project: {
            productsCount: 0,
        },
    },
];
const itemsCount = ([min, max], withinRange) => [
    ...order_1.default.itemsCount,
    ...(0, getMainPipeline_1.default)("itemsCount", [min, max], withinRange),
    {
        $project: {
            itemsCount: 0,
        },
    },
];
exports.default = { productsCount, itemsCount };
