import CartModel from "../models/PostgreSQL/cartModel.js";
import ProductModel from "../models/PostgreSQL/productModel.js";

const addToCart = async (userId, productId, quantity) => {
  const product = await ProductModel.getProduct(productId);
  if (!product || product.stock < quantity) {
    throw new Error("Invalid product or stock");
  }
  return await CartModel.addToCart(userId, productId, quantity);
};

const getCart = async (userId) => {
  return await CartModel.getToCart(userId);
};

export default { addToCart, getCart };
