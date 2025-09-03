const {
  uploadProductImage,
  uploadSeedImage,
} = require("../middlewares/uploadFile");
const Product = require("../models/productModel");
const productData = require("../../productData");
const { deleteFileFromCloudinary } = require("../helpers/deleteFileCloudinary");

exports.seedProduct = async (req, res, next) => {
  try {
    const oldProducts = await Product.find({});

    const deletePromises = oldProducts.map(async (product) => {
      if (product.imagePublicId) {
        try {
          await deleteFileFromCloudinary(product.imagePublicId);
          console.log(
            `Image with public_id ${product.imagePublicId} deleted successfully`
          );
        } catch (error) {
          console.error(
            `Failed to delete image with public_id ${product.imagePublicId}: ${error.message}`
          );
        }
      }
    });

    await Promise.all(deletePromises);
    await Product.deleteMany({});

    const products = [
      ...productData.women,
      ...productData.men,
      ...productData.kid,
      ...productData.newCollection,
    ];

    const insertPromises = products.map(async (product) => {
      let secure_url = "default.png";
      let public_id = "";

      try {
        const uploadResult = await uploadSeedImage(
          product.image,
          "eComHangerDB/images"
        );
        secure_url = uploadResult.secure_url || secure_url;
        public_id = uploadResult.public_id || public_id;
        console.log(`Image uploaded successfully: ${secure_url}`);
      } catch (error) {
        console.error(`Image upload failed: ${error.message}`);
      }

      const newProduct = new Product({
        ...product,
        image: secure_url,
        imagePublicId: public_id,
      });
      await newProduct.save();
      console.log(`Product ${newProduct.name} saved successfully`);
    });

    await Promise.all(insertPromises);

    res.status(201).json({
      success: true,
      message: "Seed product successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.upload = async (req, res) => {
  try {
    const image = req.file.path;
    res.json({
      success: 1,
      image: image,
    });
  } catch (error) {
    console.error("Error fetching pages:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching pages.",
      error: error.message,
    });
  }
};

exports.add_product = async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }
    const image = req.file?.path;
    let secure_url = "default.png";
    let public_id = "";
    if (image) {
      ({ secure_url, public_id } = await uploadProductImage(
        image,
        "eComHangerDB/images"
      ));
    }
    const product = new Product({
      id: id,
      name: req.body.name,
      image: secure_url,
      imagePublicId: public_id,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.status(201).json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error fetching pages:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching pages.",
      error: error.message,
    });
  }
};

//Creating API for deleting Products
exports.remove_product = async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.status(200).json({
    success: true,
    name: req.body.name,
  });
};

//Creating API for getting all Products
exports.get_products = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No product found." });
    }
    console.log("All products Fetched");
    res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching pages:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching pages.",
      error: error.message,
    });
  }
};

// creating endpoint for new collection data
exports.new_collection_women = async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    const newCollections = products.slice(1).slice(-8);
    if (!newCollections || newCollections.length === 0) {
      return res.status(404).json({ message: "No product found ." });
    }

    console.log("NewCollection Fetched");
    res.status(200).send(newCollections);
  } catch (error) {
    console.error("Error fetching pages:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching pages.",
      error: error.message,
    });
  }
};

exports.new_collection_men = async (req, res) => {
  try {
    const products = await Product.find({ category: "men" });
    const newCollections = products.slice(1).slice(-8);
    if (!newCollections || newCollections.length === 0) {
      return res.status(404).json({ message: "No product found ." });
    }

    console.log("NewCollection Fetched");
    res.status(200).send(newCollections);
  } catch (error) {
    console.error("Error fetching pages:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching pages.",
      error: error.message,
    });
  }
};

exports.new_collection_kid = async (req, res) => {
  try {
    const products = await Product.find({ category: "kid" });
    const newCollections = products.slice(1).slice(-8);
    if (!newCollections || newCollections.length === 0) {
      return res.status(404).json({ message: "No product found ." });
    }

    console.log("NewCollection Fetched");
    res.status(200).send(newCollections);
  } catch (error) {
    console.error("Error fetching pages:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching pages.",
      error: error.message,
    });
  }
};

//if one weekago upload product is shown as below

exports.new_collection_kid = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newCollections = await Product.find({
      category: "kid",
      createdAt: { $gte: oneWeekAgo },
    })
      .sort({ createdAt: -1 }) // newest first
      .limit(8);

    if (!newCollections.length) {
      return res
        .status(404)
        .json({ message: "No recent products found in 'kid' category." });
    }

    console.log("NewCollection Fetched");
    res.status(200).json(newCollections);
  } catch (error) {
    console.error("Error fetching new collection:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching the new collection.",
      error: error.message,
    });
  }
};

//creating endpoint for popular in women section
exports.popular_women = async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    if (!popular_in_women || popular_in_women.length === 0) {
      return res.status(404).json({ message: "No women product found. " });
    }
    console.log("Popular in women fetched");
    res.status(200).send(popular_in_women);
  } catch (error) {
    console.error("Error fetching pages:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching pages.",
      error: error.message,
    });
  }
};

//creating endpoint for popular in men section
exports.popular_men = async (req, res) => {
  try {
    let products = await Product.find({ category: "men" });
    let popular_in_men = products.slice(0, 4);
    if (!popular_in_men || popular_in_men.length === 0) {
      return res.status(404).json({ message: "No men product found. " });
    }
    console.log("Popular in men fetched");
    res.status(200).send(popular_in_men);
  } catch (error) {
    console.error("Error fetching pages:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching pages.",
      error: error.message,
    });
  }
};

//creating endpoint for popular in kid section
exports.popular_kid = async (req, res) => {
  try {
    let products = await Product.find({ category: "kid" });
    let popular_in_kid = products.slice(0, 4);
    if (!popular_in_kid || popular_in_kid.length === 0) {
      return res.status(404).json({ message: "No kid product found. " });
    }
    console.log("Popular in kid fetched");
    res.status(200).send(popular_in_kid);
  } catch (error) {
    console.error("Error fetching pages:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching pages.",
      error: error.message,
    });
  }
};
