const Blog = require("../models/blog");
const formidable = require("formidable");
const slugify = require("slugify");
const striptags = require("striptags");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");
const { smartTrim } = require("../helpers/blog");
const Tag = require("../models/tag");
const Category = require("../models/category");
const _ = require("lodash");
const User = require("../models/user");

// Create blog
exports.create = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image could not be uploaded" });
    }

    const normalizeField = (field) => (Array.isArray(field) ? field[0] : field);
    const titleValue = normalizeField(fields.title);
    const bodyContent = normalizeField(fields.body);

    const parseJSON = (json) => {
      try {
        return JSON.parse(normalizeField(json));
      } catch {
        return null;
      }
    };

    const arrayOfCategories = parseJSON(fields.categories);
    const arrayOfTags = parseJSON(fields.tags);

    if (
      !titleValue ||
      typeof titleValue !== "string" ||
      titleValue.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "Title is required and must be a non-empty string" });
    }

    const plainTextBody = striptags(bodyContent || "").trim();
    if (!plainTextBody || plainTextBody.length < 200) {
      return res
        .status(400)
        .json({
          error: "Content is too short. Minimum 200 characters required.",
        });
    }

    if (!arrayOfCategories?.length) {
      return res
        .status(400)
        .json({ error: "At least one category is required" });
    }

    if (!arrayOfTags?.length) {
      return res.status(400).json({ error: "At least one tag is required" });
    }

    let blog = new Blog({
      title: titleValue.trim(),
      body: bodyContent,
      slug: slugify(titleValue.trim()).toLowerCase(),
      excerpt: smartTrim(bodyContent, 200, "", "..."),
      mtitle: `${titleValue.trim()} | ${process.env.APP_NAME}`,
      mdesc: striptags(bodyContent.substring(0, 160)),
      postedBy: req.user._id,
      categories: arrayOfCategories,
      tags: arrayOfTags,
    });

    if (files.photo) {
      const photoFile = Array.isArray(files.photo)
        ? files.photo[0]
        : files.photo;

      if (photoFile.size > 1000000) {
        return res
          .status(400)
          .json({ error: "Image should be less than 1MB in size" });
      }

      blog.photo.data = fs.readFileSync(photoFile.filepath || photoFile.path);
      blog.photo.contentType = photoFile.mimetype || photoFile.type;
    }

    try {
      const result = await blog.save();
      res.json(result);
    } catch (saveError) {
      res.status(400).json({ error: errorHandler(saveError) });
    }
  });
};

// List all blogs
exports.list = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name userName")
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );

    res.json(blogs);
  } catch (err) {
    res.json({ error: errorHandler(err) });
  }
};

// List blogs, categories, and tags
exports.listAllBlogsCategoriesTags = async (req, res) => {
  const limit = req.body.limit ? parseInt(req.body.limit) : 10;
  const skip = req.body.skip ? parseInt(req.body.skip) : 0;

  try {
    const blogs = await Blog.find({})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name userName profile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );

    const categories = await Category.find({});
    const tags = await Tag.find({});

    res.json({ blogs, categories, tags, size: blogs.length });
  } catch (err) {
    res.json({ error: errorHandler(err) });
  }
};

// Read a blog
exports.read = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const data = await Blog.findOne({ slug })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name userName")
      .select(
        "_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt"
      );

    if (!data) {
      return res.status(400).json({ error: "Blog not found" });
    }

    res.json(data);
  } catch (err) {
    res.json({ error: errorHandler(err) });
  }
};

// Delete a blog
exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const data = await Blog.findOneAndDelete({ slug });

    if (!data) {
      return res
        .status(400)
        .json({ error: "Blog not found or could not be deleted" });
    }

    res.json({ message: "Blog deleted successfully", deletedBlog: data });
  } catch (err) {
    res.status(500).json({ error: errorHandler(err) });
  }
};

// Update a blog
exports.update = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const data = await Blog.findOne({ slug });

  if (!data) {
    return res.status(404).json({ error: "Blog not found" });
  }

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image could not be uploaded" });
    }

    const normalizeField = (field) => (Array.isArray(field) ? field[0] : field);
    const titleValue = normalizeField(fields.title);
    const bodyContent = normalizeField(fields.body);

    const arrayOfCategories = fields.categories
      ? normalizeField(fields.categories)
          .split(",")
          .map((cat) => cat.trim())
      : [];

    const arrayOfTags = fields.tags
      ? normalizeField(fields.tags)
          .split(",")
          .map((tag) => tag.trim())
      : [];

    if (
      !titleValue ||
      typeof titleValue !== "string" ||
      titleValue.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "Title is required and must be a non-empty string" });
    }

    const plainTextBody = striptags(bodyContent || "").trim();
    if (!plainTextBody || plainTextBody.length < 200) {
      return res
        .status(400)
        .json({
          error: "Content is too short. Minimum 200 characters required.",
        });
    }

    if (!arrayOfCategories.length) {
      return res
        .status(400)
        .json({ error: "At least one category is required" });
    }

    if (!arrayOfTags.length) {
      return res.status(400).json({ error: "At least one tag is required" });
    }

    let oldBlog = _.merge(data, fields);
    oldBlog.slug = data.slug; // keep slug unchanged

    if (bodyContent) {
      oldBlog.excerpt = smartTrim(bodyContent, 200, " ", "...");
      oldBlog.mdesc = striptags(bodyContent.substring(0, 160));
    }

    oldBlog.categories = arrayOfCategories;
    oldBlog.tags = arrayOfTags;

    if (files.photo) {
      const photoFile = Array.isArray(files.photo)
        ? files.photo[0]
        : files.photo;

      if (photoFile.size > 1000000) {
        return res
          .status(400)
          .json({ error: "Image should be less than 1MB in size" });
      }

      oldBlog.photo.data = fs.readFileSync(
        photoFile.filepath || photoFile.path
      );
      oldBlog.photo.contentType = photoFile.mimetype || photoFile.type;
    }

    try {
      const result = await oldBlog.save();
      result.photo = undefined;
      res.json(result);
    } catch (saveError) {
      res.status(400).json({ error: errorHandler(saveError) });
    }
  });
};

// Serve blog photo
exports.photo = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug }).select("photo");

    if (!blog || !blog.photo || !blog.photo.data) {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.set("Content-Type", blog.photo.contentType);
    res.send(blog.photo.data);
  } catch (err) {
    res.status(500).json({ error: "Could not retrieve photo" });
  }
};

// Related blogs
exports.listRelated = async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body;

  const categoryIds = categories.map((c) => c._id); // 🔥 Fix here

  try {
    const blogs = await Blog.find({
      _id: { $ne: _id },
      categories: { $in: categoryIds },
    })
      .limit(limit)
      .populate("postedBy", "_id name userName")
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .select(
        "title slug excerpt postedBy categories tags createdAt updatedAt"
      );

    res.json(blogs);
  } catch (err) {
    res.status(400).json({ error: "Could not fetch related blogs" });
  }
};

//list search
exports.listSearch = async (req, res) => {
  const { search } = req.query;

  try {
    if (search) {
      const data = await Blog.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } },
        ],
      });

      return res.json(data).select("-photo -body -createdAt -updatedAt");
    } else {
      return res.status(400).json({ error: "Search query is required" });
    }
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

exports.listByUser = async (req, res) => {
  try {
    const user =await  User.findOne({ userName: req.params.username });
    if (user) {
      let userId = user._id;
      const data = await Blog.find({ postedBy: userId })
        .populate("categories", "_id name slug")
        .populate("tags", "_id name userName")
        .select("_id title slug postedBy createdAt updatedAt");
      res.json(data);
    }
  } catch (error) {
    return res.status(400).json({ error: errorHandler(error) });
  }
};
