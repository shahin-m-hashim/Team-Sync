const taskRoutes = require("./taskRoute");
const teamRouter = require("express").Router();

const { passTeam } = require("../middlewares/passParams");
const { isTeamLeader, isProjectCollaborator } = require("../middlewares/RBAC");

const {
  addTask,
  addTeamMember,
  updateTeamIcon,
  deleteTeamIcon,
  fetchTeamTasks,
  updateTeamGuide,
  fetchTeamDetails,
  fetchTeamMembers,
  updateTeamLeader,
  updateTeamDetails,
  fetchTeamActivities,
  handleTeamActivities,
  kickTeamCollaborator,
} = require("../controllers/teamController");

teamRouter.use("/teams/:teamId", passTeam, taskRoutes);

// GET Requests
teamRouter.get(
  "/teams/:teamId/details",
  isProjectCollaborator,
  fetchTeamDetails
);

teamRouter.get(
  "/teams/:teamId/activities",
  isProjectCollaborator,
  fetchTeamActivities
);

teamRouter.get("/teams/:teamId/tasks", isProjectCollaborator, fetchTeamTasks);

teamRouter.get(
  "/teams/:teamId/members",
  isProjectCollaborator,
  fetchTeamMembers
);

// POST Requests
teamRouter.post("/teams/:teamId/task", isTeamLeader, addTask);
teamRouter.post("/teams/:teamId/member", isTeamLeader, addTeamMember);

// PATCH Requests
teamRouter.patch("/teams/:teamId/guide", isTeamLeader, updateTeamGuide);
teamRouter.patch("/teams/:teamId/leader", isTeamLeader, updateTeamLeader);

teamRouter.patch("/teams/:teamId/icon", isTeamLeader, updateTeamIcon);
teamRouter.patch("/teams/:teamId/details", isTeamLeader, updateTeamDetails);

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
