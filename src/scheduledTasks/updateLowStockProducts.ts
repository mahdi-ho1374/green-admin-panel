import Product from "../models/product";

export default async () => {
  try {
    const lowStockProducts = await Product.find({ quantity: { $lt: 10 } });

    if (lowStockProducts.length === 0) {
      return;
    }

    for (const product of lowStockProducts) {
      const randomIncrease = Math.floor(Math.random() * 51) + 50;
      product.quantity += randomIncrease;
      await product.save();
    }
  } catch (error) {
    throw error;
  }
};
