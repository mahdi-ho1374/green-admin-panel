"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orders = [
    { $lookup: {
            from: "orders",
            localField: "orders",
            foreignField: "_id",
            as: "orders"
        } }
];
exports.default = { orders };
