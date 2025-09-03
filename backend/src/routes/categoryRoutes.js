const express = require("express");
const categoryController = require("../controllers/categoryController");
const { validateCategory } = require("../validate/validateCategory");
const { runValidation } = require("../validate");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  categoryController.createCategory
);
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/:slug", categoryController.getCategory);
categoryRouter.put(
  "/:slug",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  categoryController.categoryUpdate
);
categoryRouter.delete(
  "/:slug",
  isLoggedIn,
  isAdmin,
  categoryController.categoryDelete
);

module.exports = categoryRouter;
