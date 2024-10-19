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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../models/user"));
const mongodb_1 = require("mongodb");
exports.default = (_a) => __awaiter(void 0, [_a], void 0, function* ({ _id, username, email }) {
    const includingId = {};
    if (_id && !["undefined", "null"].includes(String(_id))) {
        includingId._id = { $ne: new mongodb_1.ObjectId(_id) };
    }
    let users;
    if (username && email) {
        users = yield user_1.default.find(Object.assign(Object.assign({}, includingId), { $or: [{ email }, { username }] })).collation({
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
        users = yield user_1.default.find(Object.assign(Object.assign({}, includingId), { username })).collation({
            locale: "en",
            strength: 2,
        });
    }
    if (email) {
        users = yield user_1.default.find(Object.assign(Object.assign({}, includingId), { email })).collation({
            locale: "en",
            strength: 2,
        });
    }
    return users;
});
