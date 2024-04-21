const subTeamRouter = require("express").Router();

const {
  isSubTeamLeader,
  isProjectCollaborator,
} = require("../middlewares/RBAC");

const {
  updateSubTeamIcon,
  deleteSubTeamIcon,
  fetchSubTeamDetails,
  fetchSubTeamMembers,
  updateSubTeamDetails,
  fetchSubTeamActivities,
  addSubTeamCollaborator,
  kickSubTeamCollaborator,
} = require("../controllers/subTeamController");

// subTeamRouter.use("/subTeams/:subTeamId", passSubTeam, taskRoutes);

// GET Requests
subTeamRouter.get(
  "/subTeams/:subTeamId/details",
  isProjectCollaborator,
  fetchSubTeamDetails
);

// subTeamRouter.get(
//   "/subTeams/:subTeamId/tasks",
//   isProjectCollaborator,
//   fetchSubTeamTasks
// );

subTeamRouter.get(
  "/subTeams/:subTeamId/activities",
  isProjectCollaborator,
  fetchSubTeamActivities
);

subTeamRouter.get(
  "/subTeams/:subTeamId/members",
  isProjectCollaborator,
  fetchSubTeamMembers
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
