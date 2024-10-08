"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../app"));
// import connection from "../../initial/createData";
const order_1 = __importDefault(require("../../models/order"));
const createBulk_1 = __importDefault(require("./createBulk"));
const product_1 = __importDefault(require("../../models/product"));
const user_1 = __importDefault(require("../../models/user"));
exports.default = async ({ fields, _id, order, quantity, salesNumber, totalSpent, isNew, }) => {
    const session = await app_1.default.startSession();
    try {
        session.startTransaction();
        let createdOrder;
        if (!isNew) {
            createdOrder = await order_1.default.findByIdAndUpdate(_id, fields, {
                session,
                new: true,
            });
        }
        if (isNew) {
            createdOrder = await fields.save({ session });
        }
        let productUpdates = null;
        if (order) {
            const productUpdates1 = (0, createBulk_1.default)({
                order,
                quantity,
                salesNumber,
                reverse: true,
            });
            const productUpdates2 = (0, createBulk_1.default)({
                order: fields,
                quantity,
                salesNumber,
            });
            productUpdates = [...productUpdates1, ...productUpdates2];
        }
        if (!order) {
            productUpdates = (0, createBulk_1.default)({
                order: fields,
                quantity,
                salesNumber,
            });
        }
        await product_1.default.bulkWrite(productUpdates, { ordered: false, session });
        if (totalSpent || isNew) {
            const updateQuery = {};
            if (totalSpent) {
                updateQuery.$inc = { totalSpent };
            }
            if (isNew) {
                updateQuery.$push = { orders: createdOrder._id };
            }
            await user_1.default.findByIdAndUpdate(createdOrder.userId, updateQuery, {
                session,
            });
        }
        await session.commitTransaction();
        session.endSession();
        return createdOrder;
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};
