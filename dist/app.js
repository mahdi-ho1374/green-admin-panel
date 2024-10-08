"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const product_1 = __importDefault(require("./routes/product"));
const user_1 = __importDefault(require("./routes/user"));
const order_1 = __importDefault(require("./routes/order"));
const sale_1 = __importDefault(require("./routes/sale"));
const comment_1 = __importDefault(require("./routes/comment"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const helmet_1 = __importDefault(require("helmet"));
const runScheduledTask_1 = __importDefault(require("./scheduledTask/runScheduledTask"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((req, res, next) => {
    (0, runScheduledTask_1.default)();
    next();
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use("/admin", product_1.default);
app.use("/admin", user_1.default);
app.use("/admin", order_1.default);
app.use("/admin", sale_1.default);
app.use("/admin", comment_1.default);
app.use("/admin", dashboard_1.default);
app.use((err, req, res, next) => {
    res.status(err.httpStatusCode || 500).json({ error: err.message });
});
mongoose_1.default
    .connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@admin-panel.czwa6yt.mongodb.net/${process.env.MONGO_DATABASE}`)
    .then((result) => {
    app.listen(process.env.PORT || 3000);
})
    .catch((error) => { });
exports.default = mongoose_1.default.connection;
