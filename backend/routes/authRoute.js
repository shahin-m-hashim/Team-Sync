const authRouter = require("express").Router();
const {
  loginController,
  signUpController,
} = require("../controllers/authController");

// sign up user
authRouter.post("/signup", signUpController);

// authenticate user
authRouter.post("/login", loginController);

module.exports = authRouter;
