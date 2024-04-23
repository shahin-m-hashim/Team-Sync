const teamRoutes = require("./teamRoute");
const projectRouter = require("express").Router();

const {
  isProjectLeader,
  isProjectCollaborator,
} = require("../middlewares/RBAC");

const { passProject } = require("../middlewares/passParams");

const {
  addTeam,
  deleteProject,
  fetchProjectTeams,
  updateProjectIcon,
  deleteProjectIcon,
  fetchProjectMembers,
  fetchProjectDetails,
  updateProjectDetails,
  fetchProjectActivities,
  handleProjectActivities,
  kickProjectCollaborator,
  inviteProjectCollaborator,
} = require("../controllers/projectController");

projectRouter.use("/projects/:projectId", passProject, teamRoutes);

// GET Requests
projectRouter.get(
  "/projects/:projectId/details",
  isProjectCollaborator,
  fetchProjectDetails
);

projectRouter.get(
  "/projects/:projectId/activities",
  isProjectCollaborator,
  fetchProjectActivities
);

projectRouter.get(
  "/projects/:projectId/teams",
  isProjectCollaborator,
  fetchProjectTeams
);

projectRouter.get(
  "/projects/:projectId/members",
  isProjectCollaborator,
  fetchProjectMembers
);

// POST Requests
projectRouter.post(
  "/projects/:projectId/invite",
  isProjectLeader,
  inviteProjectCollaborator
);

projectRouter.post("/projects/:projectId/team", isProjectLeader, addTeam);

// PATCH Requests
projectRouter.patch(
  "/projects/:projectId/details",
  isProjectLeader,
  updateProjectDetails
);

projectRouter.patch(
  "/projects/:projectId/icon",
  isProjectLeader,
  updateProjectIcon
);

projectRouter.patch(
  "/projects/:projectId/activities",
  isProjectCollaborator,
  handleProjectActivities
);

// DELETE Requests
projectRouter.delete(
  "/projects/:projectId/icon",
  isProjectLeader,
  deleteProjectIcon
);

projectRouter.delete(
  "/projects/:projectId/collaborators/:collaboratorUsername/roles/:role",
  isProjectLeader,
  kickProjectCollaborator
);

projectRouter.delete("/projects/:projectId", isProjectLeader, deleteProject);

module.exports = projectRouter;
