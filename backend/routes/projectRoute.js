const teamRoutes = require("./teamRoute");
const projectRouter = require("express").Router();
const { isProjectLeader } = require("../middlewares/RBAC");

const {
  addTeam,
  updateProjectIcon,
  inviteProjectMember,
  updateProjectDetails,
} = require("../controllers/projectController");

projectRouter.use("/projects/:projectId", teamRoutes);

// POST Requests
projectRouter.post("/projects/:projectId/team", isProjectLeader, addTeam);

projectRouter.post(
  "/projects/:projectId/invite/:username/role/:role",
  isProjectLeader,
  inviteProjectMember
);

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

module.exports = projectRouter;
