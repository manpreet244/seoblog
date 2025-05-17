const User = require("../models/user");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      return res.status(400).json({ error: "Email is taken" });
    }

    const { name, email, password } = req.body;
    let userName = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${userName}`;

    let newUser = new User({ name, email, password, userName, profile });
    await newUser.save();

    res.json({ user: newUser });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

//signin controller
//1) Extract cridentials ( email , password)
//2) Find user by email
//3) Check if user exists
//4)Authenticate password (The authenticate method is defined in your User model.)
//It hashes the provided plain password and compares it to the stored hashed_password.
// If the passwords don’t match, return an error telling the user credentials are invalid.
//5)Generate JWT token
// Use the jsonwebtoken library to create a signed token.

// The token payload contains the user’s _id — this will be used later to verify the user’s identity.

// The token is signed with a secret key (JWT_SECRET) stored in your environment variables.

// expiresIn: '1d' means the token expires after 1 day.
// 6) Set cookie in response
// The token is sent back to the client as an HTTP-only cookie named 'token'.

// httpOnly means the cookie cannot be accessed by client-side JavaScript, which adds security.
// 7. Send User Data and Token Back
// You send back the token and some user info (excluding sensitive stuff like password).

// The frontend uses this token to authenticate future requests.

// User info is useful for frontend display or logic (like showing username, role-based UI, etc).
exports.signin = async (req, res) => {
  // Declare email and password once here
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res
        .status(400)
        .json({
          error: "User with that email does not exist. Please sign up.",
        });
    }

    if (!user.authenticate(password)) {
      return res
        .status(400)
        .json({ error: "Email and password do not match." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });

    return res.json({
      token,
      user,
      // user: { _id, userName, name, email, role },
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};
