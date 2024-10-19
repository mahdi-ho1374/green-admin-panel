"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("./product"));
const user_1 = __importDefault(require("./user"));
const order_1 = __importDefault(require("./order"));
const basedOnUser_1 = __importDefault(require("./basedOnUser"));
const sort = (sortProp, sortType) => [
    {
        $sort: {
            [sortProp]: sortType,
        },
    },
];
const sortQueries = Object.assign(Object.assign(Object.assign(Object.assign({}, product_1.default), user_1.default), order_1.default), { user: basedOnUser_1.default, get: (sortProp) => (sortType) => {
        return sort(sortProp, sortType);
    } });
exports.default = sortQueries;
