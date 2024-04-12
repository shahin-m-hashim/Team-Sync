const teamRoutes = require("./teamRoute");
const projectRouter = require("express").Router();

const { isProjectLeader } = require("../middlewares/RBAC");
const { passProject } = require("../middlewares/passParams");

const {
  addTeam,
  deleteProject,
  updateProjectIcon,
  inviteProjectMember,
  updateProjectDetails,
} = require("../controllers/projectController");

projectRouter.use("/projects/:projectId", passProject, teamRoutes);

// POST Requests
projectRouter.post(
  "/projects/:projectId/invite/:username/role/:role",
  isProjectLeader,
  inviteProjectMember
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

// DELETE Requests
projectRouter.delete("/projects/:projectId", isProjectLeader, deleteProject);

module.exports = projectRouter;
