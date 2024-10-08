import {Router} from "express";
import dashboardControllers from "../controllers/dashboard";

const router = Router();

router.get("/dashboard/totals" , dashboardControllers.getTotals);

router.get("/dashboard/last30days" , dashboardControllers.getLast30DaysData);

router.get("/dashboard/chart" , dashboardControllers.getChartData);

export default router;

