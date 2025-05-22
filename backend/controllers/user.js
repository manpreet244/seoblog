const User = require('../models/user');
exports.read = (req, res) => {
  req.profile.hashed_password = undefined;//hide pwd
  return res.json(req.profile);
}
