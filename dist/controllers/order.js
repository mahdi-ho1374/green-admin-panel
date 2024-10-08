"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = __importDefault(require("../models/order"));
const order_2 = require("../types/order");
const error_1 = require("../models/error");
const user_1 = __importDefault(require("../models/user"));
const createSession_1 = __importDefault(require("../helpers/order/createSession"));
const getCollectionData_1 = __importDefault(require("../helpers/getCollectionData"));
const order_3 = require("../types/order");
const getMinMaxOfProp_1 = __importDefault(require("../helpers/getMinMaxOfProp"));
const order_4 = __importDefault(require("../helpers/pipelines/chart/order"));
const user_2 = require("../types/user");
const product_1 = require("../types/product");
const getSearchResults_1 = __importDefault(require("../helpers/getSearchResults"));
const product_2 = __importDefault(require("../models/product"));
const mongodb_1 = require("mongodb");
const checkProductAvailability_1 = __importDefault(require("../helpers/order/checkProductAvailability"));
const express_validator_1 = require("express-validator");
const getOrders = async (req, res, next) => {
    try {
        const { data, lastPage } = await (0, getCollectionData_1.default)({
            collection: order_1.default,
            res,
            req,
            allowedSortProps: order_3.allowedSortProps,
            allowedFilterProps: order_3.allowedFilterProps,
            populate: "userId",
        });
        if (!data && !lastPage) {
            return;
        }
        const transformedOrders = data.map((order) => {
            const { userId, ...rest } = order;
            return {
                user: userId,
                ...rest,
            };
        });
        res.status(200).json({ data: transformedOrders, lastPage });
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const updateOrder = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ error: errors.array()[0].msg });
        return;
    }
    const body = req.body;
    const _id = body._id;
    const items = body.items;
    const status = body.status;
    try {
        const order = await order_1.default.findById(_id);
        if (!order) {
            res
                .status(404)
                .json({ error: "The order you are trying to update doesn't exist" });
            return;
        }
        const correspondingItems = await (0, checkProductAvailability_1.default)({
            items,
            res,
            previousItems: order.items,
        });
        const isNullItemThere = correspondingItems.find((item) => item === null);
        if (isNullItemThere) {
            return;
        }
        const totalPrice = parseFloat(correspondingItems.reduce((totalPrice, item) => totalPrice + item.amount * item.price, 0).toFixed(2));
        const fields = {
            items: correspondingItems,
            totalPrice,
            status,
        };
        let isItemsChanged = items.length !== order.items.length;
        if (!isItemsChanged) {
            const array1 = items
                .sort((a, b) => a._id.toString().localeCompare(b._id.toString()))
                .reduce((array1, item) => [...array1, item.amount, item._id], []);
            const array2 = order.items
                .sort((a, b) => a._id.toString().localeCompare(b._id.toString()))
                .reduce((array1, item) => [...array1, item.amount, item._id], []);
            isItemsChanged = false;
            for (let i = 0; i < array1.length; i++) {
                isItemsChanged = array1[i] === array2[i] ? isItemsChanged : true;
            }
        }
        if ([order_2.Status.DELIVERED, order_2.Status.PENDING].includes(status) &&
            order.status === order_2.Status.PENDING) {
            const updatedOrder = !isItemsChanged
                ? await (0, createSession_1.default)({
                    fields,
                    _id,
                })
                : await (0, createSession_1.default)({
                    fields,
                    order,
                    salesNumber: order_2.Operator.INC,
                    _id,
                    quantity: order_2.Operator.DEC,
                    totalSpent: parseFloat((totalPrice - parseFloat(order.totalPrice.toString())).toFixed(2)),
                });
            res.status(201).json(updatedOrder);
            return;
        }
        if (order.status !== order_2.Status.CANCELED &&
            status === order_2.Status.CANCELED &&
            !isItemsChanged) {
            const updatedOrder = await (0, createSession_1.default)({
                fields,
                salesNumber: order_2.Operator.DEC,
                _id,
                quantity: order_2.Operator.INC,
                totalSpent: -parseFloat(order.totalPrice.toString()),
            });
            res.status(201).json(updatedOrder);
            return;
        }
        if (order.status === order_2.Status.DELIVERED &&
            [order_2.Status.DELIVERED, order_2.Status.PENDING].includes(status)) {
            res
                .status(400)
                .json({
                error: "You can not change an already delivered order to pending order or delivered order.",
            });
            return;
        }
        if (order.status === order_2.Status.CANCELED) {
            res
                .status(400)
                .json({ error: "You can not change an already canceled order." });
            return;
        }
        if (order.status !== order_2.Status.CANCELED &&
            status === order_2.Status.CANCELED &&
            isItemsChanged) {
            res
                .status(400)
                .json({
                error: "You can just cancel an order. You can not change items and cancel at same time.",
            });
            return;
        }
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const addOrder = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ error: errors.array()[0].msg });
        return;
    }
    const body = req.body;
    const userId = body.userId;
    let items = body.items;
    const status = body.status;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            res
                .status(404)
                .json({
                error: "User not found. Please ensure that the specified user exists.",
            });
            return;
        }
        const correspondingItems = await (0, checkProductAvailability_1.default)({ items, res });
        const isNullItemThere = correspondingItems.some((item) => item === null);
        if (isNullItemThere) {
            return;
        }
        const totalPrice = parseFloat(correspondingItems.reduce((totalPrice, item) => totalPrice + item.amount * item.price, 0).toFixed(2));
        const newOrder = new order_1.default({
            userId,
            items: correspondingItems,
            totalPrice,
            status,
        });
        const createdOrder = (0, createSession_1.default)({
            fields: newOrder,
            isNew: true,
            salesNumber: order_2.Operator.INC,
            quantity: order_2.Operator.DEC,
            totalSpent: totalPrice,
        });
        res.status(201).json(createdOrder);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const queryOrders = async (req, res, next) => {
    const term = String(req.query.term);
    const autoComplete = Boolean(req.query.autoComplete);
    if (!term) {
        res
            .status(400)
            .json({
            error: "Search term is empty. Please provide a valid search term.",
        });
        return;
    }
    try {
        const productFields = Object.values(product_1.AllowedSearchFields);
        const userFields = Object.values(user_2.AllowedSearchFields);
        const productsData = await (0, getSearchResults_1.default)({
            model: product_2.default,
            fields: productFields,
            autoComplete,
            term,
        });
        const usersData = await (0, getSearchResults_1.default)({
            model: user_1.default,
            fields: userFields,
            autoComplete,
            term,
        });
        if (autoComplete) {
            res.status(200).json([...usersData, ...productsData]);
            return;
        }
        const usersIds = usersData.map((user) => new mongodb_1.ObjectId(user._id));
        const productsIds = productsData.map((product) => new mongodb_1.ObjectId(product._id));
        const ordersData1 = await order_1.default.find({ userId: { $in: usersIds } })
            .populate("userId")
            .lean();
        const ordersData2 = await order_1.default.find({
            items: {
                $elemMatch: {
                    _id: {
                        $in: productsIds,
                    },
                },
            },
        })
            .populate("userId")
            .lean();
        const duplicatedOrderData = [...ordersData1, ...ordersData2];
        const seenIds = new Set();
        const data = duplicatedOrderData.reduce((result, order) => {
            const id = order._id.toString();
            if (!seenIds.has(id)) {
                seenIds.add(id);
                return [...result, order];
            }
            return result;
        }, []);
        const transformedData = data.map((order) => {
            const { userId, ...rest } = order;
            return {
                user: userId,
                ...rest,
            };
        });
        res.status(200).json(transformedData);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const getMinMax = async (req, res, next) => {
    try {
        const range = await (0, getMinMaxOfProp_1.default)({
            collection: order_1.default,
            req,
            res,
            allowedMinMaxProps: order_3.allowedMinMaxProps,
        });
        if (!range) {
            return;
        }
        res.status(200).json(range);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const getChartData = async (req, res, next) => {
    try {
        const data = await order_1.default.aggregate([
            ...order_4.default.createdAt("monthly"),
        ]);
        res.status(200).json(data);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
exports.default = {
    updateOrder,
    addOrder,
    getOrders,
    getMinMax,
    getChartData,
    queryOrders,
};
