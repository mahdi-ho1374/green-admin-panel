"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userId = [
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
        },
    },
    { $unwind: "$userId" }
];
exports.default = { userId };
