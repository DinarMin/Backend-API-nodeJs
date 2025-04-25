import express from "express";
import CartController from "../controllers/cartController.js";
import { Auth } from "../utils/auth.js";

const router = express.Router();

router.post("/", Auth, CartController.addToCart);
router.get("/", Auth, CartController.getCart);

export default router;