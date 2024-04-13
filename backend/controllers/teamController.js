const {
  setTeamIcon,
  createSubTeam,
  setTeamDetails,
  setTeamCollaborator,
} = require("../services/teamService");

// POST REQUESTS
const addSubTeam = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamId } = req.team;
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

const addTeamCollaborator = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { username, role, teamId } = req.team;
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

// PATCH REQUESTS
const updateTeamDetails = async (req, res, next) => {
  try {
    const { teamId } = req.team;
    const { newTeamDetails } = req.body;
    await setTeamDetails(teamId, newTeamDetails);
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
    const { teamId } = req.team;
    const { newTeamIcon } = req.body;
    const updatedTeamIcon = await setTeamIcon(teamId, newTeamIcon);
    res.status(200).json({ updatedTeamIcon });
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
  addSubTeam,
  updateTeamIcon,
  updateTeamDetails,
  addTeamCollaborator,
};
