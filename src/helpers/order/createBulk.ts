import { IOrder } from "../../types/order";
import { UpdateOrderBody } from "../../types/reqBodyInterfaces";
import { Operator } from "../../types/order";
import { AnyBulkWriteOperation } from "mongodb";

export default ({
  order,
  quantity,
  salesNumber,
  reverse,
}: {
  order: IOrder | UpdateOrderBody;
  quantity?: Operator;
  salesNumber?: Operator;
  reverse?: boolean;
}): AnyBulkWriteOperation[] => {
  const Bulk = order.items!.map(
    (item: any) =>
      ({
        updateOne: {
          filter: { _id: item._id },
          update: {$inc: {}},
        },
      } as AnyBulkWriteOperation)
  );
  if (quantity) {
    Bulk.forEach((operate: any, index: number) => {
      operate.updateOne.update.$inc["quantity"] = reverse
          ? order.items![index].amount
          : -order.items![index].amount;
    });
  }
  if (salesNumber) {
    Bulk.forEach((operate: any, index: number) => {
      operate.updateOne.update.$inc["salesNumber"] = 
        reverse
          ? -order.items![index].amount
          : order.items![index].amount;
    });
  }
  return Bulk;
};
