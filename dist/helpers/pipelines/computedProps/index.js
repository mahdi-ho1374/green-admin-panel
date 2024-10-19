"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("./product"));
const user_1 = __importDefault(require("./user"));
const order_1 = __importDefault(require("./order"));
exports.default = Object.assign(Object.assign(Object.assign({}, user_1.default), product_1.default), order_1.default);
