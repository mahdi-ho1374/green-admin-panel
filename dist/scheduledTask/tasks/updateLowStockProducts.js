"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("../../models/product"));
exports.default = async () => {
    try {
        const lowStockProducts = await product_1.default.find({ quantity: { $lt: 10 } });
        if (lowStockProducts.length === 0) {
            return;
        }
        for (const product of lowStockProducts) {
            const randomIncrease = Math.floor(Math.random() * 51) + 50;
            product.quantity += randomIncrease;
            await product.save();
        }
    }
    catch (error) { }
};
