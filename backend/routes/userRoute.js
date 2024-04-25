const userRouter = require("express").Router();

const {
  addProject,
  deleteAccount,
  fetchUserDetails,
  updateProfilePic,
  deleteProfilePic,
  acceptInvitation,
  rejectInvitation,
  fetchAllUserTeams,
  handleNotifications,
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
userRouter.get("/user", fetchUserDetails);
userRouter.get("/teams", fetchAllUserTeams);
userRouter.get("/projects", fetchAllUserProjects);
userRouter.get("/invitations", fetchAllUserInvitations);
userRouter.get("/notifications", fetchAllUserNotifications);

// PATCH Requests
userRouter.patch("/profilePic", updateProfilePic);
userRouter.patch("/invitation/accept", acceptInvitation);
userRouter.patch("/invitation/reject", rejectInvitation);
userRouter.patch("/notifications", handleNotifications);
userRouter.patch("/primaryDetails", updatePrimaryDetails);
userRouter.patch("/contactDetails", updateContactDetails);
userRouter.patch("/securityDetails", updateSecurityDetails);
userRouter.patch("/secondaryDetails", updateSecondaryDetails);

// DELETE Requests
userRouter.delete("/", deleteAccount);
userRouter.delete("/profilePic", deleteProfilePic);

module.exports = userRouter;
