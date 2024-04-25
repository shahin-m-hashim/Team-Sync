const users = require("../models/userModel");
const teams = require("../models/teamModel");
const tasks = require("../models/taskModel");
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

const isProjectCollaborator = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.project;

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

const isTeamLeader = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamId } = req.params;
    const { projectId } = req.project;

    const team = await teams.findById(teamId).select("leader parent");
    if (!team) throw new Error("UnknownTeam");

    if (
      userId === team.leader.toString() &&
      projectId === team.parent.toString()
    ) {
      req.team = req.params;
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

const isTeamGuide = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamId } = req.params;

    const team = await teams.findById(teamId).select("guide");
    if (!team) throw new Error("UnknownTeam");

    if (userId === team.guide.toString()) {
      req.team = req.params;
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

const isTaskAssignee = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { taskId } = req.params;

    const task = await tasks.findById(taskId).select("assignee");
    if (!task) throw new Error("UnknownTask");

    if (userId === task.assignee.toString()) {
      req.task = req.params;
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  isTeamGuide,
  isTeamLeader,
  isTaskAssignee,
  isProjectLeader,
  isRegisteredUser,
  isProjectCollaborator,
};
