"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ order, quantity, salesNumber, reverse, }) => {
    const Bulk = order.items.map((item) => ({
        updateOne: {
            filter: { _id: item._id },
            update: { $inc: {} },
        },
    }));
    if (quantity) {
        Bulk.forEach((operate, index) => {
            operate.updateOne.update.$inc["quantity"] = reverse
                ? order.items[index].amount
                : -order.items[index].amount;
        });
    }
    if (salesNumber) {
        Bulk.forEach((operate, index) => {
            operate.updateOne.update.$inc["salesNumber"] =
                reverse
                    ? -order.items[index].amount
                    : order.items[index].amount;
        });
    }
    return Bulk;
};
