import { UpdateOrderBody } from "../../types/reqBodyInterfaces";
import { IOrder } from "../../types/order";
import { Operator } from "../../types/order";
import connection from "../../app";
import Order from "../../models/order";
import { AnyBulkWriteOperation } from "mongodb";
import createBulk from "./createBulk";
import Product from "../../models/product";
import User from "../../models/user";

interface orderSessionProps {
  fields: UpdateOrderBody | IOrder;
  order?: IOrder;
  quantity?: Operator;
  salesNumber?: Operator;
  totalSpent?: Number;
  _id?: string;
  isNew?: boolean;
}

export default async ({
  fields,
  _id,
  order,
  quantity,
  salesNumber,
  totalSpent,
  isNew,
}: orderSessionProps) => {
  const session = await connection.startSession();
  try {
    session.startTransaction();
    let createdOrder;
    if (!isNew) {
      createdOrder = await Order.findByIdAndUpdate(_id, fields, {
        session,
        new: true,
      });
    }
    if (isNew) {
      createdOrder = await (fields as IOrder).save({ session });
    }

    let productUpdates: AnyBulkWriteOperation[] | null = null;
    if (order) {
      const productUpdates1 = createBulk({
        order,
        quantity,
        salesNumber,
        reverse: true,
      });
      const productUpdates2 = createBulk({
        order: fields,
        quantity,
        salesNumber,
      });
      productUpdates = [...productUpdates1, ...productUpdates2];
    }
    if (!order) {
      productUpdates = createBulk({
        order: fields,
        quantity,
        salesNumber,
      });
    }
    await Product.bulkWrite(
      productUpdates as unknown as AnyBulkWriteOperation[],
      { ordered: false, session }
    );
    if (totalSpent || isNew) {
      const updateQuery: Record<string, any> = {};
      if (totalSpent) {
        updateQuery.$inc = { totalSpent };
      }
      if (isNew) {
        updateQuery.$push = { orders: createdOrder!._id };
      }
      await User.findByIdAndUpdate(createdOrder!.userId, updateQuery, {
        session,
      });
    }
    await session.commitTransaction();
    session.endSession();
    return createdOrder;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
