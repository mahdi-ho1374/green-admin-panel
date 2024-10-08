"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const productsCount = [
    {
        $addFields: {
            productsCount: { $size: "$items" },
        },
    },
];
const itemsCount = [
    {
        $addFields: { itemsCount: { $sum: "$items.amount" } },
    },
];
exports.default = { productsCount, itemsCount };
