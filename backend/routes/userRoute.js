const userRouter = require("express").Router();

const {
  deleteAccount,
  updateProfilePic,
  deleteProfilePic,
  fetchPrimaryDetails,
  updatePrimaryDetails,
  fetchSecondaryDetails,
  updateSecondaryDetails,
} = require("../controllers/userController");

// GET Requests
userRouter.get("/primaryDetails", fetchPrimaryDetails);
userRouter.get("/SecondaryDetails", fetchSecondaryDetails);

// PATCH Requests
userRouter.patch("/profilePic", updateProfilePic);
userRouter.patch("/primaryDetails", updatePrimaryDetails);
userRouter.patch("/secondaryDetails", updateSecondaryDetails);

// DELETE Requests
userRouter.delete("/", deleteAccount);
userRouter.delete("/profilePic", deleteProfilePic);

module.exports = userRouter;
