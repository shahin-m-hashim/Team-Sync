const userRouter = require("express").Router();

const {
  fetchProfilePic,
  updateProfilePic,
  deleteProfilePic,
  fetchBasicDetails,
  updateBasicDetails,
  fetchPublicDetails,
  updatePublicDetails,
} = require("../controllers/userController");

userRouter.get("/profilePic", fetchProfilePic);
userRouter.patch("/profilePic", updateProfilePic);
userRouter.delete("/profilePic", deleteProfilePic);

userRouter.get("/basicDetails", fetchBasicDetails);
userRouter.patch("/basicDetails", updateBasicDetails);

userRouter.get("/publicDetails", fetchPublicDetails);
userRouter.patch("/publicDetails", updatePublicDetails);

module.exports = userRouter;
