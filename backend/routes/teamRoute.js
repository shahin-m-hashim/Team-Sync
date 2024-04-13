const teamRouter = require("express").Router();
const subTeamRoutes = require("./subTeamRoute");

const { isTeamLeader } = require("../middlewares/RBAC");
const { passTeam } = require("../middlewares/passParams");

const {
  addSubTeam,
  updateTeamIcon,
  updateTeamDetails,
  addTeamCollaborator,
} = require("../controllers/teamController");

teamRouter.use("/teams/:teamId", passTeam, subTeamRoutes);

// POST Requests
teamRouter.post(
  "/teams/:teamId/add/:username/role/:role",
  isTeamLeader,
  addTeamCollaborator
);

teamRouter.post("/teams/:teamId/subTeam", isTeamLeader, addSubTeam);

// PATCH Requests
teamRouter.patch("/teams/:teamId/icon", isTeamLeader, updateTeamIcon);
teamRouter.patch("/teams/:teamId/details", isTeamLeader, updateTeamDetails);

module.exports = teamRouter;
