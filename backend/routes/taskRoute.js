const taskRouter = require("express").Router();

const {
  isTeamLeader,
  isTaskAssignee,
  isProjectCollaborator,
} = require("../middlewares/RBAC");

const {
  submitTask,
  deleteTask,
  fetchTaskDetails,
  updateAttachment,
  updateTaskStatus,
  updateTaskDetails,
} = require("../controllers/taskController");

// GET Requests
taskRouter.get("/tasks/:taskId", isProjectCollaborator, fetchTaskDetails);

// PATCH Requests
taskRouter.patch("/tasks/:taskId", isTeamLeader, updateTaskDetails);

taskRouter.patch("/tasks/:taskId/submit", isTaskAssignee, submitTask);

taskRouter.patch("/tasks/:taskId/status", isTeamLeader, updateTaskStatus);

taskRouter.patch("/tasks/:taskId/attachment", isTeamLeader, updateAttachment);

// DELETE Requests
taskRouter.delete("/tasks/:taskId", isTeamLeader, deleteTask);

module.exports = taskRouter;
