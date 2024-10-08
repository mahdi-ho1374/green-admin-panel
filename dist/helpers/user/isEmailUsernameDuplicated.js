"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../models/user"));
const mongodb_1 = require("mongodb");
exports.default = async ({ _id, username, email }) => {
    const includingId = {};
    if (_id && !["undefined", "null"].includes(String(_id))) {
        includingId._id = { $ne: new mongodb_1.ObjectId(_id) };
    }
    let users;
    if (username && email) {
        users = await user_1.default.find({
            ...includingId,
            $or: [{ email }, { username }],
        }).collation({
            locale: "en",
            strength: 2,
        });
        let isEmailDuplicated = false;
        let isUsernameDuplicated = false;
        users === null || users === void 0 ? void 0 : users.forEach((user) => {
            if (user.email === email) {
                isEmailDuplicated = true;
            }
            if (user.username === username) {
                isUsernameDuplicated = true;
            }
        });
        let errorMessage = "";
        errorMessage = isEmailDuplicated ? "Email is already taken" : errorMessage;
        errorMessage = isUsernameDuplicated
            ? "Username is already taken"
            : errorMessage;
        errorMessage =
            isUsernameDuplicated && isEmailDuplicated
                ? "Both email and username are already taken"
                : errorMessage;
        return errorMessage;
    }
    if (username) {
        users = await user_1.default.find({ ...includingId, username }).collation({
            locale: "en",
            strength: 2,
        });
    }
    if (email) {
        users = await user_1.default.find({ ...includingId, email }).collation({
            locale: "en",
            strength: 2,
        });
    }
    return users;
};
