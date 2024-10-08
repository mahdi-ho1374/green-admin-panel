"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controllers/user"));
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
const usernameValidation = [
    (0, express_validator_1.check)("username")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Username should be at least 3 characters")
        .isLength({ max: 20 })
        .withMessage("Username should be maximum 20 characters"),
];
const updateValidation = [
    ...usernameValidation,
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("Email is not valid"),
    (0, express_validator_1.body)(["firstName", "lastName", "address", "phone", "gender"])
        .trim()
        .notEmpty()
        .withMessage("Fields can't be empty"),
    (0, express_validator_1.body)("address")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Address must be at least 8 characters"),
    (0, express_validator_1.body)("age")
        .isInt({ min: 18, max: 100 })
        .withMessage("Age should be in range 18-100"),
];
const addValidation = [
    ...updateValidation,
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("password should be at least 8 characters")
        .isLength({ max: 20 })
        .withMessage("Password should be maximum 20 characters")
        .isStrongPassword({
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
        .withMessage("Include uppercase, lowercase, digit, and special character."),
];
const router = (0, express_1.Router)();
router.get("/users/chart", user_1.default.getChartData);
router.get("/users/search", user_1.default.queryUser);
router.get("/users/:currentPage", user_1.default.getUsers);
router.post("/user/add", [...addValidation], user_1.default.addUser);
router.put("/user/edit", [
    ...updateValidation,
    (0, express_validator_1.body)("_id")
        .trim()
        .custom((value) => !(0, mongoose_1.isValidObjectId)(value)
        ? Promise.reject("User's id is invalid")
        : true),
], user_1.default.updateUser);
router.get("/user/validate", user_1.default.validateUser);
router.get("/users/search/byUsername", [...usernameValidation], user_1.default.getBYUsername);
router.get("/users/minmax/:prop", user_1.default.getMinMax);
exports.default = router;
