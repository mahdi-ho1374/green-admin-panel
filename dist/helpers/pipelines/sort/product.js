"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("../computedProps/product"));
const revenue = (sort) => [
    ...product_1.default.revenue,
    {
        $sort: {
            revenue: sort,
        },
    },
    {
        $project: {
            revenue: 0,
        },
    },
];
exports.default = { revenue };
