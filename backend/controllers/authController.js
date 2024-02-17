const { signUpUser, loginUser } = require("../services/authService");

const signUpController = async (req, res) => {
  try {
    const { id, username, createdAt } = await signUpUser(req.body);

    res.status(201).json({
      success: true,
      result: { username, userId: id, createdAt },
      message: `User ${id} signed up successfully`,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else if (error.name === "MongoServerError") {
      res.status(400).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      // console.log(error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message || "An unknown error occurred while signing up",
      });
    }
  }
};

const loginController = async (req, res) => {
  // console.log("Inside login controller");
  try {
    res.clearCookie("jwt");

    const { email, password } = req.body;
    const token = await loginUser(email, password);

    if (token) {
      res.cookie("jwt", token, {
        httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 1 * 60 * 1000), // 1 min
      });

      return res.status(200).json({
        success: true,
        message: "Login Successful",
      });
    }
  } catch (e) {
    if (e.message === "UnknownUser") {
      return res.status(401).json({
        success: false,
        error: e.message,
        message: "User not found, please sign up first",
      });
    } else if (e.message === "InvalidPassword") {
      return res.status(401).json({
        success: false,
        error: e.message,
        message: "Invalid password, please try again",
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: e.message || "An unknown error occurred while logging in",
      });
    }
  }
};

module.exports = { loginController, signUpController };
