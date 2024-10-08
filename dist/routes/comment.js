"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_1 = __importDefault(require("../controllers/comment"));
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
const addOrUpdateComment = [
    (0, express_validator_1.body)("userId")
        .trim()
        .custom((value) => !(0, mongoose_1.isValidObjectId)(value) ? Promise.reject("User's id is invalid") : true)
        .withMessage("User's id is invalid"),
    (0, express_validator_1.body)("seen").isBoolean().withMessage("Seen should be true or false"),
    (0, express_validator_1.body)("approved").isBoolean().withMessage("Approved should be true or false"),
    (0, express_validator_1.body)("replied").isBoolean().withMessage("Replied should be true or false"),
    (0, express_validator_1.body)("text").trim().notEmpty().withMessage("Text should not be empty"),
];
const router = (0, express_1.Router)();
router.get("/comments/chart", comment_1.default.getChartData);
router.get("/comments/search", comment_1.default.queryComment);
router.put("/comment/edit", [
    ...addOrUpdateComment,
    (0, express_validator_1.body)("_id")
        .trim()
        .custom((value) => !(0, mongoose_1.isValidObjectId)(value)
        ? Promise.reject("Comment's id is invalid")
        : true),
], comment_1.default.updateComment);
router.post("/comment/add", [...addOrUpdateComment], comment_1.default.addComment);
router.get("/comments/:currentPage", comment_1.default.getComments);
exports.default = router;
