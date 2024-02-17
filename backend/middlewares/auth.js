const jwt = require("jsonwebtoken");

// console.log("Inside Auth Middleware");

const verifyToken = (req, res, next) => {
  try {
    const accessToken = req.cookies.jwt;

    if (!accessToken) {
      res.clearCookie("jwt");
      console.log("Token doesn't exist");
      return res
        .status(401)
        .json({ status: false, error: "Access Denied. No token provided." });
    }

    req.user = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    console.log("Invalid token:", err.message);
    return res
      .status(401)
      .json({ status: false, error: "Access Denied. Invalid token." });
  }
};

const refreshToken = (req, res, next) => {
  try {
    const prevToken = req.cookies.jwt;

    if (!prevToken) {
      return res.status(401).json({
        status: false,
        error: "Access Denied. Refresh token doesn't exist",
      });
    }

    const { userId, username } = jwt.verify(
      prevToken,
      process.env.JWT_SECRET_KEY
    );

    // Clear the old access token cookie
    res.clearCookie("jwt");

    // Refresh and generate a new access token
    const refreshedToken = jwt.sign(
      { userId, username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" } // 1 day
    );

    // Set the new refresh token in the response cookie
    res.cookie("jwt", refreshedToken, {
      httpOnly: true,
      withCredentials: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    });

    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    return res.status(401).json({ status: false, error: "Unauthorized" });
  }
};

module.exports = { verifyToken, refreshToken };
