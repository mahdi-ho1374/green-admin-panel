import { Controller } from "../types/controller";
import User from "../models/user";
import Order from "../models/order";
import Comment from "../models/comment";
import Product from "../models/product";
import { Erroro } from "../models/error";
import { Status } from "../types/order";
import firstBuy from "../helpers/pipelines/user/firstBuy";
import userChartPipelines from "../helpers/pipelines/chart/user";
import commentChartPipelines from "../helpers/pipelines/chart/comment";
import saleChartPipelines from "../helpers/pipelines/chart/sale";
import orderChartPipelines from "../helpers/pipelines/chart/order";
import productChartPipelines from "../helpers/pipelines/chart/product";
import getDateRangeMatchPipeline from "../helpers/pipelines/getDateRangeMatchPipeline";
import combineChartData from "../helpers/pipelines/chart/combineChartData";

const getTotals: Controller = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ orders: { $ne: [] } });
    const totalProducts = await Product.countDocuments();
    const totalComments = await Comment.countDocuments();
    const userToCustomerRate = `${((totalCustomers / totalUsers) * 100).toFixed(
      2
    )}%`;
    const getMatchPipeline = () =>
      [{ $match: { status: { $ne: Status.CANCELED } } }] as any[];
    const getGroupPipeline = (propName: string, field: string) => [
      { $group: { _id: null, [propName]: { $sum: `$${field}` } } },
    ];
    const aggregatedTotalRevenue = await Order.aggregate([
      ...getMatchPipeline(),
      ...getGroupPipeline("totalRevenue", "totalPrice"),
    ]);
    const aggregatedTotalAmounts = await Order.aggregate([
      ...getMatchPipeline(),
      { $unwind: "$items" },
      ...getGroupPipeline("totalAmounts", "items.amount"),
    ]);

    const totalAmounts = aggregatedTotalAmounts[0].totalAmounts;
    const totalRevenue = aggregatedTotalRevenue[0].totalRevenue;
    res.status(200).json({
      totalRevenue,
      totalProducts,
      totalOrders,
      totalUsers,
      totalAmounts,
      totalComments,
      totalCustomers,
      userToCustomerRate,
    });
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getLast30DaysData: Controller = async (req, res, next) => {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  const sixtyDaysAgo = new Date();
  const thirtyOneDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 29);
  thirtyOneDaysAgo.setDate(now.getDate() - 30);
  sixtyDaysAgo.setDate(now.getDate() - 59);
  const getMatchPipeline = (previous?: boolean) =>
    getDateRangeMatchPipeline(
      previous ? sixtyDaysAgo : thirtyDaysAgo,
      previous ? thirtyOneDaysAgo : new Date()
    );

  const getCountPipeline = () => [{ $count: "count" }];
  const getSumPipeline = (field: string) => [
    { $group: { _id: null, total: { $sum: `$${field}` } } },
    {
      $project: {
        _id: 0,
        total: 1,
      },
    },
  ];
  const getMatchCustomerPipeline = () => [...firstBuy];
  try {
    const current30DaysUsers = await User.aggregate([
      ...getMatchPipeline(),
      ...getCountPipeline(),
    ]);
    const previous30DaysUsers = await User.aggregate([
      ...getMatchPipeline(true),
      ...getCountPipeline(),
    ]);
    const current30DaysOrders = await Order.aggregate([
      ...getMatchPipeline(),
      ...getCountPipeline(),
    ]);
    const previous30DaysOrders = await Order.aggregate([
      ...getMatchPipeline(true),
      ...getCountPipeline(),
    ]);
    const current30DaysComments = await Comment.aggregate([
      ...getMatchPipeline(),
      ...getCountPipeline(),
    ]);
    const previous30DaysComments = await Comment.aggregate([
      ...getMatchPipeline(true),
      ...getCountPipeline(),
    ]);

    const current30DaysRevenue = await Order.aggregate([
      ...getMatchPipeline(),
      { $match: { status: { $ne: Status.CANCELED } } },
      ...getSumPipeline("totalPrice"),
    ]);
    const previous30DaysRevenue = await Order.aggregate([
      ...getMatchPipeline(true),
      { $match: { status: { $ne: Status.CANCELED } } },
      ...getSumPipeline("totalPrice"),
    ]);
    const current30DaysAmount = await Order.aggregate([
      ...getMatchPipeline(),
      { $match: { status: { $ne: Status.CANCELED } } },
      { $unwind: "$items" },
      ...getSumPipeline("items.amount"),
    ]);
    const previous30DaysAmount = await Order.aggregate([
      ...getMatchPipeline(true),
      { $match: { status: { $ne: Status.CANCELED } } },
      { $unwind: "$items" },
      ...getSumPipeline("items.amount"),
    ]);
    const current30DaysCustomers = await Order.aggregate([
      ...getMatchPipeline(),
      ...getMatchCustomerPipeline(),
      ...getCountPipeline(),
    ]);
    const previous30DaysCustomers = await Order.aggregate([
      ...getMatchPipeline(true),
      ...getMatchCustomerPipeline(),
      ...getCountPipeline(),
    ]);

    res.status(200).json({
      last30DaysUsers: [
        previous30DaysUsers[0]["count"],
        current30DaysUsers[0]["count"],
      ],
      last30DaysCustomers: [
        previous30DaysCustomers[0]["count"],
        current30DaysCustomers[0]["count"],
      ],
      last30DaysOrders: [
        previous30DaysOrders[0]["count"],
        current30DaysOrders[0]["count"],
      ],
      last30DaysComments: [
        previous30DaysComments[0]["count"],
        current30DaysComments[0]["count"],
      ],
      last30DaysRevenue: [
        previous30DaysRevenue[0]["total"],
        current30DaysRevenue[0]["total"],
      ],
      last30DaysAmounts: [
        previous30DaysAmount[0]["total"],
        current30DaysAmount[0]["total"],
      ],
    });
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

const getChartData: Controller = async (req, res, next) => {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 29);

  try {
    const dateMatchPipeline = () =>
      getDateRangeMatchPipeline(thirtyDaysAgo, now);
    const users = await combineChartData(
      User.aggregate([
        ...dateMatchPipeline(),
        ...userChartPipelines.signUp("daily"),
      ]),
      Order.aggregate([
        ...dateMatchPipeline(),
        ...userChartPipelines.firstBuy("daily"),
      ])
    );

    const comments = await Comment.aggregate([
      ...dateMatchPipeline(),
      ...commentChartPipelines.createdAt("daily"),
    ]);
    const orders = await Order.aggregate([
      ...dateMatchPipeline(),
      ...orderChartPipelines.createdAt("daily"),
    ]);
    const sales = await combineChartData(
      Order.aggregate([
        ...dateMatchPipeline(),
        ...saleChartPipelines.revenue("daily"),
      ]),
      Order.aggregate([
        ...dateMatchPipeline(),
        ...saleChartPipelines.amount("daily"),
      ])
    );
    const categories = await Order.aggregate([
      ...dateMatchPipeline(),
      ...productChartPipelines.category("daily"),
    ]);
    const chartsData = { users, comments, orders, sales, categories };
    let dates: any[] = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(thirtyDaysAgo.getDate() + i);
      dates.push({
        day: date.getDate(),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      });
    }
    const filledGapChartsData = Object.entries(chartsData).reduce(
      (result, [entry, data]) => {
        if (entry === "categories") {
          delete data[0].month;
          delete data[0].year;
          result[entry] = data;
          return result;
        }
        const props = data.reduce((props: string[], item: any) => {
          const { _id, day, ...restProps } = item;
          return [...new Set([...props, ...Object.keys(restProps)])];
        }, []);

        result[entry as keyof typeof result] = dates.map((date) => {
          const existingChartItem = (data as any[]).find(
            (item: any) =>
              item._id.month === date.month &&
              item._id.day === date.day &&
              item._id.year === date.year
          );
          if (!existingChartItem) {
            const chartItem: Record<string, any> = { _id: date, day: date.day };
            props.forEach((prop: string) => {
              chartItem[prop] = 0;
            });
            return chartItem;
          } else {
            props.forEach((prop: string) => {
              if (!(prop in existingChartItem)) {
                existingChartItem[prop] = 0;
              }
            });
            return existingChartItem;
          }
        });
        return result;
      },
      {} as Record<string, any[]>
    );
    res.status(200).json(filledGapChartsData);
  } catch (err: any) {
    const error = new Erroro(err, 500);
    return next(error);
  }
};

export default { getTotals, getLast30DaysData, getChartData };
