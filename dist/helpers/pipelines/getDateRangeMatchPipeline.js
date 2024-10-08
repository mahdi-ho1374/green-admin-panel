"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (date1, date2) => [
    {
        $match: {
            createdAt: {
                $gte: date1,
                $lte: date2,
            },
        },
    },
];
