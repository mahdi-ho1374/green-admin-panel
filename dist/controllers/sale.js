"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../models/error");
const sale_1 = __importDefault(require("../helpers/pipelines/chart/sale"));
const order_1 = __importDefault(require("../models/order"));
const combineChartData_1 = __importDefault(require("../helpers/pipelines/chart/combineChartData"));
const order_2 = require("../types/order");
const getMostSoldProducts = async (req, res, next) => {
    try {
        const aggregatedMostSoldProducts = await order_1.default.aggregate([
            {
                $match: {
                    status: { $ne: order_2.Status.CANCELED },
                },
            },
            {
                $unwind: "$items",
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        itemId: "$items._id",
                        itemName: "$items.name",
                    },
                    totalSalesPerProduct: { $sum: "$items.amount" },
                    totalRevenuePerProduct: {
                        $sum: { $multiply: ["$items.amount", "$items.price"] },
                    },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
            {
                $facet: {
                    amount: [
                        {
                            $sort: {
                                "_id.year": 1,
                                "_id.month": 1,
                                totalSalesPerProduct: -1,
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    year: "$_id.year",
                                    month: "$_id.month",
                                },
                                amount: {
                                    $first: {
                                        _id: "$_id.itemId",
                                        name: "$_id.itemName",
                                        amount: "$totalSalesPerProduct",
                                        revenue: "$totalRevenuePerProduct",
                                    },
                                },
                            },
                        },
                    ],
                    revenue: [
                        {
                            $sort: {
                                "_id.year": 1,
                                "_id.month": 1,
                                totalRevenuePerProduct: -1,
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    year: "$_id.year",
                                    month: "$_id.month",
                                },
                                revenue: {
                                    $first: {
                                        _id: "$_id.itemId",
                                        name: "$_id.itemName",
                                        amount: "$totalSalesPerProduct",
                                        revenue: "$totalRevenuePerProduct",
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        ]);
        const mostSoldProducts = aggregatedMostSoldProducts[0].revenue.map((item, index) => ({
            ...item, month: item._id.month, year: item._id.year, ...aggregatedMostSoldProducts[0].amount[index]
        }));
        res.status(200).json(mostSoldProducts);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const getTopBuyers = async (req, res, next) => {
    try {
        let aggregatedTopBuyers = await order_1.default.aggregate([
            {
                $match: {
                    status: { $ne: order_2.Status.CANCELED },
                },
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        userId: "$userId",
                    },
                    totalSalesPerUser: { $sum: "$items.amount" },
                    totalRevenuePerUser: { $sum: { $multiply: ["$items.amount", "$items.price"] } },
                },
            },
            { $lookup: {
                    from: "users",
                    localField: "_id.userId",
                    foreignField: "_id",
                    as: "user"
                } },
            { $unwind: "$user" },
            { $addFields: {
                    "_id.username": "$user.username"
                } },
            { $project: { user: 0 } },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
            {
                $facet: {
                    amount: [
                        {
                            $sort: {
                                "_id.year": 1,
                                "_id.month": 1,
                                totalSalesPerUser: -1,
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    year: "$_id.year",
                                    month: "$_id.month",
                                },
                                amount: {
                                    $first: {
                                        _id: "$_id.userId",
                                        username: "$_id.username",
                                        amount: "$totalSalesPerUser",
                                        revenue: "$totalRevenuePerUser",
                                    },
                                },
                            },
                        },
                    ],
                    revenue: [
                        {
                            $sort: {
                                "_id.year": 1,
                                "_id.month": 1,
                                totalRevenuePerUser: -1,
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    year: "$_id.year",
                                    month: "$_id.month",
                                },
                                revenue: {
                                    $first: {
                                        _id: "$_id.userId",
                                        username: "$_id.username",
                                        amount: "$totalSalesPerUser",
                                        revenue: "$totalRevenuePerUser",
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        ]);
        const topBuyers = aggregatedTopBuyers[0].revenue.map((item, index) => ({
            ...item, month: item._id.month, year: item._id.year, ...aggregatedTopBuyers[0].amount[index]
        }));
        res.status(200).json(topBuyers);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const getChartData = async (req, res, next) => {
    try {
        const data = await (0, combineChartData_1.default)(order_1.default.aggregate([...sale_1.default.revenue("monthly")]), order_1.default.aggregate([...sale_1.default.amount("monthly")]));
        res.status(200).json(data);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
exports.default = { getChartData, getTopBuyers, getMostSoldProducts };
