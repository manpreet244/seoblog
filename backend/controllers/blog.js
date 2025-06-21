const Blog = require("../models/blog");
const formidable = require("formidable");
const slugify = require("slugify");
const { stripHtml } = require("string-strip-html");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");
const { smartTrim } = require("../helpers/blog");
const Tag = require("../models/tag");
const Category = require("../models/category");
const category = require("../models/category");

exports.create = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log("Image could not be uploaded");
      return res.status(400).json({ error: "Image could not be uploaded" });
    }

    const normalizeField = (field) => (Array.isArray(field) ? field[0] : field);
    const titleValue = normalizeField(fields.title);
    const bodyContent = normalizeField(fields.body);

    // Parse JSON safely
    const parseJSON = (json) => {
      try {
        return JSON.parse(normalizeField(json));
      } catch {
        return null;
      }
    };

    const arrayOfCategories = parseJSON(fields.categories);
    if (!arrayOfCategories) {
      return res
        .status(400)
        .json({ error: "Categories must be a valid JSON array" });
    }

    const arrayOfTags = parseJSON(fields.tags);
    if (!arrayOfTags) {
      return res.status(400).json({ error: "Tags must be a valid JSON array" });
    }

    // Validation
    if (
      !titleValue ||
      typeof titleValue !== "string" ||
      titleValue.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "Title is required and must be a non-empty string" });
    }

    const plainTextBody = stripHtml(bodyContent || "").result.trim();
    if (!plainTextBody || plainTextBody.length < 200) {
      return res.status(400).json({
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

    let blog = new Blog();
    blog.title = titleValue.trim();
    blog.body = bodyContent;
    blog.slug = slugify(titleValue.trim()).toLowerCase();
    blog.excerpt = smartTrim(bodyContent, 200, "", "...");
    blog.mtitle = `${titleValue.trim()} | ${process.env.APP_NAME}`;
    blog.mdesc = stripHtml(bodyContent.substring(0, 160)).result;
    blog.postedBy = req.user._id;
    blog.categories = arrayOfCategories;
    blog.tags = arrayOfTags;

    // Photo upload
    if (files.photo) {
      const photoFile = Array.isArray(files.photo)
        ? files.photo[0]
        : files.photo;
      console.log("Photo file info:", photoFile);

      if (photoFile.size > 1000000) {
        return res
          .status(400)
          .json({ error: "Image should be less than 1MB in size" });
      }

      const photoPath = photoFile.filepath || photoFile.path;
      blog.photo.data = fs.readFileSync(photoPath);
      blog.photo.contentType = photoFile.mimetype || photoFile.type;
    }

    try {
      const result = await blog.save();
      return res.json(result);
    } catch (saveError) {
      return res.status(400).json({ error: errorHandler(saveError) });
    }
  });
};

//list all blogs

exports.list = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username")
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );

    res.json(blogs);
  } catch (err) {
    return res.json({
      error: errorHandler(err),
    });
  }
};

//   /blogs-categories-tags
exports.listAllBlogsCategoriesTags = async (req, res) => {
  const limit = req.body.limit ? parseInt(req.body.limit) : 10;
  const skip = req.body.skip ? parseInt(req.body.skip) : 0;
  // limit is how many blogs to return (defaults to 10 if not provided).

  // skip is how many blogs to skip (for pagination). Defaults to 0
  try {
    // Fetch blogs
    const blogs = await Blog.find({})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );

    // Fetch all categories
    const categories = await Category.find({});

    // Fetch all tags
    const tags = await Tag.find({});

    // Send response
    return res.json({
      blogs,
      categories,
      tags,
      size: blogs.length,
    });
  } catch (err) {
    return res.json({
      error: errorHandler(err),
    });
  }
};

//read
exports.read = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const data = await Blog.findOne({ slug })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username")
      .select(
        "_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt"
      );

    if (!data) {
      return res.status(400).json({ error: "Blog not found" });
    }

    return res.json(data);
  } catch (err) {
    return res.json({
      error: errorHandler(err),
    });
  }
};
//delete a blog
exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const data = await Blog.findOneAndDelete({ slug })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username")
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );

    if (!data) {
      return res.status(400).json({
        error: "Blog not found or could not be deleted",
      });
    }

    return res.json({
      message: "Blog deleted successfully",
      deletedBlog: data,
    });
  } catch (err) {
    return res.status(500).json({
      error: errorHandler(err),
    });
  }
};

//update a blog

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
      console.log("Image could not be uploaded");
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
    if (!arrayOfCategories) {
      return res
        .status(400)
        .json({ error: "Categories must be a valid JSON array" });
    }

    const arrayOfTags = parseJSON(fields.tags);
    if (!arrayOfTags) {
      return res.status(400).json({ error: "Tags must be a valid JSON array" });
    }

    if (
      !titleValue ||
      typeof titleValue !== "string" ||
      titleValue.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "Title is required and must be a non-empty string" });
    }

    const plainTextBody = stripHtml(bodyContent || "").result.trim();
    if (!plainTextBody || plainTextBody.length < 200) {
      return res.status(400).json({
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

    // Now update blog using _.merge (with your idea)
    let oldBlog = data;
    const slugBeforeMerge = oldBlog.slug;

    oldBlog = _.merge(oldBlog, fields);
    oldBlog.slug = slugBeforeMerge; // keep the slug unchanged

    // Extract body, categories, tags
    const body = fields.body || "";
    const categories = fields.categories || "";
    const tags = fields.tags || "";

    // Update excerpt and meta description
    if (body) {
      oldBlog.excerpt = smartTrim(body, 200, " ", "...");
      oldBlog.mdesc = stripHtml(body.substring(0, 160)).result;
    }

    // Update categories and tags (convert from comma-separated string)
    if (categories) {
      oldBlog.categories = categories.split(",").map((cat) => cat.trim());
    }

    if (tags) {
      oldBlog.tags = tags.split(",").map((tag) => tag.trim());
    }

    // Photo upload
    if (files.photo) {
      const photoFile = Array.isArray(files.photo)
        ? files.photo[0]
        : files.photo;
      console.log("Photo file info:", photoFile);

      if (photoFile.size > 1000000) {
        return res
          .status(400)
          .json({ error: "Image should be less than 1MB in size" });
      }

      const photoPath = photoFile.filepath || photoFile.path;
      oldBlog.photo.data = fs.readFileSync(photoPath);
      oldBlog.photo.contentType = photoFile.mimetype || photoFile.type;
    }

    try {
      const result = await oldBlog.save();
      result.photo = undefined;
      return res.json(result);
    } catch (saveError) {
      return res.status(400).json({ error: errorHandler(saveError) });
    }
  });
};

exports.photo = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug }).select("photo");
    if (!blog) {
      return res.status(400).json({ error: errorHandler(err) });
    }
    res.set("Content-Type", blog.photo.contentType);
    return res.send(blog.photo.data);
  } catch (err) {
    return res.status(500).json({ msg: data.message });
  }
};



exports.listRelated = async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body;

  try {
    const blogs = await Blog.find({
      _id: { $ne: _id }, // exclude current blog
      categories: { $in: categories }, // match any category
    })
      .limit(limit)
      .populate('postedBy', '_id name') // optional
      .populate('categories', 'name slug') // optional
      .populate('tags', 'name slug') // optional
      .select('title slug excerpt postedBy categories tags createdAt updatedAt');

    res.json(blogs);
  } catch (err) {
    console.error("Related blogs fetch error:", err);
    res.status(400).json({ error: 'Could not fetch related blogs' });
  }
};
