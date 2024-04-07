const {
  setProjectIcon,
  setProjectDetails,
  sendProjectInvitation,
} = require("../services/projectService");

const updateProjectDetails = async (req, res, next) => {
  try {
    const { projectId } = req.project;
    const { newProjectDetails } = req.body;
    await setProjectDetails(projectId, newProjectDetails);
    res.status(200).json({
      success: true,
      message: "Project details updated successfully",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      next(new Error("ProjectAlreadyExists"));
    }
    next(e);
  }
};

const updateProjectIcon = async (req, res, next) => {
  try {
    const { projectId } = req.project;
    const { newProjectIcon } = req.body;
    const updatedProjectIcon = await setProjectIcon(projectId, newProjectIcon);
    res.status(200).json({ updatedProjectIcon });
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

const inviteProjectMember = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { username, role, projectId } = req.project;
    await sendProjectInvitation(userId, projectId, username, role);
    res.status(200).json({
      success: true,
      message: `User ${username} invited successfully for project ${projectId} as a ${role}`,
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

module.exports = {
  updateProjectIcon,
  updateProjectDetails,
  inviteProjectMember,
};
