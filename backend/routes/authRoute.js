const authRouter = require("express").Router();
const {
  signUpController,
  loginController,
  logoutController,
} = require("../controllers/authController");

authRouter.post("/signup", signUpController);

authRouter.post("/login", loginController);

authRouter.get("/logout", logoutController);

module.exports = authRouter;
