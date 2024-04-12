const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  try {
    const accessToken = req.cookies.accJwt;
    if (!accessToken) throw new Error("InvalidAccessToken");
    const { id } = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
    console.log("Access token verified successfully");

    const { userId } = req.params;

    if (id !== userId) throw new Error("UnauthorizedAccess");

    req.user = req.params;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { verifyAccessToken };
