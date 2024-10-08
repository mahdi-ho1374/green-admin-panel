"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getMainPipeline_1 = __importDefault(require("./getMainPipeline"));
const firstBuy_1 = __importDefault(require("../user/firstBuy"));
const firstBuy = (groupBy) => [
    ...firstBuy_1.default,
    ...(0, getMainPipeline_1.default)("firstBuy", groupBy),
];
const signUp = (groupBy) => [
    ...(0, getMainPipeline_1.default)("signUp", groupBy),
];
exports.default = { signUp, firstBuy };
