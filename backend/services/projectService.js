const moment = require("moment");
const jwt = require("jsonwebtoken");
const { io } = require("../server");
const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const projects = require("../models/projectModel");
const activities = require("../models/activityModel");
const invitations = require("../models/invitationModel");
const notifications = require("../models/notificationModel");

// GET
const getProjectDetails = async (projectId) => {
  let collaborators = [];

  const project = await projects
    .findById(projectId)
    .select("icon name description leader guide members NOC")
    .populate({
      path: "leader guide members",
      select: "username profilePic id",
    });

  if (!project) throw new Error("UnknownProject");

  collaborators.push({
    id: project.leader?.id,
    role: "Leader",
    username: project.leader?.username,
    profilePic: project.leader?.profilePic,
  });

  project.guide &&
    collaborators.push({
      id: project.guide?.id,
      role: "Guide",
      username: project.guide?.username,
      profilePic: project.guide?.profilePic,
    });

  project.members &&
    project.members.forEach((member) => {
      collaborators.push({
        id: member.id,
        role: "Member",
        username: member?.username,
        profilePic: member?.profilePic,
      });
    });

  return {
    icon: project.icon,
    name: project.name,
    description: project.description,
    NOC: project.NOC,
    collaborators,
  };
};

const getProjectMembers = async (projectId) => {
  const projectMembers = await projects
    .findById(projectId)
    .select("members -_id")
    .populate({
      path: "members",
      select: "username profilePic tag fname",
    });

  if (!projectMembers) throw new Error("UnknownProject");

  return projectMembers;
};

const getProjectActivities = async (projectId) => {
  const project = await projects
    .findById(projectId)
    .select("activities")
    .populate({
      path: "activities",
      select: "-type -__v -updatedAt",
    });

  if (!project) throw new Error("UnknownProject");

  const formattedProjectActivities = project.activities.map((activity) => {
    return {
      ...activity.toObject(),
      time: moment(activity.createdAt).format("hh:mm A"),
      date: moment(activity.createdAt).format("DD/MM/YYYY"),
    };
  });

  return formattedProjectActivities;
};

const getProjectTeams = async (userId, projectId) => {
  const project = await projects.findById(projectId).select("teams").populate({
    path: "teams",
    select: "parent name createdAt icon progress status leader guide members",
  });
  if (!project) throw new Error("UnknownProject");

  const formattedTeams = project.teams.map((team) => {
    let role = "Member";

    const createdAt = moment(team.createdAt).format("DD/MM/YYYY");

    if (team.guide?.toString() === userId) role = "Guide";
    if (team.leader?.toString() === userId) role = "Leader";

    return {
      role,
      createdAt,
      id: team._id,
      name: team.name,
      icon: team.icon,
      parent: team.parent,
      status: team.status,
      progress: team.progress,
    };
  });

  return formattedTeams;
};

// POST
const sendProjectInvitation = async (userId, projectId, username, role) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const project = await projects
      .findById(projectId)
      .select("leader guide members invitations name")
      .populate({
        path: "leader guide members invitations",
        select: "username to project status",
      })
      .session(session);

    if (!project) throw new Error("UnknownProject");

    const invitedUser = await users
      .findOne({ username })
      .select("username invitations")
      .session(session);
    if (!invitedUser) throw new Error("UnknownInvitedUser");

    if (project.guide?.username === username)
      throw new Error("UserAlreadyInProjectAsAGuide");

    if (project.members?.some((member) => member?.username === username)) {
      throw new Error("UserAlreadyInProjectAsAMember");
    }

    const existingInvitation = project.invitations.find(
      (invitation) =>
        invitation.to.toString() === invitedUser.id.toString() &&
        invitation.project.toString() === projectId &&
        ["pending", "accepted"].includes(invitation.status)
    );

    if (existingInvitation) throw new Error("UserAlreadyInvited");

    const inviteAcceptToken = jwt.sign(
      { invitedUserId: invitedUser._id },
      process.env.JWT_INVITATION_KEY,
      {
        expiresIn: "24h",
      }
    );

    const invitationMessage = `You have been invited to join the project ${project?.name} as a ${role} by its leader ${project.leader.username}.`;
    const newInvitation = await invitations.create(
      [
        {
          role,
          from: userId,
          status: "pending",
          project: projectId,
          to: invitedUser._id,
          message: invitationMessage,
          authenticity: inviteAcceptToken,
        },
      ],
      { session }
    );

    project.invitations.push(newInvitation[0]._id);
    await project.save({ session });

    invitedUser.invitations.push(newInvitation[0]._id);
    await invitedUser.save({ session });

    io.emit("invitations", newInvitation[0]._id);

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
          entity: "project",
          image: newTeam[0].icon,
          type: "teamAddedToProject",
          message: `A new team ${newTeam[0].name} is added to this project by leader ${project.leader.username}.`,
        },
      ],
      { session }
    );

    project.activities.push(newActivity[0]._id);

    await Promise.all([user.save({ session }), project.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    io.emit("teams", newTeam[0]._id);
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
const setProjectDetails = async (projectId, updatedProjectDetails) => {
  const project = await projects.findById(projectId);
  if (!project) throw new Error("UnknownProject");
  const { name, description } = updatedProjectDetails;
  project.name = name;
  project.description = description;
  await project.save();

  io.emit("projects", (project.id + project.updatedAt).toString());
};

const setProjectIcon = async (projectId, updatedProjectIcon) => {
  const project = await projects.findById(projectId);
  if (!project) throw new Error("UnknownProject");
  project.icon = updatedProjectIcon;
  await project.save();

  io.emit("projects", (project.id + project.updatedAt).toString());

  return project.icon;
};

// DELETE
const removeProjectIcon = async (projectId) => {
  const project = await projects.findById(projectId);
  if (!project) throw new Error("UnknownProject");
  project.icon = "";
  await project.save();

  io.emit("projects", (project.id + project.updatedAt).toString());
};

const removeCollaborator = async (projectId, collaboratorUsername, role) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const collaborator = await users
      .findOne({ username: collaboratorUsername })
      .session(session);
    if (!collaborator) throw new Error("UnknownUser");

    const project = await projects
      .findById(projectId)
      .populate({
        path: "leader guide members invitations",
        select: "username project",
      })
      .session(session);
    if (!project) throw new Error("UnknownProject");

    let notificationMessage = "";
    if (role === "guide" && project.guide?.username === collaboratorUsername) {
      project.guide = null;
      collaborator.projects = collaborator.projects.pull(projectId);
      project.invitations = project.invitations.filter(
        (invitation) =>
          invitation.project.toString() !== projectId ||
          invitation.to.toString() !== collaborator._id.toString()
      );

      notificationMessage = `You are no longer a guide of the project ${project.name}.`;
    } else if (
      role === "member" &&
      project.members?.some(
        (member) => member.username === collaboratorUsername
      )
    ) {
      project.members.pull(collaborator._id);
      collaborator.projects = collaborator.projects.pull(projectId);
      project.invitations = project.invitations.filter(
        (invitation) =>
          invitation.project.toString() !== projectId ||
          invitation.to.toString() !== collaborator._id.toString()
      );

      notificationMessage = `You are no longer a member of the project ${project.name}.`;

      const newActivity = await activities.create(
        [
          {
            entity: "project",
            image: collaborator.profilePic,
            type: "projectCollaboratorRemoved",
            message: `${collaboratorUsername} who was a ${role} of this project was removed by its leader ${project.leader?.username}`,
          },
        ],
        { session }
      );
      project.activities.push(newActivity[0]._id);
    } else {
      throw new Error("UnknownCollaborator");
    }

    const newNotification = await notifications.create(
      [
        {
          from: project.leader,
          to: collaborator.id,
          type: "kickedFromProject",
          message: notificationMessage,
          isRead: false,
        },
      ],
      { session }
    );

    collaborator.notifications.push(newNotification[0]._id);

    await Promise.all([
      project.save({ session }),
      collaborator.save({ session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    io.emit("projects", (project.id + project.updatedAt).toString());
    io.emit("notifications", newNotification[0]._id);
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

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
  getProjectTeams,
  getProjectDetails,
  removeProjectIcon,
  setProjectDetails,
  getProjectMembers,
  removeCollaborator,
  getProjectActivities,
  sendProjectInvitation,
};
