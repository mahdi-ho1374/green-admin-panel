"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getMainPipeline_1 = __importDefault(require("./getMainPipeline"));
const product_1 = __importDefault(require("../computedProps/product"));
const revenue = [...product_1.default.revenue, ...(0, getMainPipeline_1.default)("revenue")];
exports.default = { revenue };
