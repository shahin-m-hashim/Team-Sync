const {
  removeTask,
  setAttachment,
  setSubmitTask,
  getTaskDetails,
  setTaskDetails,
  setSubmittedTaskStatus,
} = require("../services/taskService");

// GET Requests
const fetchTaskDetails = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await getTaskDetails(taskId);
    res.status(200).json(task);
  } catch (e) {
    next(e);
  }
};

// PATCH REQUESTS
const updateAttachment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { attachment } = req.body;
    await setAttachment(taskId, attachment);
    res.status(200).json({
      success: true,
      message: "Attachment updated successfully",
    });
  } catch (e) {
    next(e);
  }
};

const updateTaskDetails = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { updatedTaskDetails } = req.body;
    await setTaskDetails(taskId, updatedTaskDetails);
    res.status(200).json({
      success: true,
      message: "Task details updated successfully",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      next(new Error("TaskAlreadyExists"));
    }
    next(e);
  }
};

const submitTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { submittedTask } = req.body;
    await setSubmitTask(taskId, submittedTask);
    res.status(200).json({
      success: true,
      message: `Task submitted successfully`,
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else {
      next(e);
    }
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    await setSubmittedTaskStatus(taskId, status);
    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
    });
  } catch (e) {
    next(e);
  }
};

// DELETE Requests
const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    await removeTask(taskId);
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  submitTask,
  deleteTask,
  updateAttachment,
  fetchTaskDetails,
  updateTaskStatus,
  updateTaskDetails,
};
