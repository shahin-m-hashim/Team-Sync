const subTeamRouter = require("express").Router();

const {
  isSubTeamLeader,
  isProjectCollaborator,
} = require("../middlewares/RBAC");

const {
  addSubTeamMember,
  updateSubTeamIcon,
  deleteSubTeamIcon,
  updateSubTeamGuide,
  fetchSubTeamDetails,
  fetchSubTeamMembers,
  updateSubTeamLeader,
  updateSubTeamDetails,
  fetchSubTeamActivities,
  handleSubTeamActivities,
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
  "/subTeams/:subTeamId/member",
  isSubTeamLeader,
  addSubTeamMember
);

// PATCH Requests
subTeamRouter.patch(
  "/subTeams/:subTeamId/guide",
  isSubTeamLeader,
  updateSubTeamGuide
);
subTeamRouter.patch(
  "/subTeams/:subTeamId/leader",
  isSubTeamLeader,
  updateSubTeamLeader
);

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

subTeamRouter.patch(
  "/subTeams/:subTeamId/activities",
  isProjectCollaborator,
  handleSubTeamActivities
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
