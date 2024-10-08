"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../types/user");
const user_2 = __importDefault(require("../models/user"));
const order_1 = __importDefault(require("../models/order"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const error_1 = require("../models/error");
const getCollectionData_1 = __importDefault(require("../helpers/getCollectionData"));
const getMinMaxOfProp_1 = __importDefault(require("../helpers/getMinMaxOfProp"));
const user_3 = __importDefault(require("../helpers/pipelines/chart/user"));
const combineChartData_1 = __importDefault(require("../helpers/pipelines/chart/combineChartData"));
const getSearchResults_1 = __importDefault(require("../helpers/getSearchResults"));
const isEmailUsernameDuplicated_1 = __importDefault(require("../helpers/user/isEmailUsernameDuplicated"));
const express_validator_1 = require("express-validator");
const user_4 = __importDefault(require("../helpers/pipelines/populate/user"));
const getUsers = async (req, res, next) => {
    try {
        const { data, lastPage } = await (0, getCollectionData_1.default)({
            collection: user_2.default,
            req,
            res,
            allowedSortProps: user_1.allowedSortProps,
            allowedFilterProps: user_1.allowedFilterProps,
            populate: "orders",
        });
        if (!data && !lastPage) {
            return;
        }
        res.status(200).json({ data, lastPage });
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const updateUser = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ error: errors.array()[0].msg });
        return;
    }
    const body = req.body;
    const _id = body._id;
    const username = body.username;
    const firstName = body.firstName;
    const lastName = body.lastName;
    const age = body.age;
    const gender = body.age;
    const email = body.email;
    const phone = body.phone;
    const address = body.address;
    const totalSpent = body.totalSpent;
    const fields = {
        username,
        firstName,
        lastName,
        age,
        gender,
        email,
        phone,
        totalSpent,
        address,
    };
    try {
        const errorMessage = await (0, isEmailUsernameDuplicated_1.default)({
            _id,
            username,
            email,
        });
        if (errorMessage) {
            res.status(400).send(errorMessage);
            return;
        }
        const updatedUser = await user_2.default.findByIdAndUpdate(_id, fields, {
            new: false,
        });
        !updatedUser
            ? res
                .status(404)
                .json({ error: "The user you are trying to update doesn't exist" })
            : res.status(201).json(updatedUser);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const addUser = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ error: errors.array()[0].msg });
        return;
    }
    const body = req.body;
    const username = body.username;
    const firstName = body.firstName;
    const lastName = body.lastName;
    const age = body.age;
    const password = body.password;
    const gender = body.age;
    const email = body.email;
    const phone = body.phone;
    const address = body.address;
    const totalSpent = 0;
    const newUser = new user_2.default({
        username,
        firstName,
        lastName,
        password,
        age,
        gender,
        email,
        phone,
        address,
        totalSpent,
    });
    try {
        const errorMessage = await (0, isEmailUsernameDuplicated_1.default)({ username, email });
        if (errorMessage) {
            res.status(400).json({ error: errorMessage });
            return;
        }
        newUser.password = await bcryptjs_1.default.hash(password, 12);
        const createdUser = await newUser.save();
        res.status(201).json(createdUser);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const deleteUser = async (req, res, next) => {
    const body = req.body;
    const userId = body._id;
    try {
        const deletedUser = await user_2.default.findByIdAndDelete(userId);
        res.status(200).json(deletedUser);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const validateUser = async (req, res, next) => {
    const { username, email, _id } = req.query;
    if ((!username || !isNaN(Number(username))) &&
        (!email || !isNaN(Number(email)))) {
        res
            .status(400)
            .json({ error: "Email and username must be non-empty and non-numeric" });
        return;
    }
    try {
        const users = await (0, isEmailUsernameDuplicated_1.default)({ _id, email, username });
        res.status(200).json(users);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const queryUser = async (req, res, next) => {
    const term = String(req.query.term);
    const autoComplete = Boolean(req.query.autoComplete);
    if (!term.trim()) {
        res
            .status(400)
            .json({
            error: "Search term is empty. Please provide a valid search term.",
        });
        return;
    }
    try {
        const fields = Object.values(user_1.AllowedSearchFields);
        const data = await (0, getSearchResults_1.default)({
            model: user_2.default,
            fields,
            autoComplete,
            term,
            nextStages: user_4.default.orders,
        });
        res.status(200).json(data);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const getBYUsername = async (req, res, next) => {
    const username = String(req.query.username);
    if (!username || !isNaN(Number(username))) {
        res
            .status(400)
            .json({
            error: "Search term is empty. Please provide a valid search term.",
        });
        return;
    }
    try {
        const regexPattern = new RegExp(username, "i");
        const data = await user_2.default.find({ username: { $regex: regexPattern } });
        res.status(200).json(data);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
const getMinMax = async (req, res, next) => {
    try {
        const range = await (0, getMinMaxOfProp_1.default)({
            collection: user_2.default,
            req,
            res,
            allowedMinMaxProps: user_1.allowedMinMaxProps,
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
        const data = await (0, combineChartData_1.default)(user_2.default.aggregate([...user_3.default.signUp("monthly")]), order_1.default.aggregate([...user_3.default.firstBuy("monthly")]));
        res.status(200).json(data);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
};
exports.default = {
    deleteUser,
    updateUser,
    getUsers,
    addUser,
    getChartData,
    validateUser,
    getMinMax,
    getBYUsername,
    queryUser,
};
