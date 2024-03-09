const jwt = require("jsonwebtoken");

const {
  signUpUser,
  loginUser,
  sendPassResetOtp,
  verifyOTP,
  resetUserPassword,
} = require("../services/authService");

const signUpController = async (req, res, next) => {
  try {
    const { id, username, createdAt } = await signUpUser(req.body);

    res.status(201).json({
      success: true,
      result: { username, userId: id, createdAt },
      message: `User ${id} signed up successfully`,
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      res.status(422).json({
        success: false,
        error: "Validations failed, please check your input and try again",
      });
    } else if (e.name === "MongoServerError") {
      res.status(400).json({
        success: false,
        error:
          "A user with the given email or username already exists, please login instead",
      });
    } else {
      next(e);
    }
  }
};

const loginController = async (req, res, next) => {
  // console.log("Inside login controller");
  try {
    res.clearCookie("accJwt");
    res.clearCookie("refJwt");

    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginUser(email, password);

    if (accessToken && refreshToken) {
      res.cookie("accJwt", accessToken, {
        httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 1 * 60 * 1000), // 1 min
      });

      res.cookie("refJwt", refreshToken, {
        httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      });

      return res.status(200).json({
        success: true,
        message: "Login Successful",
      });
    } else throw new Error("Failed to create tokens");
  } catch (e) {
    if (e.message === "UnknownUser") {
      return res.status(401).json({
        success: false,
        error: "User not found, Please sign up first",
      });
    } else if (e.message === "InvalidPassword") {
      return res.status(401).json({
        success: false,
        error: "Invalid password, Please try again",
      });
    } else {
      next(e);
    }
  }
};

const logoutController = async (req, res, next) => {
  try {
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

const reqPassResetOtpController = async (req, res, next) => {
  const { email } = req.body;
  try {
    const mail = await sendPassResetOtp(email);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully, Please check your email for the OTP",
      mail,
    });
  } catch (e) {
    if (e.message === "UnknownUser") {
      return res.status(404).json({
        success: false,
        error: "User not found, Please sign up first",
      });
    }
    next(e);
  }
};

const verifyOtpController = async (req, res, next) => {
  const { otp } = req.body;
  try {
    const otpToken = await verifyOTP(otp);

    res.cookie("otpJwt", otpToken, {
      httpOnly: true,
      withCredentials: true,
      expires: new Date(Date.now() + 3 * 60 * 1000), // 3 min
    });

    res.status(200).json({ success: true });
  } catch (e) {
    if (e.message === "InvalidOTP") {
      return res.status(401).json({
        success: false,
        error:
          "Oops, looks like the OTP has expired,\nkindly request a new one",
      });
    }
    next(e);
  }
};

const resetPassController = async (req, res) => {
  try {
    const otpToken = req.cookies.otpJwt;

    if (!otpToken) {
      return res
        .status(401)
        .json({ status: false, error: "Access Denied. No token provided." });
    }

    const { password } = req.body;
    const { userId } = jwt.verify(otpToken, process.env.JWT_OTP_KEY);

    const username = await resetUserPassword({ userId, password });

    res.clearCookie("otpJwt");
    res.status(201).json({
      success: true,
      message: `User ${username} password updated successfully`,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.clearCookie("otpJwt");
      res.status(422).json({
        success: false,
        error: "Validations failed, please check your input and try again",
      });
    } else {
      console.log("Invalid token:", err.message);
      res.clearCookie("otpJwt");
      return res
        .status(401)
        .json({ status: false, error: "Access Denied. Invalid token." });
    }
  }
};

module.exports = {
  signUpController,
  loginController,
  logoutController,
  reqPassResetOtpController,
  verifyOtpController,
  resetPassController,
};
