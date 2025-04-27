import CartModel from "../models/PostgreSQL/cartModel.js";
import OrderModel from "../models/PostgreSQL/orderModel.js";

const createOrder = async (userId) => {
  const cartItems = await CartModel.getToCart(userId);
  if (!cartItems.length) throw new Error("Cart is empty");
  return await OrderModel.createOrder(userId, cartItems);
};

export default { createOrder };
