import ProductModel from "../models/PostgreSQL/productModel.js";

export const getProducts = async () => {
  const result = await ProductModel.getProducts();
  if (!result) {
    throw error;
  }
  return result;
};

export default getProducts;
