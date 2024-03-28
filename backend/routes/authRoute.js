const authRouter = require("express").Router();
const {
  signUpController,
  loginController,
  refreshTokensController,
  logoutController,
  reqPassResetOtpController,
  verifyPassResetOtpController,
  resetPassController,
} = require("../controllers/authController");

authRouter.post("/signup", signUpController);

authRouter.post("/login", loginController);

authRouter.get("/refresh", refreshTokensController);

authRouter.post("/reqPassResetOtp", reqPassResetOtpController);

authRouter.post("/verifyPassResetOtp", verifyPassResetOtpController);

authRouter.post("/resetPass", resetPassController);

authRouter.get("/logout", logoutController);

module.exports = authRouter;
