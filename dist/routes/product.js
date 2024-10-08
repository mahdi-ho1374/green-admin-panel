"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const product_1 = __importDefault(require("../controllers/product"));
const product_2 = require("../types/product");
const router = (0, express_1.Router)();
const addOrUpdateValidation = [
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Name should be at least 3 characters")
        .isLength({ max: 20 })
        .withMessage("Name should be maximum 20 characters"),
    (0, express_validator_1.body)("description")
        .trim()
        .isLength({ min: 25 })
        .withMessage("Description should be at least 25 characters"),
    (0, express_validator_1.body)("price")
        .isNumeric()
        .withMessage("Price should be numeric")
        .custom((value) => value < 15 || value > 200
        ? Promise.reject("Price should be in range 15-200")
        : true)
        .withMessage("Price should be at in range 15-200"),
    (0, express_validator_1.body)("quantity")
        .isNumeric()
        .withMessage("Quantity should be numeric")
        .isInt({ min: 0, max: 150 })
        .withMessage("Quantity should be in range 0-150"),
    (0, express_validator_1.body)("category").trim().custom((value) => Object.values(product_2.ProductCategory).includes(value)
        ? true
        : Promise.reject("Category is invalid")),
];
router.get("/products/chart", product_1.default.getChartData);
router.post("/products/byId", product_1.default.getProductsById);
router.get("/products/search/byName/:number", product_1.default.queryProductName);
router.get("/products/search", product_1.default.queryProduct);
router.post("/product/add", [...addOrUpdateValidation], product_1.default.addProduct);
router.put("/product/edit", [...addOrUpdateValidation], product_1.default.updateProduct);
router.get("/products/minmax/:prop", product_1.default.getMinMax);
router.get("/products/:currentPage", product_1.default.getProducts);
exports.default = router;
