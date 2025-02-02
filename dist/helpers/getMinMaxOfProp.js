"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../types/common");
const minmax_1 = __importDefault(require("./pipelines/minmax"));
exports.default = (_a) => __awaiter(void 0, [_a], void 0, function* ({ collection, req, res, allowedMinMaxProps }) {
    var _b;
    const prop = req.params.prop.toLowerCase();
    if (!prop || !Object.keys(allowedMinMaxProps).includes(prop)) {
        res.status(400).send("The Prop you sent is not valid.");
        return null;
    }
    const transformedProp = allowedMinMaxProps[prop];
    const query = Object.keys(common_1.computedFilterProps).includes(prop)
        ? minmax_1.default[transformedProp]
        : minmax_1.default.get(transformedProp);
    const data = (yield collection.aggregate(query));
    const range = (_b = data[0]) === null || _b === void 0 ? void 0 : _b.range.map((item) => Number(item));
    return range;
});
