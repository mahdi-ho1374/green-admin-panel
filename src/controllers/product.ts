import Product from "../models/product";
import { Erroro } from "../models/error";
import {
  GetProductsBody,
  AddProductBody,
  UpdateProductBody,
  GetProductsByIdBody,
} from "../types/reqBodyInterfaces";
import { Controller } from "../types/controller";
import { ObjectId,Decimal128 } from "mongodb";
import {
  allowedSortProps,
  allowedMinMaxProps,
  allowedFilterProps,
} from "../types/product";
import getCollectionData from "../helpers/getCollectionData";
import getMinMaxOfProp from "../helpers/getMinMaxOfProp";
import chartPipelines from "../helpers/pipelines/chart/product";
import Order from "../models/order";
import { AllowedSearchFields } from "../types/product";
import getSearchResults from "../helpers/getSearchResults";
import { validationResult } from "express-validator";

const getProducts: Controller = async (req, res, next) => {
  try {
    const { data, lastPage } = await getCollectionData({
      collection: Product,
      req,
      res,
      allowedSortProps,
      allowedFilterProps,
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

const updateProduct: Controller = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({error: errors.array()[0].msg});
    return;
  }
  const body: UpdateProductBody = req.body;
  const _id = body._id;
  const price = Decimal128.fromString(body.price!.toString());
  const quantity = body.quantity;
  const description = body.description;

  const fields = {price, quantity, description};
  try {
    const updatedProduct = await Product.findByIdAndUpdate(_id, fields, {
      new: false,
    });
    updatedProduct
      ? res.status(201).json(updatedProduct)
      : res.status(404).json({error: "The product you are trying to update doesn't exist"});
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const addProduct: Controller = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({error: errors.array()[0].msg});
    return;
  }
  const body: AddProductBody = req.body;
  const name = body.name;
  const price = body.price;
  const quantity = body.quantity;
  const description = body.description;
  const category = body.category;
  const salesNumber = 0;

  const newProduct = new Product({
    name,
    price,
    quantity,
    description,
    salesNumber,
    category
  });
  try {
    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const queryProductName: Controller = async (req, res, next) => {
  const name = req.query.name as string;
  if (!name.trim()) {
    res.status(400).json({error: "Search term is empty. Please provide a valid search term."});
    return;
  }
  try {
    const filteredProducts = await Product.find({
      name: new RegExp(name, 'i') 
    });
    res
      .status(200)
      .json(filteredProducts);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getProductsById: Controller = async (req, res, next) => {
  const body: GetProductsByIdBody = req.body;
  const productIds = body.ids.map((_id) => new ObjectId(_id));
  try {
    const products = await Product.find({ _id: { $in: productIds } }).exec();
    res.status(200).json(products);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getMinMax: Controller = async (req, res, next) => {
  try {
    const range = await getMinMaxOfProp({
      collection: Product,
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
    const data = await Order.aggregate(chartPipelines.category("monthly"));
    res.status(200).json(data);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const queryProduct: Controller = async (req, res, next) => {
  const term = String(req.query.term);
  const autoComplete = Boolean(req.query.autoComplete);
  if (!term.trim()) {
    res.status(400).json({error: "Search term is empty. Please provide a valid search term."});
    return;
  }
  try {
    const fields = Object.values(AllowedSearchFields);
    const data = await getSearchResults({model: Product,fields,autoComplete,term});
    res.status(200).json(data);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

export default {
  updateProduct,
  addProduct,
  queryProduct,
  queryProductName,
  getProducts,
  getProductsById,
  getMinMax,
  getChartData,
};
