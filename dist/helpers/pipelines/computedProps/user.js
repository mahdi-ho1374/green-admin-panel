"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ordersCount = [
    {
        $addFields: {
            ordersCount: { $size: "$orders" },
        },
    },
];
exports.default = { ordersCount };
