import Product from "../../models/product";
import type { IProduct } from "../../types/product";
import type { ProductItem } from "../../types/order";
import { Response } from "express";

export interface CheckProductAvailabilityProps {
    items: ProductItem[];
    res: Response;
    previousItems?: ProductItem[];
}

export default async ({items,res,previousItems}: CheckProductAvailabilityProps) => {
    const itemsIds = [...new Set(items.map(item => item._id))];
    const products = await Product.find({_id: {$in: itemsIds}}) as unknown as IProduct[];
    const correspondingItems = items.map(item => {
      const correspondingProduct = products.find(product => product!._id!.toString() === item._id.toString());
      const previousProduct = previousItems ? previousItems.find(product => product._id.toString() === item._id.toString()) || {amount: 0} : {amount: 0};
      if(!correspondingProduct) {
        res.status(404).send("One of products not found.Make sure the product exist in our shop.");
        return null;
      }
      if(correspondingProduct.quantity+previousProduct!.amount < item.amount) {
        res.status(422).send(`Insufficient quantity for ${correspondingProduct.name}`);
        return null;
      }
      const {price,name} = correspondingProduct;
      return {...item,price,name};
    });
    return correspondingItems;
}

