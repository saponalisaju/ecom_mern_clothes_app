const express = require("express");
const userController = require("../controllers/userController");

const { runValidation } = require("../validate");

const userRouter = express.Router();

const {
  validationUser,
  validateUpdatePassword,
  validateForgetPassword,
  validateResetPassword,
} = require("../validate/auth");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");

userRouter.post(
  "/sign_up",
  isLoggedOut,
  validationUser,
  runValidation,
  userController.sign_up
);
userRouter.post("/login", isLoggedIn, userController.login);
userRouter.get("/fetch_user", isLoggedIn, userController.fetch_user);
userRouter.post(
  "/add_to_cart",
  userController.fetch_user,
  userController.add_to_cart
);

userRouter.post(
  "/remove_from_cart",
  userController.fetch_user,
  userController.remove_from_cart
);

userRouter.post(
  "/get_cart",
  userController.fetch_user,
  userController.get_cart
);

// userRouter.get(
//   "/users/:id([0-9a-fA-F]{24})",

//   userController.getSingleUser
// );
// userRouter.delete(
//   "/users/:id([0-9a-fA-F]{24})",
//   isLoggedIn,
//   userController.deleteUser
// );
// userRouter.put(
//   "/users/:id([0-9a-fA-F]{24})",
//   isLoggedIn,

//   userController.updateUser
// );
// userRouter.put(
//   "/manage-user/:id([0-9a-fA-F]{24})",
//   isLoggedIn,

//   userController.manageUser
// );
// userRouter.put(
//   "/update-password/:id([0-9a-fA-F]{24})",
//   isLoggedIn,
//   validateUpdatePassword,
//   runValidation,
//   userController.updatePassword
// );
// userRouter.post(
//   "/forget-password",
//   validateForgetPassword,
//   runValidation,
//   userController.forgetPassword
// );
// userRouter.put(
//   "/reset-password",
//   validateResetPassword,
//   runValidation,
//   userController.resetPassword
// );

module.exports = userRouter;
