const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const projects = require("../models/projectModel");

const isRegisteredUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { userRole } = req.body;
    if (userId && userRole === "ADMIN") {
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

    const project = await projects.findById(projectId);
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

    const team = await teams.findById(teamId);
    if (!team) throw new Error("UnknownTeam");

    if (userId === team.leader.toString()) {
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

    const subTeam = await subteams.findById(subTeamId);
    if (!subTeam) throw new Error("UnknownSubTeam");

    if (userId === subTeam.leader.toString()) {
      req.subTeam = req.params;
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

const isInProject = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.params;

    const project = await projects.findById(projectId);
    if (!project) throw new Error("UnknownProject");

    if (
      userId === project.leader.toString() ||
      userId === project.guide.toString() ||
      project.members.includes(userId)
    ) {
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  isInProject,
  isTeamLeader,
  isProjectLeader,
  isSubTeamLeader,
  isRegisteredUser,
};
