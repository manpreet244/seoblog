const User = require('../models/user')
const shortId = require("shortid")
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
exports.signup = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      return res.status(400).json({ error: "Email is taken" });
    }

    const { name, email, password } = req.body;
    let userName = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${userName}`;

    let newUser = new User({ name, email, password, userName , profile});
    await newUser.save();

    res.json({ user :newUser});

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};


//signin controller
exports.signin=(req , res) =>{
  const {email , password} = req.body;
  //check if user exist
 const user = User.findOne({email}).exec();
  if(!user){
    return res.status(400).json({
      error :"User with that email does not exist .please signup."
    })
  }
  //authenticate, email password should match
  if(!user.authenticate(password)){
     return res.status(400).json({
      error :"Email and password does not match."
    })
  }
  //generate a token and send to client (user id + secret)
}