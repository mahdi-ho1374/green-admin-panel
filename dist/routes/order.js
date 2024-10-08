"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = __importDefault(require("../controllers/order"));
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
const order_2 = require("../types/order");
const router = (0, express_1.default)();
const addOrUpdateValidation = [
    (0, express_validator_1.body)("userId")
        .trim()
        .custom((value) => !(0, mongoose_1.isValidObjectId)(value) ? Promise.reject("Users's id is invalid") : true)
        .withMessage("User's id is invalid"),
    (0, express_validator_1.body)("status")
        .trim()
        .custom((value) => !Object.values(order_2.Status).includes(value)
        ? Promise.reject("Status is invalid")
        : true)
        .withMessage("Status is invalid"),
    (0, express_validator_1.body)("items")
        .custom((value) => value.length < 1 ? Promise.reject("Provide at least one product") : true)
        .withMessage("Provide at least one product"),
];
router.get("/orders/chart", order_1.default.getChartData);
router.get("/orders/search", order_1.default.queryOrders);
router.get("/orders/:currentPage", order_1.default.getOrders);
router.post("/order/add", [...addOrUpdateValidation], order_1.default.addOrder);
router.put("/order/edit", [
    ...addOrUpdateValidation,
    (0, express_validator_1.body)("_id")
        .trim()
        .custom((value) => !(0, mongoose_1.isValidObjectId)(value)
        ? Promise.reject("Order's id is invalid")
        : true)
        .withMessage("Order's id is invalid"),
], order_1.default.updateOrder);
router.get("/orders/minmax/:prop", order_1.default.getMinMax);
exports.default = router;
