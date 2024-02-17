const userRouter = require("express").Router();
const signUpController = require("../controllers/userController");

userRouter.post("/signup", signUpController);

module.exports = userRouter;
