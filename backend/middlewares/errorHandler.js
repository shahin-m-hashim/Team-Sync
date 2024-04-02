const errorHandler = (error, req, res, next) => {
  switch (error.message) {
    case "UserAlreadyExists":
      return res.status(400).json({
        success: false,
        error:
          "A user with the given email or username already exists, please login instead",
      });

    case "UnknownUser":
      return res.status(404).json({
        success: false,
        error: "User not found, Please sign up first",
      });

    case "InvalidPassword":
      return res.status(401).json({
        success: false,
        error: "Invalid password, Please try again",
      });

    case "ValidationError":
      const validationErrors = {};
      Object.keys(error.errors).forEach(
        (key) => (validationErrors[key] = error.errors[key].message)
      );
      return res.status(422).json({
        success: false,
        error: "Validations failed",
        validationErrors,
      });

    case "TokenCreationFailure":
      return res.status(500).json({
        success: false,
        error: "Token creation failed",
      });

    case "InvalidAccessToken":
      res.clearCookie("accJwt");
      return res.status(401).json({
        success: false,
        error: "Access Denied. Invalid Access token.",
      });

    case "InvalidRefreshToken":
      res.clearCookie("refJwt");
      return res.status(401).json({
        success: false,
        error: "Access Denied. Invalid Refresh token.",
      });

    case "InvalidOtpToken":
      return res.status(401).json({
        success: false,
        error: "Oops, looks like your session has expired",
      });

    case "InvalidOTP":
      return res.status(401).json({
        success: false,
        error: "Oops, looks like the OTP has expired, kindly request a new one",
      });

    case "AccountDeletionError":
      return res.status(401).json({
        success: false,
        error: "Account deletion failed",
      });

    default:
      console.error("Error stack:", error.stack);
      if (
        error.message === "jwt malformed" ||
        error.message === "invalid token"
      ) {
        res.clearCookie("accJwt");
        res.clearCookie("refJwt");
      }
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message || "An unknown error occurred",
      });
  }
};

module.exports = errorHandler;
