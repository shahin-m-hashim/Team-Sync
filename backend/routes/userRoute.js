const userRouter = require("express").Router();
const primaryDetails = require("../controllers/userController");

userRouter.get("/primaryUser", primaryDetails);

module.exports = userRouter;
