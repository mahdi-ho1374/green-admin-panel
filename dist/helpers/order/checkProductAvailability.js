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
const product_1 = __importDefault(require("../../models/product"));
exports.default = (_a) => __awaiter(void 0, [_a], void 0, function* ({ items, res, previousItems }) {
    const itemsIds = [...new Set(items.map(item => item._id))];
    const products = yield product_1.default.find({ _id: { $in: itemsIds } });
    const correspondingItems = items.map(item => {
        const correspondingProduct = products.find(product => product._id.toString() === item._id.toString());
        const previousProduct = previousItems ? previousItems.find(product => product._id.toString() === item._id.toString()) : { amount: 0 };
        if (!correspondingProduct) {
            res.status(404).send("One of products not found.Make sure the product exist in our shop.");
            return null;
        }
        if (correspondingProduct.quantity + previousProduct.amount < item.amount) {
            res.status(422).send(`Insufficient quantity for ${correspondingProduct.name}`);
            return null;
        }
        const { price, name } = correspondingProduct;
        return Object.assign(Object.assign({}, item), { price, name });
    });
    return correspondingItems;
});
