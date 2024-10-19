"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.default = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fields, _id, order, quantity, salesNumber, totalSpent, isNew, }) {
    const session = yield app_1.default.startSession();
    try {
        session.startTransaction();
        let createdOrder;
        if (!isNew) {
            createdOrder = yield order_1.default.findByIdAndUpdate(_id, fields, {
                session,
                new: true,
            });
        }
        if (isNew) {
            createdOrder = yield fields.save({ session });
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
        yield product_1.default.bulkWrite(productUpdates, { ordered: false, session });
        if (totalSpent || isNew) {
            const updateQuery = {};
            if (totalSpent) {
                updateQuery.$inc = { totalSpent };
            }
            if (isNew) {
                updateQuery.$push = { orders: createdOrder._id };
            }
            yield user_1.default.findByIdAndUpdate(createdOrder.userId, updateQuery, {
                session,
            });
        }
        yield session.commitTransaction();
        session.endSession();
        return createdOrder;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
