"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (orderItems) => {
    const items = [];
    orderItems.forEach(orderItem => {
        const nonDuplicatedItem = items.find(item => item._id === orderItem._id);
        if (nonDuplicatedItem) {
            nonDuplicatedItem.amount += orderItem.amount;
        }
        else {
            items.push(orderItem);
        }
    });
    return items;
};
