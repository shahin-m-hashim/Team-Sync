const subTeamRouter = require("express").Router();

const {
  isSubTeamLeader,
  isSubTeamCollaborator,
} = require("../middlewares/RBAC");

const {
  fetchSubTeam,
  updateSubTeamIcon,
  deleteSubTeamIcon,
  updateSubTeamDetails,
  fetchSubTeamSettings,
  fetchSubTeamActivities,
  addSubTeamCollaborator,
  kickSubTeamCollaborator,
} = require("../controllers/subTeamController");

// subTeamRouter.use("/subTeams/:subTeamId", passSubTeam, taskRoutes);

// GET Requests
subTeamRouter.get("/subTeams/:subTeamId", isSubTeamCollaborator, fetchSubTeam);

// subTeamRouter.get(
//   "/subTeams/:subTeamId/tasks",
//   isSubTeamCollaborator,
//   fetchSubTeamTasks
// );

subTeamRouter.get(
  "/subTeams/:subTeamId/activities",
  isSubTeamCollaborator,
  fetchSubTeamActivities
);

subTeamRouter.get(
  "/subTeams/:subTeamId/settings",
  isSubTeamLeader,
  fetchSubTeamSettings
);

// POST Requests
subTeamRouter.post(
  "/subTeams/:subTeamId/add",
  isSubTeamLeader,
  addSubTeamCollaborator
);

// subTeamRouter.post("/subTeams/:subTeamId/subTeam", isSubTeamLeader, addTask);

// PATCH Requests
subTeamRouter.patch(
  "/subTeams/:subTeamId/icon",
  isSubTeamLeader,
  updateSubTeamIcon
);
subTeamRouter.patch(
  "/subTeams/:subTeamId/details",
  isSubTeamLeader,
  updateSubTeamDetails
);

// DELETE Requests
subTeamRouter.delete(
  "/subTeams/:subTeamId/icon",
  isSubTeamLeader,
  deleteSubTeamIcon
);

subTeamRouter.delete(
  "/subTeams/:subTeamId/collaborators/:collaboratorUsername/roles/:role",
  isSubTeamLeader,
  kickSubTeamCollaborator
);

module.exports = subTeamRouter;
