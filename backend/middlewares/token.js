const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  try {
    const accessToken = req.cookies.accJwt;
    if (!accessToken) {
      return res
        .status(401)
        .json({ status: false, error: "Access Denied. No token provided." });
    }
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
    console.log("Access token verified successfully");
    req.user = req.params;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { verifyAccessToken };
