import OrderService from "../services/orderService.js";

const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const order = await OrderService.createOrder(userId);
    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

export default { createOrder };
