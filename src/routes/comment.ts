import { Router } from "express";
import commentControllers from "../controllers/comment";
import { body,param } from "express-validator";
import { isValidObjectId } from "mongoose";

const addOrUpdateComment = [
  body("userId")
    .trim()
    .custom((value) =>
      !isValidObjectId(value) ? Promise.reject("User's id is invalid") : true
    )
    .withMessage("User's id is invalid"),
  body("seen").isBoolean().withMessage("Seen should be true or false"),
  body("approved").isBoolean().withMessage("Approved should be true or false"),
  body("replied").isBoolean().withMessage("Replied should be true or false"),
  body("text").trim().notEmpty().withMessage("Text should not be empty"),
];

const router = Router();

router.get("/comments/chart", commentControllers.getChartData);

router.get("/comments/search", commentControllers.queryComment);

router.put(
  "/comment/edit",
  [
    ...addOrUpdateComment,
    body("_id")
      .trim()
      .custom((value) =>
        !isValidObjectId(value)
          ? Promise.reject("Comment's id is invalid")
          : true
      ),
  ],
  commentControllers.updateComment
);

router.post(
  "/comment/add",
  [...addOrUpdateComment],
  commentControllers.addComment
);

router.get("/comments/:currentPage", commentControllers.getComments);

router.delete("/comment/delete/:id",[param("id").trim().custom((value) => !isValidObjectId(value) ? Promise.reject("Comment's id is invalid") : true)],commentControllers.deleteComment);

export default router;
