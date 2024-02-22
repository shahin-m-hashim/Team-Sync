const authRouter = require("express").Router();
const {
  signUpController,
  loginController,
  logoutController,
  reqPassResetOtpController,
  verifyOtpController,
  resetPassController,
} = require("../controllers/authController");

authRouter.post("/signup", signUpController);

authRouter.post("/login", loginController);

authRouter.post("/reqPassResetOtp", reqPassResetOtpController);

authRouter.post("/verifyOTP", verifyOtpController);

authRouter.post("/resetPass", resetPassController);

authRouter.get("/logout", logoutController);

module.exports = authRouter;
