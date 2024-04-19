const users = require("../models/userModel");
const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const projects = require("../models/projectModel");

const isRegisteredUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await users.findById(userId).select("role");
    if (user && user.role === "ADMIN") {
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

const isProjectLeader = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.params;

    const project = await projects.findById(projectId).select("leader");
    if (!project) throw new Error("UnknownProject");

    if (userId === project.leader.toString()) {
      req.project = req.params;
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

const isTeamLeader = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamId } = req.params;
    const { projectId } = req.project;

    const team = await teams.findById(teamId).select("leader parent");
    if (!team) throw new Error("UnknownTeam");

    if (
      userId === team.leader.toString() &&
      team.parent.toString() === projectId
    ) {
      req.team = req.params;
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

const isSubTeamLeader = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { subTeamId } = req.params;

    const subTeam = await subteams.findById(subTeamId).select("leader");
    if (!subTeam) throw new Error("UnknownSubTeam");

    if (userId === subTeam.leader.toString()) {
      req.subTeam = req.params;
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

const isProjectCollaborator = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.params;

    const project = await projects
      .findById(projectId)
      .select("leader guide members");
    if (!project) throw new Error("UnknownProject");

    if (
      userId === project.leader?.toString() ||
      userId === project.guide?.toString() ||
      project.members.includes(userId)
    ) {
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  isTeamLeader,
  isProjectLeader,
  isSubTeamLeader,
  isRegisteredUser,
  isProjectCollaborator,
};
