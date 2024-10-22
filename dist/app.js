"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const createSomeFakeData_1 = __importDefault(require("./scheduledTasks/createSomeFakeData"));
const updateLowStockProducts_1 = __importDefault(require("./scheduledTasks/updateLowStockProducts"));
if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv");
    dotenv.config();
}
const app = (0, express_1.default)();
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [process.env.FRONTEND_URL, "https://github.com"];
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.get("/admin/run-scheduled-task", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token || token !== process.env.SECRET_TOKEN) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }
        yield (0, createSomeFakeData_1.default)();
        yield (0, updateLowStockProducts_1.default)();
        res.status(200).json({ message: "Scheduled task executed successfully" });
    }
    catch (err) {
        return next(err);
    }
}));
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
    app.listen(process.env.PORT || 8080);
})
    .catch((error) => { });
exports.default = mongoose_1.default.connection;
