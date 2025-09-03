const { successResponse } = require("../helpers/responseHelpers");
const Category = require("../models/categoryModel");
const createError = require("http-errors");
const {
  categoryCreate,
  findCategories,
  findCategory,
  findUpdateCategory,
  findDeleteCategory,
} = require("../services/categoryService");

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    await categoryCreate(name);
    return successResponse(res, {
      statusCode: 201,
      message: "category is created successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await findCategories();
    return successResponse(res, {
      statusCode: 200,
      message: "Categories returned successfully",
      payload: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await findCategory(slug);
    return successResponse(res, {
      statusCode: 200,
      message: "Category returned successfully",
      payload: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.categoryUpdate = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;
    const updateCategory = await findUpdateCategory(name, slug);
    if (!updateCategory) {
      throw createError(404, "Category not found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Category updated successfully",
      payload: updateCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.categoryDelete = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deleteCategory = await findDeleteCategory(slug);
    if (!deleteCategory) {
      throw createError(404, "Category not found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Category delete successfully",
    });
  } catch (error) {
    throw error;
  }
};
