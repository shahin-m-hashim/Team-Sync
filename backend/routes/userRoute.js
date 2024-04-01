const userRouter = require("express").Router();

const {
  deleteAccount,
  fetchUserDetails,
  updateProfilePic,
  deleteProfilePic,
  updatePrimaryDetails,
  updateSecondaryDetails,
} = require("../controllers/userController");

// GET Requests
userRouter.get("/userDetails", fetchUserDetails);

// PATCH Requests
userRouter.patch("/profilePic", updateProfilePic);
userRouter.patch("/primaryDetails", updatePrimaryDetails);
userRouter.patch("/secondaryDetails", updateSecondaryDetails);

// DELETE Requests
userRouter.delete("/", deleteAccount);
userRouter.delete("/profilePic", deleteProfilePic);

module.exports = userRouter;
