"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user = (sort) => [
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
        },
    },
    {
        $unwind: "$user",
    },
    {
        $sort: {
            "user.username": 1,
        },
    },
];
exports.default = { user };
