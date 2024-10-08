"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("../../models/product"));
exports.default = async ({ items, res, previousItems }) => {
    const itemsIds = [...new Set(items.map(item => item._id))];
    const products = await product_1.default.find({ _id: { $in: itemsIds } });
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
        return { ...item, price, name };
    });
    return correspondingItems;
};
