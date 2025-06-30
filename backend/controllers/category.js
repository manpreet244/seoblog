const Category = require("../models/category");
const slugify = require("slugify");
const { errorHandler } = require("../helpers/dbErrorHandler");

// Create category
exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = new Category({ name, slug });
    const savedCategory = await category.save();

    return res.status(201).json({ savedCategory });
  } catch (error) {
    console.error("Category creation error:", error);
    return res.status(500).json({ error: errorHandler(error) });
  }
};

// List all categories
exports.list = async (req, res) => {
  try {
    const data = await Category.find({});
    return res.json(data);
  } catch (err) {
    console.error("Error fetching categories:", err);
    return res.status(500).json({ error: errorHandler(err) });
  }
};

// Get a single category
exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  try {
    const category = await Category.findOne({ slug }).exec();
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.json(category);
  } catch (err) {
    console.error("Error fetching category:", err);
    return res.status(500).json({ error: errorHandler(err) });
  }
};

// Delete a category
exports.remove = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  try {
    const deletedCategory = await Category.findOneAndDelete({ slug }).exec();
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(500).json({ error: errorHandler(err) });
  }
};
