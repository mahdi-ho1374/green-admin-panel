import { faker } from "@faker-js/faker";
import mongoose, { ObjectId } from "mongoose";
import User from "../models/user";
import Order from "../models/order";
import Comment from "../models/comment";
import bcrypt from "bcryptjs";
import { IUser } from "../types/user";
import Product from "../models/product";
import { Status } from "../types/order";
import createSession from "../helpers/order/createSession";
import { Operator } from "../types/order";
import { Z_ERRNO } from "zlib";

const createSomeFakeData = async () => {
  try {
    for (let i = 0; i < faker.number.int({ min: 0, max: 3 }); i++) {
      let username = faker.internet.userName();
      const password = faker.internet.password();
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const age = faker.number.int({ min: 18, max: 68 });
      const gender = faker.person.gender();
      let email = faker.internet.email();
      const phone = faker.phone.number();
      const address = faker.location.streetAddress({
        useFullAddress: true,
      });
      const totalSpent = 0;
      const orders: ObjectId[] = [];
      const isDuplicatedUser = async (email: string, username: string) => {
        return await User.findOne({
          $or: [{ email }, { username }],
        }).collation({ locale: "en", strength: 2 });
      };

      do {
        username = faker.internet.userName();
        email = faker.internet.email();
      } while (await isDuplicatedUser(email, username));
      const newUser: IUser = new User({
        username,
        password,
        firstName,
        lastName,
        age,
        gender,
        email,
        phone,
        address,
        orders,
        totalSpent,
      });
      newUser.password = await bcrypt.hash(password, 12);
      await newUser.save();
    }

    for (let i = 0; i < faker.number.int({ min: 0, max: 4 }); i++) {
      const productsCount = faker.number.int({ min: 1, max: 5 });
      faker.number.int;
      const randomProducts = await Product.aggregate([
        { $sample: { size: productsCount } },
      ]);
      const randomUsersPipeLine: any[] = [
        {
          $sample: { size: 1 },
        },
      ];
      if (Math.random() < 0.37) {
        randomUsersPipeLine.unshift({
          $match: {
            orders: { $size: 0 },
          },
        });
      }
      const randomUsers = await User.aggregate([...randomUsersPipeLine]);
      const userId = randomUsers[0]._id;
      const randomAmount = faker.number.int({ min: 1, max: 3 });
      const items = randomProducts.map((product: any) => {
        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          amount: randomAmount,
        };
      });
      const statuses = [
        { status: Status.DELIVERED, weight: 10 },
        { status: Status.PENDING, weight: 5 },
      ];
      const totalWeight = statuses.reduce((acc, { weight }) => acc + weight, 0);

      let randomValue = Math.floor(Math.random() * totalWeight);
      let status = null;
      for (const { status: statusValue, weight } of statuses) {
        if (randomValue < weight) {
          status = statusValue;
          break;
        }
        randomValue -= weight;
      }

      const totalPrice = items!.reduce(
        (totalPrice, item) => totalPrice + item.amount * (item.price as number),
        0
      );
      const newOrder = new Order({
        userId,
        items,
        totalPrice,
        status,
      });
      const createdOrder = await createSession({
        fields: newOrder,
        isNew: true,
        salesNumber: Operator.INC,
        quantity: Operator.DEC,
        totalSpent: totalPrice,
      });
    }

    for (let i = 0; i < faker.number.int({ min: 0, max: 1 }); i++) {
      const randomUsers = await User.aggregate([{ $sample: { size: 1 } }]);
      const userId = randomUsers[0]._id;
      const text = faker.lorem.sentence();
      const approved = Math.random() > 0.5 ? true : false;
      const replied = Math.random() > 0.5 ? true : false;
      const seen = [approved, replied].includes(true) ? true : false;

      const repliedText = replied === true ? faker.lorem.sentence() : "";
      const newComment = new Comment({
        userId,
        text,
        seen,
        approved,
        replied,
        repliedText,
      });
      const createdComment = await newComment.save();
    }
  } catch (err: any) {
    throw err;
  }
};

export default createSomeFakeData;
