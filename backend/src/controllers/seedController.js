const { all_product } = require("../../all_product");

const Product = require("../models/productModel");

exports.seedProduct = async (req, res, next) => {
  try {
    await Product.deleteMany({});

    const products = await Product.insertMany(
      all_product.products.map((product) => ({
        ...product,
      }))
    );
    res.status(201).json({
      success: true,
      products,
      message: "Seed product successfully",
    });
  } catch (error) {
    next(error);
  }
};
