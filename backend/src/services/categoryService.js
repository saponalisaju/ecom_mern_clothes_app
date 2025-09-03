const Category = require("../models/categoryModel");
const slugify = require("slugify");

exports.categoryCreate = async (name) => {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name),
  });
  return newCategory;
};

exports.findCategories = async () => {
  return await Category.find({}).select("name slug").lean();
};

exports.findCategory = async (slug) => {
  return await Category.find({ slug }).select("name slug").lean();
};

exports.findUpdateCategory = async (name, slug) => {
  const filter = { slug };
  const update = { $set: { name: name, slug: slugify(name) } };
  const option = { new: true };
  const updateCategory = await Category.findOneAndUpdate(
    filter,
    update,
    option
  );
  return updateCategory;
};

exports.findDeleteCategory = async (slug) => {
  const deleteCategory = await Category.findOneAndDelete({ slug });
  return deleteCategory;
};
