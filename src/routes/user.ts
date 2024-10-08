import { Router } from "express";
import userControllers from "../controllers/user";
import { body, check } from "express-validator";
import { isValidObjectId } from "mongoose";

const usernameValidation = [
  check("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username should be at least 3 characters")
    .isLength({ max: 20 })
    .withMessage("Username should be maximum 20 characters"),
];

const updateValidation = [
  ...usernameValidation,
  body("email").trim().isEmail().withMessage("Email is not valid"),
  body(["firstName", "lastName", "address", "phone", "gender"])
    .trim()
    .notEmpty()
    .withMessage("Fields can't be empty"),
  body("address")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Address must be at least 8 characters"),
  body("age")
    .isInt({ min: 18, max: 100 })
    .withMessage("Age should be in range 18-100"),
];

const addValidation = [
  ...updateValidation,
  body("password")
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
]

const router = Router();

router.get("/users/chart", userControllers.getChartData);

router.get("/users/search", userControllers.queryUser);

router.get("/users/:currentPage", userControllers.getUsers);

router.post("/user/add", [...addValidation], userControllers.addUser);

router.put(
  "/user/edit",
  [
    ...updateValidation,
    body("_id")
      .trim()
      .custom((value) => !isValidObjectId(value)
          ? Promise.reject("User's id is invalid")
          : true
      ),
  ],
  userControllers.updateUser
);

router.get("/user/validate", userControllers.validateUser);

router.get(
  "/users/search/byUsername",
  [...usernameValidation],
  userControllers.getBYUsername
);

router.get("/users/minmax/:prop", userControllers.getMinMax);

export default router;
