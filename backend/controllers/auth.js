const User = require("../models/user");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/dbErrorHandler");


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
    console.log("User found in DB:", user);
    if (!user) {
      return res.status(400).json({
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
//signout
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success",
  });
};
//middle for proctected route(requireSignin)
// On protected routes, you verify this token to make sure:

// The request comes from a valid logged-in user

// You can trust the request and know who made it
//4) express-jwt  middleware:

// Reads the token from the request (usually from the Authorization header).

// Verifies the token using the secret (JWT_SECRET).

// If valid, adds the decoded user info (like user._id) to req.user or a custom field (like req.auth).

// If invalid or missing, it returns an "Unauthorized" (401) error.

//Require signin middleware for protected routes
// This middleware checks if the user is authenticated before allowing access to certain routes.
//Itcheck incoming token secret , and compare the secret we have
// in .env file , if that matchges then we can proceed

// Middleware reads the token — Usually from a cookie or an Authorization header.

// Middleware verifies the token — It uses your JWT secret to check the token’s signature and expiration.

// If token is valid — Middleware decodes the token payload (which usually contains user info like _id, name, etc.).

// Middleware attaches that decoded payload to req.user — This is the key step!

exports.requireSignin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.split(" ")[1];
  const tokenFromCookie = req.cookies?.token;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};


exports.authMiddleware = async (req, res, next) => {
  const authUserId = req.user._id;
  const user = await User.findById(authUserId);
  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  try {
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "User not found",
    });
  }
};


exports.adminMiddleware = async (req, res, next) => {
  try {
    const adminUserId = req.user && req.user._id; // or req.auth._id based on JWT middleware
    if (!adminUserId) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    const adminUser = await User.findById(adminUserId);
    if (!adminUser) {
      return res.status(400).json({ error: "User not found" });
    }

    if (adminUser.role !== 1) {
      return res.status(403).json({ error: "Admin resource. Access denied" });
    }

    req.profile = adminUser; // corrected from `user` to `adminUser`
    next();
  } catch (err) {
    console.error("Error in adminMiddleware:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


exports.canUpdateDeleteBlog = async (req , res , next) =>{
  try{
     const slug = req.params.slug.toLowerCase()
   const data = await Blog.findOne({slug})
   let authorisedUser = data.postedBy._id.toString() === req.profile._id.toString()
   if(!authorisedUser){
    return res.status(400).json({error: 'You are not authorised .'})
   }
   next()
  }catch(error){
    return res.status(500).json({ error: errorHandler});
  }
}