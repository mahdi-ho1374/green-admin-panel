"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../computedProps/user"));
const ordersCount = (sort) => [
    ...user_1.default.ordersCount,
    {
        $sort: { ordersCount: sort },
    },
    {
        $project: {
            ordersCount: 0,
        },
    },
];
exports.default = { ordersCount };
