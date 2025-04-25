import getProductsService  from "../services/productService.js";

const getProducts = async (req, res) => {
  try {
    const products = await getProductsService();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default getProducts;
