import { Controller } from "../types/controller";
import {
  allowedSortProps,
  allowedMinMaxProps,
  allowedFilterProps,
  AllowedSearchFields,
} from "../types/user";
import User from "../models/user";
import Order from "../models/order";
import bcrypt from "bcryptjs";
import { Erroro } from "../models/error";
import {
  AddUserBody,
  UpdateUserBody,
  DeleteUserBody,
} from "../types/reqBodyInterfaces";
import getCollectionData from "../helpers/getCollectionData";
import getMinMaxOfProp from "../helpers/getMinMaxOfProp";
import chartPipelines from "../helpers/pipelines/chart/user";
import combineChartData from "../helpers/pipelines/chart/combineChartData";
import getSearchResults from "../helpers/getSearchResults";
import isEmailUsernameDuplicated from "../helpers/user/isEmailUsernameDuplicated";
import { validationResult } from "express-validator";
import populatePipeline from "../helpers/pipelines/populate/user";
import { Decimal128 } from "mongodb";

const getUsers: Controller = async (req, res, next) => {
  try {
    const { data, lastPage } = await getCollectionData({
      collection: User,
      req,
      res,
      allowedSortProps,
      allowedFilterProps,
      populate: "orders",
    });
    if (!data && !lastPage) {
      return;
    }
    res.status(200).json({ data, lastPage });
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const updateUser: Controller = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ error: errors.array()[0].msg });
    return;
  }
  const body: UpdateUserBody = req.body;
  const _id = body._id as string;
  const username = body.username as string;
  const firstName = body.firstName;
  const lastName = body.lastName;
  const age = body.age;
  const gender = body.age;
  const email = body.email as string;
  const phone = body.phone;
  const address = body.address;
  const totalSpent = body.totalSpent;

  const fields = {
    username,
    firstName,
    lastName,
    age,
    gender,
    email,
    phone,
    totalSpent,
    address,
  };
  try {
    const errorMessage = await isEmailUsernameDuplicated({
      _id,
      username,
      email,
    });
    if (errorMessage) {
      res.status(400).json({error: errorMessage});
      return;
    }
    const updatedUser = await User.findByIdAndUpdate(_id, fields, {
      new: false,
    });
    !updatedUser
      ? res
          .status(404)
          .json({ error: "The user you are trying to update doesn't exist" })
      : res.status(201).json(updatedUser);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const addUser: Controller = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ error: errors.array()[0].msg });
    return;
  }
  const body: AddUserBody = req.body;
  const username = body.username;
  const firstName = body.firstName;
  const lastName = body.lastName;
  const age = body.age;
  const password = body.password as string;
  const gender = body.age;
  const email = body.email;
  const phone = body.phone;
  const address = body.address;
  const totalSpent = 0;

  const newUser = new User({
    username,
    firstName,
    lastName,
    password,
    age,
    gender,
    email,
    phone,
    address,
    totalSpent,
  });

  try {
    const errorMessage = await isEmailUsernameDuplicated({ username, email });
    if (errorMessage) {
      res.status(400).json({ error: errorMessage });
      return;
    }
    newUser.password = await bcrypt.hash(password, 12);
    const createdUser = await newUser.save();
    res.status(201).json(createdUser);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const deleteUser: Controller = async (req, res, next) => {
  const body: DeleteUserBody = req.body;
  const userId = body._id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    res.status(200).json(deletedUser);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const validateUser: Controller = async (req, res, next) => {
  const { username, email, _id } = req.query as Record<string, string>;
  if (
    (!username || !isNaN(Number(username))) &&
    (!email || !isNaN(Number(email)))
  ) {
    res
      .status(400)
      .json({ error: "Email and username must be non-empty and non-numeric" });
    return;
  }
  try {
    const users = await isEmailUsernameDuplicated({ _id, email, username });
    res.status(200).json(users);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const queryUser: Controller = async (req, res, next) => {
  const term = String(req.query.term);
  const autoComplete = Boolean(req.query.autoComplete);
  if (!term.trim()) {
    res
      .status(400)
      .json({
        error: "Search term is empty. Please provide a valid search term.",
      });
    return;
  }
  try {
    const fields = Object.values(AllowedSearchFields);
    const data = await getSearchResults({
      model: User,
      fields,
      autoComplete,
      term,
      nextStages: populatePipeline.orders,
    });

    res.status(200).json(data);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getBYUsername: Controller = async (req, res, next) => {
  const username = String(req.query.username);
  if (!username || !isNaN(Number(username))) {
    res
      .status(400)
      .json({
        error: "Search term is empty. Please provide a valid search term.",
      });
    return;
  }
  try {
    const regexPattern = new RegExp(username, "i");
    const data = await User.find({ username: { $regex: regexPattern } });
    res.status(200).json(data);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getMinMax: Controller = async (req, res, next) => {
  try {
    const range = await getMinMaxOfProp({
      collection: User,
      req,
      res,
      allowedMinMaxProps,
    });

    if (!range) {
      return;
    }
    res.status(200).json(range);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getChartData: Controller = async (req, res, next) => {
  try {
    const data = await combineChartData(
      User.aggregate([...chartPipelines.signUp("monthly")]),
      Order.aggregate([...chartPipelines.firstBuy("monthly")])
    );
    res.status(200).json(data);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

export default {
  deleteUser,
  updateUser,
  getUsers,
  addUser,
  getChartData,
  validateUser,
  getMinMax,
  getBYUsername,
  queryUser,
};
