const { body } = require("express-validator");

const validationUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required. Enter your fullname")
    .isLength({ min: 4, max: 31 })
    .withMessage("Name should be at least 4-24 character long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email address")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter your password")
    // .matches(
    //   /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    // )
    .withMessage(
      "Password minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone no. is required. Enter your phone number"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required. Enter your address")
    .isLength({ min: 3 })
    .withMessage("Address should be at least 3 character long"),

  body("image")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Product image is required");
      }
      return true;
    }),
];

const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email address")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter your password")
    // .matches(
    //   /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    // )
    .withMessage(
      "Password minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
];

const validateUpdatePassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email address")
    .isEmail()
    .withMessage("Invalid email"),

  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old Password is required. Enter your old Password")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required. Enter your new Password")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),

  body("confirmedPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password did not match");
    }
    return true;
  }),
];

const validateForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email address")
    .isEmail()
    .withMessage("Invalid email"),
];

const validateResetPassword = [
  body("token").trim().notEmpty().withMessage("Token is missing"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("New Password is required. Enter your new Password")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
];

module.exports = {
  validationUser,
  validateUserLogin,
  validateUpdatePassword,
  validateForgetPassword,
  validateResetPassword,
};
