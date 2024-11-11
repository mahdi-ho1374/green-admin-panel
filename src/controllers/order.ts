import { Decimal128 } from "mongodb";
import mongoose, { ClientSession, } from "mongoose";
import type { Controller } from "../types/controller";
import Order from "../models/order";
import {
  Status,
  type TransformedOrder,
  Operator,
  ProductItem,
} from "../types/order";
import { Erroro } from "../models/error";
import type { AddOrderBody, UpdateOrderBody } from "../types/reqBodyInterfaces";
import User from "../models/user";
import createSession from "../helpers/order/createSession";
import getCollectionData from "../helpers/getCollectionData";
import {
  allowedSortProps,
  allowedMinMaxProps,
  allowedFilterProps,
} from "../types/order";
import getMinMaxOfProp from "../helpers/getMinMaxOfProp";
import chartPipelines from "../helpers/pipelines/chart/order";
import { AllowedSearchFields as UserAllowedSearchFields } from "../types/user";
import { AllowedSearchFields as ProductAllowedSearchFields } from "../types/product";
import getSearchResults from "../helpers/getSearchResults";
import Product from "../models/product";
import { ObjectId } from "mongodb";
import checkProductAvailability from "../helpers/order/checkProductAvailability";
import { validationResult } from "express-validator";
import mergeDuplicatedItems from "../helpers/order/mergeDuplicatedItems";

const getOrders: Controller = async (req, res, next) => {
  try {
    const { data, lastPage } = await getCollectionData({
      collection: Order,
      res,
      req,
      allowedSortProps,
      allowedFilterProps,
      populate: "userId",
    });
    if (!data && !lastPage) {
      return;
    }
    const transformedOrders: TransformedOrder[] = data.map(
      (order: Record<string, any>) => {
        const { userId, ...rest } = order;
        return {
          user: userId,
          ...rest,
        } as TransformedOrder;
      }
    );
    res.status(200).json({ data: transformedOrders, lastPage });
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const updateOrder: Controller = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ error: errors.array()[0].msg });
    return;
  }
  const body: UpdateOrderBody = req.body;
  const _id = body._id as string;
  const items = mergeDuplicatedItems(body.items as ProductItem[]);
  const status = body.status as Status;
  try {
    const order = await Order.findById(_id);
    if (!order) {
      res
        .status(404)
        .json({ error: "The order you are trying to update doesn't exist" });
      return;
    }
    
    const correspondingItems = await checkProductAvailability({
      items,
      res,
      previousItems: order.items,
    });
    
    const isNullItemThere = correspondingItems.find((item) => item === null);
    if (isNullItemThere) {
      return;
    }
    
    const totalPrice = parseFloat(correspondingItems!.reduce(
      (totalPrice, item) => totalPrice + item!.amount * (item!.price as number),
      0
    ).toFixed(2));
    const fields = {
      items: correspondingItems as ProductItem[],
      totalPrice,
      status,
    };
    let isItemsChanged = items!.length !== order.items.length;
    if (!isItemsChanged) {
      const array1 = items!
        .sort((a, b) => a._id.toString().localeCompare(b._id.toString()))
        .reduce((array1: any, item) => [...array1, item.amount, item._id], []);
      const array2 = order.items
        .sort((a, b) => a._id.toString().localeCompare(b._id.toString()))
        .reduce((array1: any, item) => [...array1, item.amount, item._id], []);
      isItemsChanged = false;
      for (let i = 0; i < array1.length; i++) {
        isItemsChanged = array1[i] === array2[i] ? isItemsChanged : true;
      }
    }

    if (
      [Status.DELIVERED, Status.PENDING].includes(status) &&
      order.status === Status.PENDING
    ) {
      const updatedOrder = !isItemsChanged
        ? await createSession({
            fields,
            _id,
          })
        : await createSession({
            fields,
            order,
            salesNumber: Operator.INC,
            _id,
            quantity: Operator.DEC,
            totalSpent: parseFloat((totalPrice - parseFloat(order.totalPrice.toString())).toFixed(2)),
          });
      res.status(201).json(updatedOrder);
      return;
    }
    if (
      order.status !== Status.CANCELED &&
      status === Status.CANCELED &&
      !isItemsChanged
    ) {
      const updatedOrder = await createSession({
        fields,
        salesNumber: Operator.DEC,
        _id,
        quantity: Operator.INC,
        totalSpent: -parseFloat(order.totalPrice.toString()),
      });
      res.status(201).json(updatedOrder);
      return;
    }
    if (
      order.status === Status.DELIVERED &&
      [Status.DELIVERED, Status.PENDING].includes(status)
    ) {
      res
        .status(400)
        .json({
          error:
            "You can not change an already delivered order to pending order or delivered order.",
        });
      return;
    }
    if (order.status === Status.CANCELED) {
      res
        .status(400)
        .json({ error: "You can not change an already canceled order." });
      return;
    }
    if (
      order.status !== Status.CANCELED &&
      status === Status.CANCELED &&
      isItemsChanged
    ) {
      res
        .status(400)
        .json({
          error:
            "You can just cancel an order. You can not change items and cancel at same time.",
        });
      return;
    }
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const addOrder: Controller = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ error: errors.array()[0].msg });
    return;
  }
  const body: AddOrderBody = req.body;
  const userId = body.userId;
  const items = mergeDuplicatedItems(body.items);
  const status = body.status;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res
        .status(404)
        .json({
          error:
            "User not found. Please ensure that the specified user exists.",
        });
      return;
    }
    const correspondingItems = await checkProductAvailability({ items, res });
    const isNullItemThere = correspondingItems.some((item) => item === null);
    if (isNullItemThere) {
      return;
    }
    const totalPrice = parseFloat(correspondingItems!.reduce(
      (totalPrice, item) => totalPrice + item!.amount * (item!.price as number),
      0
    ).toFixed(2));
    const newOrder = new Order({
      userId,
      items: correspondingItems,
      totalPrice,
      status,
    });
    const createdOrder = createSession({
      fields: newOrder,
      isNew: true,
      salesNumber: Operator.INC,
      quantity: Operator.DEC,
      totalSpent: totalPrice,
    });
    res.status(201).json(createdOrder);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const queryOrders: Controller = async (req, res, next) => {
  const term = String(req.query.term);
  const autoComplete = Boolean(req.query.autoComplete);
  if (!term) {
    res
      .status(400)
      .json({
        error: "Search term is empty. Please provide a valid search term.",
      });
    return;
  }
  try {
    const productFields = Object.values(ProductAllowedSearchFields);
    const userFields = Object.values(UserAllowedSearchFields);
    const productsData = await getSearchResults({
      model: Product,
      fields: productFields,
      autoComplete,
      term,
    });
    const usersData = await getSearchResults({
      model: User,
      fields: userFields,
      autoComplete,
      term,
    });

    if (autoComplete) {
      res.status(200).json([...usersData, ...productsData]);
      return;
    }
    const usersIds = usersData.map((user) => new ObjectId(user._id));
    const productsIds: ObjectId[] = productsData.map(
      (product) => new ObjectId(product._id)
    );
    const ordersData1 = await Order.find({ userId: { $in: usersIds } })
      .populate("userId")
      .lean();
    const ordersData2 = await Order.find({
      items: {
        $elemMatch: {
          _id: {
            $in: productsIds,
          },
        },
      },
    })
      .populate("userId")
      .lean();

    const duplicatedOrderData = [...ordersData1, ...ordersData2];
    const seenIds = new Set();
    const data = duplicatedOrderData.reduce((result, order) => {
      const id = order._id.toString();
      if (!seenIds.has(id)) {
        seenIds.add(id);
        return [...result, order];
      }
      return result;
    }, [] as any[]);
    const transformedData = data.map((order) => {
      const { userId, ...rest } = order;
      return {
        user: userId,
        ...rest,
      } as TransformedOrder;
    });
    res.status(200).json(transformedData);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getMinMax: Controller = async (req, res, next) => {
  try {
    const range = await getMinMaxOfProp({
      collection: Order,
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
    const data = await Order.aggregate([
      ...chartPipelines.createdAt("monthly"),
    ]);
    res.status(200).json(data);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

export default {
  updateOrder,
  addOrder,
  getOrders,
  getMinMax,
  getChartData,
  queryOrders,
};
