const subTeamRouter = require("express").Router();

const {
  updateSubTeamIcon,
  updateSubTeamDetails,
  addSubTeamCollaborator,
} = require("../controllers/subTeamController");

// subTeam RBAC middlewares
const { isSubTeamLeader } = require("../middlewares/RBAC");

// subTeamRouter.use("/subTeams/:subTeamId", isSubTeamLeader, taskRoutes);

// POST Requests
// subTeamRouter.post("/subTeams/:subTeamId/task", isSubTeamLeader, addTask);

subTeamRouter.post(
  "/subTeams/:subTeamId/add/:username/role/:role",
  isSubTeamLeader,
  addSubTeamCollaborator
);

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

module.exports = subTeamRouter;
