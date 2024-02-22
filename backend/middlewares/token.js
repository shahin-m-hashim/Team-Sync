const jwt = require("jsonwebtoken");

// console.log("Inside Auth Middleware");

const verifyAccessToken = (req, res, next) => {
  console.log("Verifying access token");

  try {
    const accessToken = req.cookies.accJwt;

    if (!accessToken) {
      return res
        .status(401)
        .json({ status: false, error: "Access Denied. No token provided." });
    }

    req.user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
    next();
  } catch (err) {
    console.log("Invalid token:", err.message);
    res.clearCookie("accJwt");
    return res
      .status(401)
      .json({ status: false, error: "Access Denied. Invalid token." });
  }
};

const verifyRefreshToken = (req, res, next) => {
  console.log("Verifying refresh token");

  try {
    const refreshToken = req.cookies.refJwt;

    if (!refreshToken) {
      return res.status(401).json({
        status: false,
        error: "Access Denied. Refresh token doesn't exist",
      });
    }

    req.user = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    next();
  } catch (err) {
    res.clearCookie("refJwt");
    console.log("Invalid Refresh token:", err.message);
    return res
      .status(401)
      .json({ status: false, error: "Access Denied. Invalid Refresh token." });
  }
};

const refreshToken = async (req, res, next) => {
  console.log("Refreshing tokens");

  try {
    const { userId, username } = req.user;

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId, username },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1m" } // 1 min
    );

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { userId, username },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "1d" } // 1 day
    );

    if (newAccessToken && newRefreshToken) {
      res.cookie("accJwt", newAccessToken, {
        httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 1 * 60 * 1000), // 1 min
      });

      res.cookie("refJwt", newRefreshToken, {
        httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      });

      return res.status(200).json({
        success: true,
        message: "Tokens Refreshed",
      });
    } else throw new Error("Failed to refresh tokens");
  } catch (e) {
    res.clearCookie("accJwt");
    res.clearCookie("refJwt");
    next(e);
  }
};

module.exports = { verifyAccessToken, verifyRefreshToken, refreshToken };
