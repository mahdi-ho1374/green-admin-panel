"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../types/common");
const minmax_1 = __importDefault(require("./pipelines/minmax"));
exports.default = async ({ collection, req, res, allowedMinMaxProps }) => {
    var _a;
    const prop = req.params.prop.toLowerCase();
    if (!prop || !Object.keys(allowedMinMaxProps).includes(prop)) {
        res.status(400).send("The Prop you sent is not valid.");
        return null;
    }
    const transformedProp = allowedMinMaxProps[prop];
    const query = Object.keys(common_1.computedFilterProps).includes(prop)
        ? minmax_1.default[transformedProp]
        : minmax_1.default.get(transformedProp);
    const data = (await collection.aggregate(query));
    const range = (_a = data[0]) === null || _a === void 0 ? void 0 : _a.range.map((item) => Number(item));
    return range;
};
