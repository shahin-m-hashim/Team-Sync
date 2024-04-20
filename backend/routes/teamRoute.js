const teamRouter = require("express").Router();
const subTeamRoutes = require("./subTeamRoute");

const { passTeam } = require("../middlewares/passParams");
const { isTeamLeader, isTeamCollaborator } = require("../middlewares/RBAC");

const {
  fetchTeam,
  addSubTeam,
  updateTeamIcon,
  deleteTeamIcon,
  fetchTeamSubTeams,
  updateTeamDetails,
  fetchTeamSettings,
  fetchTeamActivities,
  addTeamCollaborator,
  kickTeamCollaborator,
} = require("../controllers/teamController");

teamRouter.use("/teams/:teamId", passTeam, subTeamRoutes);

// GET Requests
teamRouter.get("/teams/:teamId", isTeamCollaborator, fetchTeam);

teamRouter.get(
  "/teams/:teamId/subTeams",
  isTeamCollaborator,
  fetchTeamSubTeams
);

teamRouter.get(
  "/teams/:teamId/activities",
  isTeamCollaborator,
  fetchTeamActivities
);

teamRouter.get("/teams/:teamId/settings", isTeamLeader, fetchTeamSettings);

// POST Requests
teamRouter.post("/teams/:teamId/add", isTeamLeader, addTeamCollaborator);

teamRouter.post("/teams/:teamId/subTeam", isTeamLeader, addSubTeam);

// PATCH Requests
teamRouter.patch("/teams/:teamId/icon", isTeamLeader, updateTeamIcon);
teamRouter.patch("/teams/:teamId/details", isTeamLeader, updateTeamDetails);

// DELETE Requests
teamRouter.delete("/teams/:teamId/icon", isTeamLeader, deleteTeamIcon);

teamRouter.delete(
  "/teams/:teamId/collaborators/:collaboratorUsername/roles/:role",
  isTeamLeader,
  kickTeamCollaborator
);

module.exports = teamRouter;
