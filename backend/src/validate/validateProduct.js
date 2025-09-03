const { body } = require("express-validator");

const validationProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required. Enter your Product name")
    .isLength({ min: 3 })
    .withMessage("Product name should be at least 3 characters long"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("sold")
    .trim()
    .notEmpty()
    .withMessage("Sold is required.")
    .isFloat({ gt: 0 })
    .withMessage("Sold must be greater than 0"),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than 0"),

  body("shipping")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Shipping must be greater than 0"),

  body("image")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Product image is required");
      }
      return true;
    }),
];

module.exports = validationProduct;
