const {
  getTaskDetails,
  setTaskDetails,
  submitGivenTask,
  setSubmittedTask,
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

// POST REQUESTS
const submitTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { submittedTask } = req.body;
    await submitGivenTask(taskId, submittedTask);
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

// PATCH REQUESTS
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
      next(new Error("TeamAlreadyExists"));
    }
    next(e);
  }
};

const updateSubmittedTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { submittedTask } = req.body;
    await setSubmittedTask(taskId, submittedTask);
    res.status(200).json({
      success: true,
      message: "Submitted task updated successfully",
    });
  } catch (e) {
    next(e);
  }
};

// DELETE Requests

module.exports = {
  submitTask,
  fetchTaskDetails,
  updateTaskDetails,
  updateSubmittedTask,
};
