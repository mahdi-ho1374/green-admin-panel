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
const product_1 = __importDefault(require("../models/product"));
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lowStockProducts = yield product_1.default.find({ quantity: { $lt: 10 } });
        if (lowStockProducts.length === 0) {
            return;
        }
        for (const product of lowStockProducts) {
            const randomIncrease = Math.floor(Math.random() * 51) + 50;
            product.quantity += randomIncrease;
            yield product.save();
        }
    }
    catch (error) {
        throw error;
    }
});
