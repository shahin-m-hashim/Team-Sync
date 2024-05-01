const teams = require("../models/teamModel");
const projects = require("../models/projectModel");
const { calculateStatus } = require("../utils/calculateStatus");

const updateStatusProgress = async (teamId, projectId) => {
  const team = await teams.findById(teamId).select("tasks").populate({
    path: "tasks",
    select: "status",
  });

  const completedTasksCount = team.tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const totalTasksCount = team.tasks.length;

  team.status = calculateStatus(team.tasks.map((task) => task.status));
  team.progress = Math.round((completedTasksCount / totalTasksCount) * 100);

  await team.save();

  const project = await projects.findById(projectId).select("teams").populate({
    path: "teams",
    select: "progress status",
  });

  let projectProgress = 0;
  project.teams.forEach((team) => (projectProgress += team.progress));
  project.progress = Math.round(projectProgress / project.teams.length);

  project.status = calculateStatus(project.teams.map((team) => team.status));

  await project.save();
};

module.exports = updateStatusProgress;
