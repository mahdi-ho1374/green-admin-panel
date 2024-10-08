import Comment from "../models/comment";
import { Erroro } from "../models/error";
import { AddCommentBody, UpdateCommentBody } from "../types/reqBodyInterfaces";
import { Controller } from "../types/controller";
import { ObjectId } from "mongodb";
import type { IComment, TransformedComment } from "../types/comment";
import getCollectionData from "../helpers/getCollectionData";
import { allowedSortProps, allowedFilterProps } from "../types/comment";
import chartPipelines from "../helpers/pipelines/chart/comment";
import User from "../models/user";
import { AllowedSearchFields as UserAllowedSearchFields } from "../types/user";
import { AllowedSearchFields as CommentAllowedSearchFields } from "../types/comment";
import getSearchResults from "../helpers/getSearchResults";
import orderPopulatePipeline from "../helpers/pipelines/populate/order";
import { validationResult } from "express-validator";

const getComments: Controller = async (req, res, next) => {
  try {
    const { data, lastPage } = await getCollectionData({
      collection: Comment,
      res,
      req,
      allowedSortProps,
      allowedFilterProps,
      populate: "userId",
    });
    if (!data && !lastPage) {
      return;
    }
    const transformedComments: TransformedComment[] = (data as IComment[]).map(
      (comment: IComment) => {
        const { userId, ...rest } = comment;
        return {
          user: userId,
          ...rest,
        } as unknown as TransformedComment;
      }
    );
    res.status(200).json({ data: transformedComments, lastPage });
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const updateComment: Controller = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ error: errors.array()[0].msg });
    return;
  }
  const body: UpdateCommentBody = req.body;
  const _id = body._id;
  let seen = body.seen;
  let approved = body.approved;
  let replied = body.replied;
  const text = body.text;
  const repliedText = body.repliedText;
  if (repliedText?.trim()) {
    seen = true;
    replied = true;
    approved = true;
  }
  if (approved) {
    seen = true;
  }
  const fields = { seen, approved, replied, text, repliedText };
  try {
    const updatedComment = await Comment.findByIdAndUpdate(_id, fields, {
      new: false,
    })
      .lean()
      .exec();
    updatedComment
      ? res.status(201).json(updatedComment)
      : res.status(404).json({
          error: "The comment you are trying to update doesn't exist",
        });
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const addComment: Controller = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ error: errors.array()[0].msg });
    return;
  }
  const body: AddCommentBody = req.body;
  const userId = req.body.userId;
  let seen = body.seen;
  let approved = body.approved;
  let replied = body.replied;
  const text = body.text;
  const repliedText = body.repliedText;
  if (repliedText?.trim()) {
    seen = true;
    approved = true;
    replied = true;
  }
  if (approved) {
    seen = true;
  }
  const newComment = new Comment({
    userId,
    text,
    seen,
    approved,
    replied,
    repliedText,
  });
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        error: "User not found. Please ensure that the specified user exists.",
      });
      return;
    }
    const createdComment = await newComment.save();
    res.status(201).json(createdComment);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getChartData: Controller = async (req, res, next) => {
  try {
    const data = await Comment.aggregate(chartPipelines.createdAt("monthly"));
    res.status(200).json(data);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const queryComment: Controller = async (req, res, next) => {
  const term = String(req.query.term);

  const autoComplete = Boolean(req.query.autoComplete);
  if (!term) {
     res.status(400).json({
      error: "Search term is empty. Please provide a valid search term.",
    });
    return;
  }
  try {
    const commentFields = Object.values(CommentAllowedSearchFields);
    const userFields = Object.values(UserAllowedSearchFields);
    const commentsData1 = await getSearchResults({
      model: Comment,
      fields: commentFields,
      autoComplete,
      term,
      nextStages: orderPopulatePipeline.userId,
    });
    const usersData = await getSearchResults({
      model: User,
      fields: userFields,
      autoComplete,
      term,
    });
   
    if (autoComplete) {
      res.status(200).json([...new Set([...commentsData1, ...usersData])]);
      return;
    } 
    const usersIds: ObjectId[] = usersData.map(
      (user) => new ObjectId(user._id)
    );
    const commentsData2 = await Comment.find({ userId: { $in: usersIds } })
      .populate("userId")
      .lean();
    const duplicatedCommentData = [...commentsData1, ...commentsData2];
    const seenIds = new Set();
    const data = duplicatedCommentData.reduce((result, comment) => {
      const id = comment._id.toString();
      if (!seenIds.has(id)) {
        seenIds.add(id);
        return [...result, comment];
      }
      return result;
    }, []);
    const transformedData: TransformedComment[] = (data as IComment[]).map(
      (comment: IComment) => {
        const { userId, ...rest } = comment;
        return {
          user: userId,
          ...rest,
        } as unknown as TransformedComment;
      }
    );
    res.status(200).json(transformedData);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

export default {
  getComments,
  updateComment,
  addComment,
  getChartData,
  queryComment,
};
