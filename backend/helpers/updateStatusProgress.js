const { v4: uuidv4 } = require("uuid");
const teams = require("../models/teamModel");
const projects = require("../models/projectModel");
const { calculateStatus } = require("../utils/calculateStatus");

const updateStatusProgress = async (teamId, projectId, io) => {
  const team = await teams.findById(teamId).select("tasks updatedAt").populate({
    path: "tasks",
    select: "status",
  });

  if (team) {
    const completedTasksCount = team.tasks?.filter(
      (task) => task.status === "Done"
    ).length;

    const totalTasksCount = team.tasks?.length;

    team.status = calculateStatus(team.tasks?.map((task) => task.status));

    team.progress =
      Math.round((completedTasksCount / totalTasksCount) * 100) || 0;

    await team.save();
  }

  const project = await projects
    .findById(projectId)
    .select("teams updatedAt")
    .populate({
      path: "teams",
      select: "progress status",
    });

  if (project) {
    let projectProgress = 0;
    project.teams?.forEach((team) => (projectProgress += team.progress));
    project.progress = Math.round(projectProgress / project.teams?.length) || 0;

    project.status = calculateStatus(project.teams?.map((team) => team.status));

    await project.save();
  }

  const teamUpdateId = uuidv4().replace(/-/g, "");
  const projectUpdateId = uuidv4().replace(/-/g, "");

  io.emit("teams", teamUpdateId);
  io.emit("projects", projectUpdateId);
};

module.exports = updateStatusProgress;
