const Task = require("../models/taskModel");
const updateStatusProgress = require("../helpers/updateStatusProgress");

async function monitorTaskDeadline(io) {
  try {
    await checkAndUpdateTasks(io);
    setInterval(async () => {
      await checkAndUpdateTasks(io);
    }, 24 * 60 * 60 * 1000);
  } catch (error) {
    console.error("Error in monitorTaskDeadline:", error);
  }
}

async function checkAndUpdateTasks(io) {
  console.log("Checking Task Deadline");
  const tasks = await Task.find({
    status: { $ne: "Done" },
    deadline: { $lt: new Date() },
  }).select("status parent grandParent updatedAt");

  let taskUpdatedAt;

  for (const task of tasks) {
    task.status = "Stopped";
    await task.save();
    updateStatusProgress(task.parent._id, task.grandParent._id);
    taskUpdatedAt = task.updatedAt;
  }

  io.emit("tasks", taskUpdatedAt);
  io.emit("teams", taskUpdatedAt);
  io.emit("projects", taskUpdatedAt);
}

module.exports = monitorTaskDeadline;
