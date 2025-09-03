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

// useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       const response = await api.get('/users/all_products');
//       setAllProduct(response.data);
//     } catch (error) {
//       console.error('Error fetching all products', error);
//     }
//   };
