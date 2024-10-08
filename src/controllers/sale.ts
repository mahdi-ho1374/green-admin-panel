import { Erroro } from "../models/error";
import { Controller } from "../types/controller";
import chartPipelines from "../helpers/pipelines/chart/sale";
import Order from "../models/order";
import combineChartData from "../helpers/pipelines/chart/combineChartData";
import { Status } from "../types/order";

const getMostSoldProducts: Controller = async (req, res, next) => {
  try {
    const aggregatedMostSoldProducts = await Order.aggregate([
      {
        $match: {
          status: { $ne: Status.CANCELED },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            itemId: "$items._id",
            itemName: "$items.name",
          },
          totalSalesPerProduct: { $sum: "$items.amount" },
          totalRevenuePerProduct: {
            $sum: { $multiply: ["$items.amount", "$items.price"] },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $facet: {
          amount: [
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1,
                totalSalesPerProduct: -1,
              },
            },
            {
              $group: {
                _id: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
                amount: {
                  $first: {
                    _id: "$_id.itemId",
                    name: "$_id.itemName",
                    amount: "$totalSalesPerProduct",
                    revenue: "$totalRevenuePerProduct",
                  },
                },
              },
            },
          ],
          revenue: [
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1,
                totalRevenuePerProduct: -1,
              },
            },
            {
              $group: {
                _id: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
                revenue: {
                  $first: {
                    _id: "$_id.itemId",
                    name: "$_id.itemName",
                    amount: "$totalSalesPerProduct",
                    revenue: "$totalRevenuePerProduct",
                  },
                },
              },
            },
          ],
        },
      },
    ]);
    const mostSoldProducts = aggregatedMostSoldProducts[0].revenue.map((item: any,index: number) => ({
      ...item,month: item._id.month,year: item._id.year,...aggregatedMostSoldProducts[0].amount[index]
    }));
    res.status(200).json(mostSoldProducts);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getTopBuyers: Controller = async (req, res, next) => {
  try {
    let aggregatedTopBuyers = await Order.aggregate([
      {
        $match: {
          status: { $ne: Status.CANCELED },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            userId: "$userId",
          },
          totalSalesPerUser: { $sum: "$items.amount" },
          totalRevenuePerUser: {$sum: { $multiply: ["$items.amount","$items.price"]} },
        },
      },
      
      {$lookup: {
        from: "users",
        localField: "_id.userId",
        foreignField: "_id",
        as: "user"
      }},
      {$unwind: "$user"},
      {$addFields: {
        "_id.username": "$user.username"
      }},
      {$project: {user: 0}},
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $facet: {
          amount: [
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1,
                totalSalesPerUser: -1,
              },
            },
            {
              $group: {
                _id: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
                amount: {
                  $first: {
                    _id: "$_id.userId",
                    username: "$_id.username",
                    amount: "$totalSalesPerUser",
                    revenue: "$totalRevenuePerUser",
                  },
                },
              },
            },
          ],
          revenue: [
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1,
                totalRevenuePerUser: -1,
              },
            },
            {
              $group: {
                _id: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
                revenue: {
                  $first: {
                    _id: "$_id.userId",
                    username: "$_id.username",
                    amount: "$totalSalesPerUser",
                    revenue: "$totalRevenuePerUser",
                  },
                },
              },
            },
          ],
        },
      },
    ]);
    const topBuyers = aggregatedTopBuyers[0].revenue.map((item: any,index: number) => ({
      ...item,month: item._id.month,year: item._id.year,...aggregatedTopBuyers[0].amount[index]
    }));
    res.status(200).json(topBuyers);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getChartData: Controller = async (req, res, next) => {
  try {
    const data = await combineChartData(
      Order.aggregate([...chartPipelines.revenue("monthly")]),
      Order.aggregate([...chartPipelines.amount("monthly")])
    );
    res.status(200).json(data);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

export default {getChartData ,getTopBuyers, getMostSoldProducts };
