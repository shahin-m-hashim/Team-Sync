const userRouter = require("express").Router();
const {
  primaryDetails,
  entireDetails,
} = require("../controllers/userController");

userRouter.get("/primaryUser", primaryDetails);

userRouter.get("/entireUser", entireDetails);

module.exports = userRouter;
