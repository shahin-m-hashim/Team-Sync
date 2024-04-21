const {
  setTeamIcon,
  createSubTeam,
  getTeamDetails,
  removeTeamIcon,
  setTeamDetails,
  getTeamMembers,
  getTeamSubTeams,
  getTeamActivities,
  setTeamCollaborator,
  removeTeamCollaborator,
} = require("../services/teamService");

// GET Requests
const fetchTeamDetails = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const project = await getTeamDetails(teamId);
    res.status(200).json(project);
  } catch (e) {
    next(e);
  }
};

const fetchTeamActivities = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const activities = await getTeamActivities(teamId);
    res.status(200).json(activities);
  } catch (e) {
    next(e);
  }
};

const fetchTeamMembers = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { members } = await getTeamMembers(teamId);
    res.status(200).json(members);
  } catch (e) {
    next(e);
  }
};

const fetchTeamSubTeams = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamId } = req.params;

    const subTeams = await getTeamSubTeams(teamId, userId);
    res.status(200).json(subTeams);
  } catch (e) {
    next(e);
  }
};

// POST REQUESTS
const addTeamCollaborator = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamId } = req.params;
    const { username, role } = req.body;
    await setTeamCollaborator(userId, teamId, username, role);
    res.status(200).json({
      success: true,
      message: `User ${username} added successfully to team ${teamId} as a ${role}`,
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

const addSubTeam = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamId } = req.params;
    const { subTeamDetails } = req.body;
    const subTeamId = await createSubTeam(userId, teamId, subTeamDetails);
    console.log(
      `New sub team ${subTeamId} is created for team ${teamId} by leader ${userId}`
    );
    res.status(201).json({
      success: true,
      message: "Sub team created successfully",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      next(new Error("SubTeamAlreadyExists"));
    }
    next(e);
  }
};

// PATCH REQUESTS
const updateTeamDetails = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { updatedTeamDetails } = req.body;
    await setTeamDetails(teamId, updatedTeamDetails);
    res.status(200).json({
      success: true,
      message: "Team details updated successfully",
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

const updateTeamIcon = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { updatedTeamIcon } = req.body;
    await setTeamIcon(teamId, updatedTeamIcon);
    res
      .status(200)
      .json({ success: true, message: "Team icon updated successfully" });
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
const deleteTeamIcon = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    await removeTeamIcon(teamId);
    res.status(200).json({
      success: true,
      message: "Team icon deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

const kickTeamCollaborator = async (req, res, next) => {
  try {
    const { teamId, collaboratorUsername, role } = req.params;
    await removeTeamCollaborator(teamId, collaboratorUsername, role);
    res.status(200).json({
      success: true,
      message: "Team Collaborator kicked successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addSubTeam,
  updateTeamIcon,
  deleteTeamIcon,
  fetchTeamDetails,
  fetchTeamMembers,
  fetchTeamSubTeams,
  updateTeamDetails,
  fetchTeamActivities,
  addTeamCollaborator,
  kickTeamCollaborator,
};
