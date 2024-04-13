const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const projects = require("../models/projectModel");
const activities = require("../models/activityModel");
const invitations = require("../models/invitationModel");
const notifications = require("../models/notificationModel");

// POST
const sendProjectInvitation = async (userId, projectId, username, role) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const project = await projects
      .findById(projectId)
      .populate("leader")
      .populate("guide")
      .populate("members.member")
      .session(session);

    if (!project) throw new Error("UnknownProject");

    const invitedUser = await users.findOne({ username }).session(session);
    if (!invitedUser) throw new Error("UnknownInvitedUser");

    if (project.guide?.username === username)
      throw new Error("UserAlreadyInProjectAsAGuide");

    if (project.members.some((member) => member.member.username === username)) {
      throw new Error("UserAlreadyInProject");
    }

    const existingInvitation = await invitations.findOne({
      project: projectId,
      invitedUser: invitedUser._id,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingInvitation) {
      throw new Error("UserAlreadyInvited");
    }

    const inviteAcceptToken = jwt.sign(
      { invitedUserId: invitedUser._id },
      process.env.JWT_INVITATION_KEY,
      {
        expiresIn: "24h",
      }
    );

    const invitationMessage = `You have been invited to join the project ${project.name} as a ${role} by its leader ${project.leader.username}.`;
    const newInvitation = await invitations.create(
      [
        {
          authenticity: inviteAcceptToken,
          project: projectId,
          invitedBy: userId,
          invitedUser: invitedUser._id,
          role,
          message: invitationMessage,
          status: "pending",
        },
      ],
      { session }
    );

    project.invitations.push(newInvitation[0]._id);
    await project.save({ session });

    invitedUser.invitations.push(newInvitation[0]._id);
    await invitedUser.save({ session });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const createTeam = async (userId, projectId, teamDetails) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const user = await users.findById(userId).session(session);
    if (!user) throw new Error("UnknownUser");

    const project = await projects
      .findById(projectId)
      .populate("leader")
      .session(session);
    if (!project) throw new Error("UnknownProject");

    const newTeam = await teams.create(
      [
        {
          ...teamDetails,
          leader: userId,
          parent: projectId,
          guide: project.guide,
        },
      ],
      { session }
    );

    user.teams.push(newTeam[0]._id);
    project.teams.push(newTeam[0]._id);

    const newActivity = await activities.create(
      [
        {
          project: projectId,
          type: "teamAdded",
          message: `A new team ${newTeam[0].name} is added to this project ${project.name} by leader ${project.leader.username}.`,
        },
      ],
      { session }
    );

    project.activities.push(newActivity[0]._id);

    await Promise.all([user.save({ session }), project.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    return newTeam[0]._id;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

// PATCH
const setProjectDetails = async (projectId, newProjectDetails) => {
  const project = await projects.findById(projectId);
  if (!project) throw new Error("UnknownProject");
  const { name, description } = newProjectDetails;
  project.name = name;
  project.description = description;
  await project.save();
};

const setProjectIcon = async (projectId, newProjectIcon) => {
  const project = await projects.findById(projectId);
  if (!project) throw new Error("UnknownProject");
  project.icon = newProjectIcon;
  await project.save();
  return project.icon;
};

// DELETE
const removeProject = async (userId, projectId) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const user = await users.findById(userId).session(session);
    if (!user) throw new Error("UnknownUser");

    const project = await projects.findById(projectId).session(session);
    if (!project) throw new Error("UnknownProject");

    const collaborators = [...project.members, project.guide];

    for (const collaboratorId of collaborators) {
      const collaborator = await users
        .findById(collaboratorId)
        .session(session);
      if (collaborator) {
        const newNotification = new notifications({
          user: collaboratorId,
          type: "projectDeleted",
          message: `We are sorry to inform you that the project ${project.name} you were in was deleted by its leader ${user.username}. You can no longer access this project. All its teams, subteams, and tasks are all gone.`,
          isRead: false,
        });
        await newNotification.save({ session });

        collaborator.notifications.push(newNotification._id);
        collaborator.projects = collaborator.projects.filter(
          (projId) => projId.toString() !== projectId.toString()
        );
        await collaborator.save({ session });
      }
    }

    // Find and remove related subteams
    const subTeamsToDelete = await subteams
      .find({ grandParent: projectId })
      .session(session);
    const subTeamIdsToDelete = subTeamsToDelete.map((subTeam) => subTeam._id);
    await users
      .updateMany(
        { subTeams: { $in: subTeamIdsToDelete } },
        { $pull: { subTeams: { $in: subTeamIdsToDelete } } }
      )
      .session(session);
    await subteams.deleteMany({ grandParent: projectId }).session(session);

    // Find and remove related teams
    const teamsToDelete = await teams
      .find({ parent: projectId })
      .session(session);
    const teamIdsToDelete = teamsToDelete.map((team) => team._id);
    await users
      .updateMany(
        { teams: { $in: teamIdsToDelete } },
        { $pull: { teams: { $in: teamIdsToDelete } } }
      )
      .session(session);
    await teams.deleteMany({ parent: projectId }).session(session);

    // Delete the project itself
    await projects.findByIdAndDelete(projectId).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

module.exports = {
  createTeam,
  removeProject,
  setProjectIcon,
  setProjectDetails,
  sendProjectInvitation,
};
