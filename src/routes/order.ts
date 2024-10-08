import Router from "express";
import orderControllers from "../controllers/order";
import { body } from "express-validator";
import { isValidObjectId } from "mongoose";
import { Status } from "../types/order";

const router = Router();

const addOrUpdateValidation = [
  body("userId")
    .trim()
    .custom((value) =>
      !isValidObjectId(value) ? Promise.reject("Users's id is invalid") : true
    )
    .withMessage("User's id is invalid"),
  body("status")
    .trim()
    .custom((value) =>
      !Object.values(Status).includes(value)
        ? Promise.reject("Status is invalid")
        : true
    )
    .withMessage("Status is invalid"),
  body("items")
    .custom((value) =>
      value.length < 1 ? Promise.reject("Provide at least one product") : true
    )
    .withMessage("Provide at least one product"),
];

router.get("/orders/chart", orderControllers.getChartData);

router.get("/orders/search",orderControllers.queryOrders);

router.get("/orders/:currentPage", orderControllers.getOrders);

router.post(
  "/order/add",
  [...addOrUpdateValidation],
  orderControllers.addOrder
);

router.put(
  "/order/edit",
  [
    ...addOrUpdateValidation,
    body("_id")
      .trim()
      .custom((value) =>
        !isValidObjectId(value)
          ? Promise.reject("Order's id is invalid")
          : true
      )
      .withMessage("Order's id is invalid"),
  ],
  orderControllers.updateOrder
);

router.get("/orders/minmax/:prop", orderControllers.getMinMax);



export default router;
