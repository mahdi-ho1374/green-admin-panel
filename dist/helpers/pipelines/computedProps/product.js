"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const revenue = [
    {
        $addFields: {
            revenue: { $multiply: ["$salesNumber", "$price"] },
        },
    },
];
exports.default = { revenue };
