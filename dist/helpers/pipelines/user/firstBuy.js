"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firstBuy = [
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
        },
    },
    {
        $unwind: "$user",
    },
    {
        $addFields: {
            isOrderFirst: {
                $eq: [{ $arrayElemAt: ["$user.orders", 0] }, "$_id"],
            }
        },
    },
    {
        $match: {
            isOrderFirst: true,
        },
    },
];
exports.default = firstBuy;
