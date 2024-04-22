const teamRouter = require("express").Router();
const subTeamRoutes = require("./subTeamRoute");

const { passTeam } = require("../middlewares/passParams");
const { isTeamLeader, isProjectCollaborator } = require("../middlewares/RBAC");

const {
  addSubTeam,
  addTeamMember,
  updateTeamIcon,
  deleteTeamIcon,
  updateTeamGuide,
  fetchTeamDetails,
  fetchTeamMembers,
  updateTeamLeader,
  fetchTeamSubTeams,
  updateTeamDetails,
  fetchTeamActivities,
  handleTeamActivities,
  kickTeamCollaborator,
} = require("../controllers/teamController");

teamRouter.use("/teams/:teamId", passTeam, subTeamRoutes);

// GET Requests
teamRouter.get(
  "/teams/:teamId/details",
  isProjectCollaborator,
  fetchTeamDetails
);

teamRouter.get(
  "/teams/:teamId/subTeams",
  isProjectCollaborator,
  fetchTeamSubTeams
);

teamRouter.get(
  "/teams/:teamId/activities",
  isProjectCollaborator,
  fetchTeamActivities
);

teamRouter.get(
  "/teams/:teamId/members",
  isProjectCollaborator,
  fetchTeamMembers
);

// POST Requests
teamRouter.post("/teams/:teamId/subTeam", isTeamLeader, addSubTeam);
teamRouter.post("/teams/:teamId/member", isTeamLeader, addTeamMember);

// PATCH Requests
teamRouter.patch("/teams/:teamId/icon", isTeamLeader, updateTeamIcon);
teamRouter.patch("/teams/:teamId/details", isTeamLeader, updateTeamDetails);

teamRouter.patch("/teams/:teamId/guide", isTeamLeader, updateTeamGuide);
teamRouter.patch("/teams/:teamId/leader", isTeamLeader, updateTeamLeader);

teamRouter.patch(
  "/teams/:teamId/activities",
  isProjectCollaborator,
  handleTeamActivities
);

// DELETE Requests
teamRouter.delete("/teams/:teamId/icon", isTeamLeader, deleteTeamIcon);

teamRouter.delete(
  "/teams/:teamId/collaborators/:collaboratorUsername/roles/:role",
  isTeamLeader,
  kickTeamCollaborator
);

module.exports = teamRouter;
