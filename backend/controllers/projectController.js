const {
  getProject,
  createTeam,
  removeProject,
  setProjectIcon,
  setProjectDetails,
  getProjectSettings,
  sendProjectInvitation,
} = require("../services/projectService");

// GET Requests
const fetchProject = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.project;

    const project = await getProject(userId, projectId);
    res.status(200).json(project);
  } catch (e) {
    next(e);
  }
};

const fetchProjectSettings = async (req, res, next) => {
  try {
    const { projectId } = req.project;

    const projectSettings = await getProjectSettings(projectId);
    res.status(200).json(projectSettings);
  } catch (e) {
    next(e);
  }
};

// POST Requests
const inviteProjectMember = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { username, role, projectId } = req.project;
    await sendProjectInvitation(userId, projectId, username, role);
    res.status(200).json({
      success: true,
      message: `User ${username} invited successfully for the project ${projectId} as a ${role}`,
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

const addTeam = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamDetails } = req.body;
    const { projectId } = req.project;
    const teamId = await createTeam(userId, projectId, teamDetails);
    console.log(
      `New team ${teamId} is created for this project ${projectId} by leader ${userId}`
    );
    res.status(201).json({
      success: true,
      message: "Team created successfully",
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

// PATCH Requests
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

// DELETE Requests
const deleteProject = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.params;
    await removeProject(userId, projectId);
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addTeam,
  fetchProject,
  deleteProject,
  updateProjectIcon,
  updateProjectDetails,
  inviteProjectMember,
  fetchProjectSettings,
};
