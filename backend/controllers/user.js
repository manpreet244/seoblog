const User = require("../models/user");
const Blog = require("../models/blog");
const formidable = require("formidable");
const fs = require("fs");
const slugify = require("slugify");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler"); // Make sure you have this

// READ: Return current user's profile (excluding password)
exports.read = async (req, res) => {
  try {
    const user = req.profile;
    user.hashed_password = undefined;
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read user" });
  }
};

// PUBLIC PROFILE: Return user's public profile + their blogs
exports.publicProfile = async (req, res) => {
  try {
    const userName = req.params.userName;

    const user = await User.findOne({ userName: userName }).select(
      "-hashed_password -photo"
    );

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const blogs = await Blog.find({ postedBy: user._id })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .limit(10)
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );

    return res.json({ user, blogs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// UPDATE PROFILE: Update user info and photo
// UPDATE PROFILE: Update user info and photo

exports.update = (req, res) => {
  const form = formidable({
    keepExtensions: true,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({ error: "Form parsing error" });
    }

    const normalize = (field) =>
      (Array.isArray(field) ? field[0] : field)?.toString().trim();

    const userName = normalize(fields.userName);
    const name = normalize(fields.name);
    const email = normalize(fields.email);
    const about = normalize(fields.about);
    const password = normalize(fields.password);
    const photo = files.photo;

    console.log("Parsed fields:", { userName, name, email, about, password });
    console.log("Parsed file:", photo);

    try {
      const user = req.profile;
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (name) user.name = name;
       if (name) user.userName = userName;
      if (email) user.email = email;
      if (about) user.about = about;
      if (password) user.password = password;
      console.log(user.name.toString())
     
      if (files.photo) {
        const photoFile = Array.isArray(files.photo)
          ? files.photo[0]
          : files.photo;

        if (photoFile.size > 1000000) {
          return res
            .status(400)
            .json({ error: "Image should be less than 1MB in size" });
        }

        user.photo.data = fs.readFileSync(photoFile.filepath || photoFile.path);
        user.photo.contentType = photoFile.mimetype || photoFile.type;
      }
      await user.save();

      res.json({
        userName: user.userName,
        name: user.name,
        email: user.email,
        about: user.about,
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Update error:", error.message);
      return res
        .status(500)
        .json({ error: "Internal server error while updating user" });
    }
  });
};
exports.photo = async (req, res) => {
  try {
    const userName = req.params.userName;

    const user = await User.findOne({ userName: userName }).select("photo");

    if (!user || !user.photo || !user.photo.data) {
      return res.status(404).json({ error: "User or photo not found" });
    }

    res.set("Content-Type", user.photo.contentType);
    return res.send(user.photo.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load photo" });
  }
};
