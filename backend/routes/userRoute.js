const userRouter = require("express").Router();

const {
  addProject,
  deleteAccount,
  fetchUserDetails,
  updateProfilePic,
  deleteProfilePic,
  fetchAllUserProjects,
  updatePrimaryDetails,
  updateContactDetails,
  updateSecurityDetails,
  updateSecondaryDetails,
} = require("../controllers/userController");

// project RBAC middlewares
const { isRegisteredUser } = require("../middlewares/RBAC");

// POST Requests
userRouter.post("/project", isRegisteredUser, addProject);

// GET Requests
userRouter.get("/userDetails", fetchUserDetails);
userRouter.get("/allUserProjects", fetchAllUserProjects);

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
