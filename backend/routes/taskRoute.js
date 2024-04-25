const taskRouter = require("express").Router();

const {
  isTeamGuide,
  isTeamLeader,
  isTaskAssignee,
  isProjectCollaborator,
} = require("../middlewares/RBAC");

const {
  submitTask,
  fetchTaskDetails,
  updateTaskDetails,
  updateSubmittedTask,
} = require("../controllers/taskController");

// GET Requests
taskRouter.get(
  "/tasks/:taskId/details",
  isProjectCollaborator,
  fetchTaskDetails
);

// POST Requests
taskRouter.post("/tasks/:taskId/task", isTaskAssignee, submitTask);

// PATCH Requests
taskRouter.patch("/tasks/:taskId/taskDetails", isTeamLeader, updateTaskDetails);

taskRouter.patch(
  "/tasks/:taskId/submittedTask",
  isTaskAssignee,
  updateSubmittedTask
);

// DELETE Requests

module.exports = taskRouter;
