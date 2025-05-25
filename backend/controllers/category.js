const Category = require("../models/category");
const slugify = require("slugify");
const { errorHanlder } = require("../helpers/dbErrorHandler");

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

    console.log(savedCategory);
    return res.status(201).json({ savedCategory });
  } catch (error) {
    console.error("Category creation error:", error);
    return res.status(500).json({ error: errorHanlder(error) });
  }
};

//list all categories
exports.list = async (req, res) => {
  try {
    const data = await Category.find({});
    res.json(data);
  } catch (err) {
    console.error("Error fetching categories:", err);
    return res.status(500).json({ error: errorHanlder(err) });
  }
};
//get a single category
exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  try {
    const category = await Category.findOne({ slug }).exec();
  return res.json(category); //modify
  } catch (err) {
    console.error("Error fetching category:", err);
    return res.status(500).json({ error: errorHanlder(err) });
  }
};
//delete a category
exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  try {
    const deletedCategory = Category.findOneAndDelete({ slug }).exec();
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }else{
      return res.json({ message: "Category deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(500).json({ error: errorHanlder(err) });
  }
};
