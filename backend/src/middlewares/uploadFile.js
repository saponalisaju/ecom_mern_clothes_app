const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Function to create disk storage
// const createStorage = () =>
//   multer.diskStorage({
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + " - " + file.originalname);
//     },
//   });

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("File type is not allowed"), false);
  }
  cb(null, true);
};

// Multer upload configurations
// const uploadUser = multer({
//   storage: createStorage(),
//   limits: { fileSize: MAX_FILE_SIZE },
//   fileFilter: fileFilter,
// });

const uploadProduct = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});
const seedProduct = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});

// const uploadImages = async (images, folder) => {
//   try {
//     const uploadPromises = images.map((image) =>
//       cloudinary.uploader.upload(image, { folder: folder })
//     );

//     const responses = await Promise.all(uploadPromises);
//     console.log("Files uploaded successfully to Cloudinary");

//     return responses.map((response) => ({
//       secure_url: response.secure_url,
//       public_id: response.public_id,
//     }));
//   } catch (error) {
//     console.error("Error uploading files:", error);
//     throw error;
//   }
// };

const uploadSeedImage = async (imagePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folder,
    });
    if (typeof result === "object" && result.secure_url && result.public_id) {
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
    } else {
      throw new Error("Invalid JSON response from Cloudinary");
    }
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return { secure_url: "default.png", public_id: "" };
  }
};
const uploadProductImage = async (imagePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folder,
    });
    if (typeof result === "object" && result.secure_url && result.public_id) {
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
    } else {
      throw new Error("Invalid JSON response from Cloudinary");
    }
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return { secure_url: "default.png", public_id: "" };
  }
};

module.exports = {
  seedProduct,
  uploadProduct,
  uploadProductImage,
  uploadSeedImage,
  // uploadUserMen: uploadUser,
  // uploadUserWomen: uploadUser,
  // uploadUserKids: uploadUser,
  // uploadMenImages: uploadImages,
  // uploadWomenImages: uploadImages,
  // uploadKidsImages: uploadImages,
};
