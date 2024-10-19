"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_1 = __importDefault(require("../models/comment"));
const error_1 = require("../models/error");
const mongodb_1 = require("mongodb");
const getCollectionData_1 = __importDefault(require("../helpers/getCollectionData"));
const comment_2 = require("../types/comment");
const comment_3 = __importDefault(require("../helpers/pipelines/chart/comment"));
const user_1 = __importDefault(require("../models/user"));
const user_2 = require("../types/user");
const comment_4 = require("../types/comment");
const getSearchResults_1 = __importDefault(require("../helpers/getSearchResults"));
const order_1 = __importDefault(require("../helpers/pipelines/populate/order"));
const express_validator_1 = require("express-validator");
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, lastPage } = yield (0, getCollectionData_1.default)({
            collection: comment_1.default,
            res,
            req,
            allowedSortProps: comment_2.allowedSortProps,
            allowedFilterProps: comment_2.allowedFilterProps,
            populate: "userId",
        });
        if (!data && !lastPage) {
            return;
        }
        const transformedComments = data.map((comment) => {
            const { userId } = comment, rest = __rest(comment, ["userId"]);
            return Object.assign({ user: userId }, rest);
        });
        res.status(200).json({ data: transformedComments, lastPage });
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
});
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ error: errors.array()[0].msg });
        return;
    }
    const body = req.body;
    const _id = body._id;
    let seen = body.seen;
    let approved = body.approved;
    let replied = body.replied;
    const text = body.text;
    const repliedText = body.repliedText;
    if (repliedText === null || repliedText === void 0 ? void 0 : repliedText.trim()) {
        seen = true;
        replied = true;
        approved = true;
    }
    if (approved) {
        seen = true;
    }
    const fields = { seen, approved, replied, text, repliedText };
    try {
        const updatedComment = yield comment_1.default.findByIdAndUpdate(_id, fields, {
            new: false,
        })
            .lean()
            .exec();
        updatedComment
            ? res.status(201).json(updatedComment)
            : res.status(404).json({
                error: "The comment you are trying to update doesn't exist",
            });
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
});
const addComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ error: errors.array()[0].msg });
        return;
    }
    const body = req.body;
    const userId = req.body.userId;
    let seen = body.seen;
    let approved = body.approved;
    let replied = body.replied;
    const text = body.text;
    const repliedText = body.repliedText;
    if (repliedText === null || repliedText === void 0 ? void 0 : repliedText.trim()) {
        seen = true;
        approved = true;
        replied = true;
    }
    if (approved) {
        seen = true;
    }
    const newComment = new comment_1.default({
        userId,
        text,
        seen,
        approved,
        replied,
        repliedText,
    });
    try {
        const user = yield user_1.default.findById(userId);
        if (!user) {
            res.status(404).json({
                error: "User not found. Please ensure that the specified user exists.",
            });
            return;
        }
        const createdComment = yield newComment.save();
        res.status(201).json(createdComment);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
});
const getChartData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield comment_1.default.aggregate(comment_3.default.createdAt("monthly"));
        res.status(200).json(data);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
});
const queryComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const term = String(req.query.term);
    const autoComplete = Boolean(req.query.autoComplete);
    if (!term) {
        res.status(400).json({
            error: "Search term is empty. Please provide a valid search term.",
        });
        return;
    }
    try {
        const commentFields = Object.values(comment_4.AllowedSearchFields);
        const userFields = Object.values(user_2.AllowedSearchFields);
        const commentsData1 = yield (0, getSearchResults_1.default)({
            model: comment_1.default,
            fields: commentFields,
            autoComplete,
            term,
            nextStages: order_1.default.userId,
        });
        const usersData = yield (0, getSearchResults_1.default)({
            model: user_1.default,
            fields: userFields,
            autoComplete,
            term,
        });
        if (autoComplete) {
            res.status(200).json([...new Set([...commentsData1, ...usersData])]);
            return;
        }
        const usersIds = usersData.map((user) => new mongodb_1.ObjectId(user._id));
        const commentsData2 = yield comment_1.default.find({ userId: { $in: usersIds } })
            .populate("userId")
            .lean();
        const duplicatedCommentData = [...commentsData1, ...commentsData2];
        const seenIds = new Set();
        const data = duplicatedCommentData.reduce((result, comment) => {
            const id = comment._id.toString();
            if (!seenIds.has(id)) {
                seenIds.add(id);
                return [...result, comment];
            }
            return result;
        }, []);
        const transformedData = data.map((comment) => {
            const { userId } = comment, rest = __rest(comment, ["userId"]);
            return Object.assign({ user: userId }, rest);
        });
        res.status(200).json(transformedData);
    }
    catch (err) {
        const error = new error_1.Erroro(err, 500);
        return next(error);
    }
});
exports.default = {
    getComments,
    updateComment,
    addComment,
    getChartData,
    queryComment,
};
