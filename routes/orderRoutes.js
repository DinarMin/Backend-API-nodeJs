import express from "express";
import { Auth } from "../utils/auth.js";

import OrderController from "../controllers/orderController.js";

const router = express.Router();

router.post("/", Auth, OrderController.createOrder);

export default router;
