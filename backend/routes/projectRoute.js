const projectRouter = require("express").Router();

const {
  updateProjectIcon,
  inviteProjectMember,
  updateProjectDetails,
} = require("../controllers/projectController");

// project RBAC middlewares
const { isProjectLeader } = require("../middlewares/RBAC");

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

projectRouter.post(
  "/projects/:projectId/invite/:username/role/:role",
  isProjectLeader,
  inviteProjectMember
);

module.exports = projectRouter;
