const userRouter = require("express").Router();

const {
  addProject,
  deleteAccount,
  fetchUserDetails,
  updateProfilePic,
  deleteProfilePic,
  handleInvitation,
  fetchAllUserTeams,
  fetchAllUserSubTeams,
  fetchAllUserProjects,
  updatePrimaryDetails,
  updateContactDetails,
  updateSecurityDetails,
  updateSecondaryDetails,
  fetchAllUserInvitations,
  fetchAllUserNotifications,
} = require("../controllers/userController");

// project RBAC middlewares
const { isRegisteredUser } = require("../middlewares/RBAC");

// POST Requests
userRouter.post("/project", isRegisteredUser, addProject);

// GET Requests
userRouter.get("/userDetails", fetchUserDetails);
userRouter.get("/allUserTeams", fetchAllUserTeams);
userRouter.get("/allUserProjects", fetchAllUserProjects);
userRouter.get("/allUserSubTeams", fetchAllUserSubTeams);
userRouter.get("/allUserInvitations", fetchAllUserInvitations);
userRouter.get("/allUserNotifications", fetchAllUserNotifications);

// PATCH Requests
userRouter.patch("/profilePic", updateProfilePic);
userRouter.patch("/primaryDetails", updatePrimaryDetails);
userRouter.patch("/secondaryDetails", updateSecondaryDetails);
userRouter.patch("/contactDetails", updateContactDetails);
userRouter.patch("/securityDetails", updateSecurityDetails);

userRouter.patch("/invitations/:inviteId/status/:status", handleInvitation);

// DELETE Requests
userRouter.delete("/", deleteAccount);
userRouter.delete("/profilePic", deleteProfilePic);

module.exports = userRouter;
