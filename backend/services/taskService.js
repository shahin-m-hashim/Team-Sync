const { io } = require("../server");
const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const tasks = require("../models/taskModel");
const activities = require("../models/activityModel");
const notifications = require("../models/notificationModel");

// GET
const getTaskDetails = async (taskId) => {
  const task = await tasks.findById(taskId).select("-__v -createdAt");
  if (!task) throw new Error("UnknownTask");
};

// POST
const submitGivenTask = async (taskId, submittedTask) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const task = await tasks
      .findById(taskId)
      .select("submittedTask parent")
      .populate({
        path: "parent",
        select: "leader",
      })
      .session(session);
    if (!task) throw new Error("UnknownTask");

    const teamLeader = await users
      .findById(task.parent.leader)
      .select("username notifications")
      .session(session);

    task.submittedTask = submittedTask;

    const newNotification = await notifications.create(
      [
        {
          user: teamLeader.id,
          type: "taskSubmitted",
          message: `The task ${task.name} is submitted by ${teamLeader.username}.`,
        },
      ],
      { session }
    );

    teamLeader.notifications.push(newNotification[0].id);

    await Promise.all([task.save({ session }), teamLeader.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    io.emit("notifications", (teamLeader.id + teamLeader.updatedAt).toString());
  } catch (e) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw e;
  }
};

// PATCH
const setTaskDetails = async (taskId, updatedTaskDetails) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const task = await tasks
      .findById(taskId)
      .select("name parent")
      .session(session);

    if (!task) throw new Error("UnknownTask");

    const team = await teams
      .findById(task.parent)
      .select("leader activities icon")
      .populate({
        path: "leader",
        select: "username",
      })
      .session(session);
    if (!team) throw new Error("UnknownTeam");

    task = {
      ...task,
      ...updatedTaskDetails,
    };

    const newActivity = await activities.create(
      [
        {
          team: team.id,
          entity: "team",
          image: team.icon,
          type: "teamTaskUpdated",
          message: `The task ${previousTaskName} is updated to ${task.name} by team leader ${team.leader.username}.`,
          read_users: [{ readBy: team.leader.id, isRead: true }],
        },
      ],
      { session }
    );

    team.activities.push(newActivity[0].id);

    await Promise.all([task.save({ session }), team.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    io.emit("teamActivities", newActivity[0].id);
    io.emit("tasks", (team.id + team.updatedAt).toString());
    io.emit("taskDetails", (team.id + team.updatedAt).toString());
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const setSubmittedTask = async (taskId, updatedSubmittedTask) => {
  const task = await tasks.findById(taskId).select("submittedTask");
  if (!task) throw new Error("UnknownTask");
  task.submittedTask = updatedSubmittedTask;
  await task.save();
};

// DELETE

module.exports = {
  getTaskDetails,
  setTaskDetails,
  submitGivenTask,
  setSubmittedTask,
};
