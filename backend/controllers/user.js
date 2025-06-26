const User = require("../models/user");
const Blog = require("../models/blog");

exports.read = (req, res) => {
  req.profile.hashed_password = undefined; //hide pwd
  return res.json(req.profile);
};

exports.publicProfile = async (req, res) => {
  console.log("ihii")
  try {
    const username = req.params.username;
  console.log(username)
    const user = await User.findOne({ userName :username }).select("-password"); // remove sensitive fields

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const userId = user._id;

    const blogs = await Blog.find({ postedBy: userId })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .limit(10)
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );
    user.photo = undefined;
    user.hashed_password = undefined;

    return res.json({
      user,
      blogs,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};
