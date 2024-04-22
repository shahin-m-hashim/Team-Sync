const {
  createTeam,
  removeProject,
  setProjectIcon,
  getProjectTeams,
  getProjectDetails,
  removeProjectIcon,
  setProjectDetails,
  getProjectMembers,
  setProjectActivities,
  getProjectActivities,
  sendProjectInvitation,
  removeProjectCollaborator,
} = require("../services/projectService");

// GET Requests
const fetchProjectDetails = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await getProjectDetails(projectId);
    res.status(200).json(project);
  } catch (e) {
    next(e);
  }
};

const fetchProjectMembers = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { members } = await getProjectMembers(projectId);
    res.status(200).json(members);
  } catch (e) {
    next(e);
  }
};

const fetchProjectActivities = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.params;
    const activities = await getProjectActivities(userId, projectId);
    res.status(200).json(activities);
  } catch (e) {
    next(e);
  }
};

const fetchProjectTeams = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.params;
    const teams = await getProjectTeams(userId, projectId);
    res.status(200).json(teams);
  } catch (e) {
    next(e);
  }
};

// POST Requests
const inviteProjectCollaborator = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.params;
    const { username, role } = req.body;
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
    const { projectId } = req.params;
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
    const { projectId } = req.params;
    const { updatedProjectDetails } = req.body;

    await setProjectDetails(projectId, updatedProjectDetails);
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

const handleProjectActivities = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.params;

    await setProjectActivities(userId, projectId);
    res.status(200).json({
      success: true,
      message: "Project activities updated successfully",
    });
  } catch (e) {
    next(e);
  }
};

const updateProjectIcon = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { updatedProjectIcon } = req.body;
    await setProjectIcon(projectId, updatedProjectIcon);
    res.status(200).json({
      success: true,
      message: "Project icon updated successfully",
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

// DELETE Requests
const deleteProjectIcon = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    await removeProjectIcon(projectId);
    res.status(200).json({
      success: true,
      message: "Project icon deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

const kickProjectCollaborator = async (req, res, next) => {
  try {
    const { projectId, collaboratorUsername, role } = req.params;
    await removeProjectCollaborator(projectId, collaboratorUsername, role);
    res.status(200).json({
      success: true,
      message: "Collaborator kicked successfully",
    });
  } catch (e) {
    next(e);
  }
};

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
  deleteProject,
  fetchProjectTeams,
  updateProjectIcon,
  deleteProjectIcon,
  fetchProjectMembers,
  fetchProjectDetails,
  updateProjectDetails,
  fetchProjectActivities,
  handleProjectActivities,
  kickProjectCollaborator,
  inviteProjectCollaborator,
};
