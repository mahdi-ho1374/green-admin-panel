import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import productRouter from "./routes/product";
import userRouter from "./routes/user";
import orderRouter from "./routes/order";
import saleRouter from "./routes/sale";
import commentRouter from "./routes/comment";
import dashboardRouter from "./routes/dashboard";
import { Erroro } from "./models/error";
import helmet from "helmet";
import createSomeFakeData from "./scheduledTasks/createSomeFakeData";
import updateLowStockProducts from "./scheduledTasks/updateLowStockProducts";

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const app = express();

const corsOptions = {
  origin:process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(helmet());
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get(
  "/admin/run-scheduled-task",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!token || token !== process.env.SECRET_TOKEN) {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }
    await createSomeFakeData();
    await updateLowStockProducts();
      res.status(200).json({ message: "Scheduled task executed successfully" });
    } catch (err: any) {
      return next(err);
    }
  }
);

app.use("/admin", productRouter);
app.use("/admin", userRouter);
app.use("/admin", orderRouter);
app.use("/admin", saleRouter);
app.use("/admin", commentRouter);
app.use("/admin", dashboardRouter);

app.use(
  (err: Erroro, req: Request, res: Response, next: NextFunction): void => {
    res.status(err.httpStatusCode || 500).json({ error: err.message });
  }
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@admin-panel.czwa6yt.mongodb.net/${process.env.MONGO_DATABASE}`
  )
  .then((result) => {
    app.listen(process.env.PORT || 8080);
  })
  .catch((error) => {});

export default mongoose.connection;
