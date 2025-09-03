const { body } = require("express-validator");
const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required. Enter your fullname")
    .isLength({ min: 3 })
    .withMessage("Name should be at least 4 character long"),
];

module.exports = { validateCategory };
