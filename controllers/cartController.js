import CartService from "../services/cartService.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;
    const cartItem = await CartService.addToCart(userId, productId, quantity);
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await CartService.getCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { addToCart, getCart};