import {Router} from "express";
import saleControllers from "../controllers/sale";

const router = Router();

router.get("/sales/chart" , saleControllers.getChartData);

router.get("/sales/top-buyers" , saleControllers.getTopBuyers);

router.get("/sales/most-sold-products" , saleControllers.getMostSoldProducts);

export default router;

