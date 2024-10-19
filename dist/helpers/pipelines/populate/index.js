"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const order_1 = __importDefault(require("./order"));
const comment_1 = __importDefault(require("./comment"));
exports.default = Object.assign(Object.assign(Object.assign({}, user_1.default), order_1.default), comment_1.default);
