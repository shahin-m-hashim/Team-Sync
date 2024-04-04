const userRouter = require("express").Router();

const {
  deleteAccount,
  fetchUserDetails,
  updateProfilePic,
  deleteProfilePic,
  updatePrimaryDetails,
  updateContactDetails,
  updateSecurityDetails,
  updateSecondaryDetails,
} = require("../controllers/userController");

// GET Requests
userRouter.get("/userDetails", fetchUserDetails);

// PATCH Requests
userRouter.patch("/profilePic", updateProfilePic);
userRouter.patch("/primaryDetails", updatePrimaryDetails);
userRouter.patch("/secondaryDetails", updateSecondaryDetails);
userRouter.patch("/contactDetails", updateContactDetails);
userRouter.patch("/securityDetails", updateSecurityDetails);

// DELETE Requests
userRouter.delete("/", deleteAccount);
userRouter.delete("/profilePic", deleteProfilePic);

module.exports = userRouter;
