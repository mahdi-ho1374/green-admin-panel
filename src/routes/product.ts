import { Router } from "express";
import { body } from "express-validator";

import productControllers from "../controllers/product";
import { ProductCategory } from "../types/product";

const router = Router();

const addOrUpdateValidation = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 characters")
    .isLength({ max: 20 })
    .withMessage("Name should be maximum 20 characters"),
  body("description")
    .trim()
    .isLength({ min: 25 })
    .withMessage("Description should be at least 25 characters"),
  body("price")
    .isNumeric()
    .withMessage("Price should be numeric")
    .custom((value) =>
      value < 15 || value > 200
        ? Promise.reject("Price should be in range 15-200")
        : true
    )
    .withMessage("Price should be at in range 15-200"),
  body("quantity")
    .isNumeric()
    .withMessage("Quantity should be numeric")
    .isInt({ min: 0, max: 150 })
    .withMessage("Quantity should be in range 0-150"),
  body("category").trim().custom((value) =>
    Object.values(ProductCategory).includes(value)
      ? true
      : Promise.reject("Category is invalid")
  ),
];

router.get("/products/chart", productControllers.getChartData);

router.post("/products/byId", productControllers.getProductsById);

router.get(
  "/products/search/byName/:number",
  productControllers.queryProductName
);

router.get("/products/search", productControllers.queryProduct);

router.post(
  "/product/add",
  [...addOrUpdateValidation],
  productControllers.addProduct
);

router.put(
  "/product/edit",
  [...addOrUpdateValidation],
  productControllers.updateProduct
);

router.get("/products/minmax/:prop", productControllers.getMinMax);

router.get("/products/:currentPage", productControllers.getProducts);

export default router;
