const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  console.log("Verifying access token");
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      return res
        .status(401)
        .json({ status: false, error: "Access Denied. No token provided." });
    }
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
    console.log("Access token verified successfully");
    req.user = req.params;
    next();
  } catch (err) {
    console.log("Invalid token:", err.message);
    res.clearCookie("accJwt");
    return res
      .status(401)
      .json({ status: false, error: "Access Denied. Invalid token." });
  }
};

module.exports = { verifyAccessToken };
