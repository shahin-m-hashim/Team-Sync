const jwt = require("jsonwebtoken");

const {
  loginUser,
  signUpUser,
  logoutUser,
  sendPassResetOtp,
  resetUserPassword,
  verifyPassResetOtp,
} = require("../services/authService");

const signUpController = async (req, res, next) => {
  try {
    await signUpUser(req.body);
    res.status(201).json({
      success: true,
      message: "Sign up successful",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      next(new Error("UserAlreadyExists"));
    }
    next(e);
  }
};

const loginController = async (req, res, next) => {
  try {
    res.clearCookie("accJwt");
    res.clearCookie("refJwt");

    const { email, password } = req.body;
    const { id, username } = await loginUser(email, password);

    const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_KEY, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_KEY, {
      expiresIn: "7d",
    });

    if (accessToken && refreshToken) {
      res.cookie("accJwt", accessToken, {
        httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      });

      res.cookie("refJwt", refreshToken, {
        httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
    } else throw new Error("TokenCreationFailure");

    return res.status(200).json({ userId: id, username });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    }
    next(e);
  }
};

const refreshTokensController = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refJwt;

    if (!refreshToken) throw new Error("InvalidRefreshToken");

    const { id } = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    console.log("Refresh token verified successfully");

    const newAccessToken = jwt.sign({ id }, process.env.JWT_ACCESS_KEY, {
      expiresIn: "1d",
    });

    const newRefreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_KEY, {
      expiresIn: "7d",
    });

    console.log("Tokens refreshed successfully");

    if (newAccessToken && newRefreshToken) {
      res.cookie("accJwt", newAccessToken, {
        httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      });

      res.cookie("refJwt", newRefreshToken, {
        httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    } else throw new Error("TokenCreationFailure");

    return res.status(200).json({
      success: true,
      message: "Tokens Refreshed",
    });
  } catch (e) {
    next(e);
  }
};

const reqPassResetOtpController = async (req, res, next) => {
  const { email } = req.body;
  try {
    await sendPassResetOtp(email);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully, Please check your email for the OTP",
    });
  } catch (e) {
    next(e);
  }
};

const verifyPassResetOtpController = async (req, res, next) => {
  const { otp } = req.body;
  try {
    const user = await verifyPassResetOtp(otp);

    const otpToken = jwt.sign({ user }, process.env.JWT_OTP_KEY, {
      expiresIn: "5m",
    });

    if (otpToken) {
      res.cookie("otpJwt", otpToken, {
        httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      });
    } else throw new Error("TokenCreationFailure");

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (e) {
    next(e);
  }
};

const resetPassController = async (req, res, next) => {
  try {
    const otpToken = req.cookies.otpJwt;
    if (!otpToken) throw new Error("InvalidOtpToken");

    const { password } = req.body;
    const { user } = jwt.verify(otpToken, process.env.JWT_OTP_KEY);

    await resetUserPassword(user, password);

    res.clearCookie("otpJwt");
    res.status(201).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    }
    next(e);
  }
};

const logoutController = async (req, res, next) => {
  try {
    const { userId } = req.body;
    await logoutUser(userId);

    res.clearCookie("accJwt");
    res.clearCookie("refJwt");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  signUpController,
  loginController,
  refreshTokensController,
  logoutController,
  reqPassResetOtpController,
  verifyPassResetOtpController,
  resetPassController,
};
