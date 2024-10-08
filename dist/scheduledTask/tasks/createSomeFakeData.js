"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const user_1 = __importDefault(require("../../models/user"));
const order_1 = __importDefault(require("../../models/order"));
const comment_1 = __importDefault(require("../../models/comment"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const product_1 = __importDefault(require("../../models/product"));
const order_2 = require("../../types/order");
const createSession_1 = __importDefault(require("../../helpers/order/createSession"));
const order_3 = require("../../types/order");
const createSomeFakeData = async () => {
    try {
        for (let i = 0; i < faker_1.faker.number.int({ min: 0, max: 3 }); i++) {
            let username = faker_1.faker.internet.userName();
            const password = faker_1.faker.internet.password();
            const firstName = faker_1.faker.person.firstName();
            const lastName = faker_1.faker.person.lastName();
            const age = faker_1.faker.number.int({ min: 18, max: 68 });
            const gender = faker_1.faker.person.gender();
            let email = faker_1.faker.internet.email();
            const phone = faker_1.faker.phone.number();
            const address = faker_1.faker.location.streetAddress({
                useFullAddress: true,
            });
            const totalSpent = 0;
            const orders = [];
            const isDuplicatedUser = async (email, username) => {
                return await user_1.default.findOne({
                    $or: [{ email }, { username }],
                }).collation({ locale: "en", strength: 2 });
            };
            do {
                username = faker_1.faker.internet.userName();
                email = faker_1.faker.internet.email();
            } while (await isDuplicatedUser(email, username));
            const newUser = new user_1.default({
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
            newUser.password = await bcryptjs_1.default.hash(password, 12);
            await newUser.save();
        }
        for (let i = 0; i < faker_1.faker.number.int({ min: 0, max: 4 }); i++) {
            const productsCount = faker_1.faker.number.int({ min: 1, max: 5 });
            faker_1.faker.number.int;
            const randomProducts = await product_1.default.aggregate([
                { $sample: { size: productsCount } },
            ]);
            const randomUsersPipeLine = [
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
            const randomUsers = await user_1.default.aggregate([...randomUsersPipeLine]);
            const userId = randomUsers[0]._id;
            const randomAmount = faker_1.faker.number.int({ min: 1, max: 3 });
            const items = randomProducts.map((product) => {
                return {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    amount: randomAmount,
                };
            });
            const statuses = [
                { status: order_2.Status.DELIVERED, weight: 10 },
                { status: order_2.Status.PENDING, weight: 5 },
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
            const totalPrice = items.reduce((totalPrice, item) => totalPrice + item.amount * item.price, 0);
            const newOrder = new order_1.default({
                userId,
                items,
                totalPrice,
                status,
            });
            const createdOrder = await (0, createSession_1.default)({
                fields: newOrder,
                isNew: true,
                salesNumber: order_3.Operator.INC,
                quantity: order_3.Operator.DEC,
                totalSpent: totalPrice,
            });
        }
        for (let i = 0; i < faker_1.faker.number.int({ min: 0, max: 1 }); i++) {
            const randomUsers = await user_1.default.aggregate([{ $sample: { size: 1 } }]);
            const userId = randomUsers[0]._id;
            const text = faker_1.faker.lorem.sentence();
            const approved = Math.random() > 0.5 ? true : false;
            const replied = Math.random() > 0.5 ? true : false;
            const seen = [approved, replied].includes(true) ? true : false;
            const repliedText = replied === true ? faker_1.faker.lorem.sentence() : "";
            const newComment = new comment_1.default({
                userId,
                text,
                seen,
                approved,
                replied,
                repliedText,
            });
            const createdComment = await newComment.save();
        }
    }
    catch (err) { }
};
exports.default = createSomeFakeData;
