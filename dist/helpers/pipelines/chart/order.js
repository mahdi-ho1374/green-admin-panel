"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getMainPipeline_1 = __importDefault(require("./getMainPipeline"));
const createdAt = (groupBy) => [
    ...(0, getMainPipeline_1.default)("createdAt", groupBy),
];
exports.default = { createdAt };
