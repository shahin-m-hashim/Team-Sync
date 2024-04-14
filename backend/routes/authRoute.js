const authRouter = require("express").Router();
const {
  loginController,
  signUpController,
  logoutController,
  resetPassController,
  refreshTokensController,
  reqPassResetOtpController,
  verifyPassResetOtpController,
} = require("../controllers/authController");

// GET REQUESTS
authRouter.get("/refresh", refreshTokensController);

// POST REQUESTS
authRouter.post("/login", loginController);
authRouter.post("/signup", signUpController);
authRouter.post("/logout", logoutController);
authRouter.post("/resetPass", resetPassController);
authRouter.post("/reqPassResetOtp", reqPassResetOtpController);
authRouter.post("/verifyPassResetOtp", verifyPassResetOtpController);

module.exports = authRouter;
