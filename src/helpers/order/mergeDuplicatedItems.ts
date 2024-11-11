import { ProductItem } from "../../types/order";

export default (orderItems: ProductItem[]) => {
    const items: ProductItem[] = [];
    orderItems.forEach(orderItem => {
        const nonDuplicatedItem = items.find(item => item._id === orderItem._id);
        if(nonDuplicatedItem) {
            nonDuplicatedItem.amount += orderItem.amount
        }
        else {
            items.push(orderItem)
        }
    });
    return items;
}