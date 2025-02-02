"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const product_1 = __importDefault(require("./product"));
const order_1 = __importDefault(require("./order"));
const getMainPipeline_1 = __importDefault(require("./getMainPipeline"));
exports.default = Object.assign(Object.assign(Object.assign(Object.assign({}, order_1.default), product_1.default), user_1.default), { get: (filterProp) => (term, withinRange) => {
        return (0, getMainPipeline_1.default)(filterProp, term, withinRange);
    } });
