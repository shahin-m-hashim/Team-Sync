const { findUser } = require("../services/publicService");

// GET REQUESTS
const searchUser = async (req, res, next) => {
  try {
    const users = await findUser(req.query.username);
    res.status(200).json(users);
  } catch (e) {
    next(e);
  }
};

module.exports = { searchUser };
