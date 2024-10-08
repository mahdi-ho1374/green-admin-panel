"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../computedProps/user"));
const getMainPipeline_1 = __importDefault(require("./getMainPipeline"));
const ordersCount = ([min, max], withinRange) => [
    ...user_1.default.ordersCount,
    ...(0, getMainPipeline_1.default)("ordersCount", [min, max], withinRange),
    {
        $project: {
            ordersCount: 0,
        },
    },
];
exports.default = { ordersCount };
