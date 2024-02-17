const user = require("../models/userModel");

const signUpUser = async (userData) => await user.create(userData);

module.exports = signUpUser;
