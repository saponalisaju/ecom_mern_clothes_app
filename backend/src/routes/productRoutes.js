const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");
const { uploadProduct, seedProduct } = require("../middlewares/uploadFile");

productRouter.get("/all_products", productController.get_products);

productRouter.get(
  "/new_collection_women",
  productController.new_collection_women
);
productRouter.get("/new_collection_men", productController.new_collection_men);
productRouter.get("/new_collection_kid", productController.new_collection_kid);

productRouter.get("/popular_women", productController.popular_women);
productRouter.get("/popular_men", productController.popular_men);
productRouter.get("/popular_kid", productController.popular_kid);

productRouter.get(
  "/seed_product",
  seedProduct.single("image"),
  productController.seedProduct
);
productRouter.post(
  "/upload",
  uploadProduct.single("product"),
  productController.upload
);
productRouter.post(
  "/add_product",
  uploadProduct.single("image"),
  productController.add_product
);
productRouter.delete("/remove_product/:id", productController.remove_product);

module.exports = productRouter;
