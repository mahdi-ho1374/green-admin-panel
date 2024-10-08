"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getMainPipeline_1 = __importDefault(require("./getMainPipeline"));
const order_1 = __importDefault(require("../computedProps/order"));
const productsCount = [...order_1.default.productsCount, ...(0, getMainPipeline_1.default)("productsCount")];
const itemsCount = [...order_1.default.itemsCount, ...(0, getMainPipeline_1.default)("itemsCount")];
exports.default = { productsCount, itemsCount };
