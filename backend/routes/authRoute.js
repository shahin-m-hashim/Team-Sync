const authRouter = require("express").Router();
const loginController = require("../controllers/authController");

// authenticate user
authRouter.post("/login", loginController);

module.exports = authRouter;
