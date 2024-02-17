const signUpUser = require("../services/userService");

const signUpController = async (req, res) => {
  try {
    const { userId, username, createdAt } = await signUpUser(req.body);

    res.status(201).json({
      success: true,
      result: { userId, username, createdAt },
      message: `User ${userId} signed up successfully`,
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

module.exports = signUpController;
