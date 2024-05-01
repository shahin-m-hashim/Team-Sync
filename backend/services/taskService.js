const moment = require("moment");
const { io } = require("../server");
const mongoose = require("mongoose");
const tasks = require("../models/taskModel");
const teams = require("../models/teamModel");
const projects = require("../models/projectModel");
const activities = require("../models/activityModel");
const notifications = require("../models/notificationModel");
const { calculateStatus } = require("../utils/calculateStatus");
const updateStatusProgress = require("../helpers/updateStatusProgress");

// GET
const getTaskDetails = async (taskId) => {
  const task = await tasks
    .findById(taskId)
    .select("-__v -createdAt -parent -grandParent")
    .populate({
      path: "assignee",
      select: "username profilePic",
    });

  const formattedTask = {
    ...task._doc,
    deadline: moment(task.deadline).format("DD/MM/YYYY"),
  };

  return formattedTask;
};

// PATCH
const setAttachment = async (taskId, attachment) => {
  const task = await tasks
    .findById(taskId)
    .select("attachment createdAt deadline");
  if (!task) throw new Error("UnknownTask");
  task.attachment = attachment;
  await task.save();
};

const setTaskDetails = async (taskId, updatedTaskDetails) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const task = await tasks
      .findById(taskId)
      .select("name parent createdAt deadline priority")
      .populate({
        path: "parent",
        select: "leader",
        populate: {
          path: "leader activities",
          select: "username read_users",
        },
      })
      .session(session);

    if (!task) {
      throw new Error("UnknownTask");
    }

    const previousTaskName = task.name;

    task.name = updatedTaskDetails.name;
    task.deadline = updatedTaskDetails.deadline;
    task.priority = updatedTaskDetails.priority;

    const newActivity = await activities.create(
      [
        {
          team: task.parent.id,
          entity: "team",
          type: "teamTaskUpdated",
          message: `The task ${previousTaskName} is updated to ${task.name} by team leader ${task.parent.leader.username}.`,
          read_users: [{ readBy: task.parent.leader._id, isRead: true }],
        },
      ],
      { session }
    );

    task.parent.activities.push(newActivity[0].id);

    await Promise.all([task.save({ session }), task.parent.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    io.emit("tasks", task._id.toString());
    io.emit("taskDetails", task._id.toString());
    io.emit("teamActivities", newActivity[0].id);
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const setSubmitTask = async (taskId, updatedSubmittedTask) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const task = await tasks
      .findById(taskId)
      .select("parent grandParent assignee createdAt deadline")
      .populate({
        path: "parent",
        select: "name leader",
        populate: {
          path: "leader",
          select: "username notifications",
        },
      })
      .populate({
        path: "grandParent",
        select: "name",
      })
      .populate({
        path: "assignee",
        select: "username",
      })
      .session(session);

    if (!task) throw new Error("UnknownTask");

    const wasTaskSubmittedBefore = task.submittedTask
      ? "resubmitted"
      : "submitted";

    task.submittedTask = updatedSubmittedTask;

    if (task.status === "Stopped") {
      throw new Error("TaskStopped");
    } else {
      task.status = "Pending";
    }

    const newNotification = await notifications.create(
      [
        {
          from: task.assignee,
          type: "taskSubmitted",
          to: task.parent.leader,
          message: `${task.assignee.username} ${wasTaskSubmittedBefore} the task in team ${task.parent.name} in project ${task.grandParent.name}.`,
        },
      ],
      { session }
    );

    task.parent.leader.notifications.push(newNotification[0].id);

    await Promise.all([
      task.save({ session }),
      task.parent.leader.save({ session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    io.emit("tasks", task.updatedAt.toString());
    io.emit("notifications", newNotification[0].id);

    updateStatusProgress(task.parent._id, task.grandParent._id);
  } catch (e) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw e;
  }
};

const setSubmittedTaskStatus = async (taskId, status) => {
  let session = null;
  try {
    const task = await tasks
      .findById(taskId)
      .select("parent grandParent assignee createdAt updatedAt deadline")
      .populate({
        path: "parent",
        select: "name leader unavailableMembers",
        populate: {
          path: "leader",
          select: "username",
        },
      })
      .populate({
        path: "assignee grandParent",
        select: "username name notifications",
      });

    if (!task) throw new Error("UnknownTask");

    if (task.status === "Done" || task.status === "Stopped")
      throw new Error("TaskAlreadyHandled");

    let taskStatus = "";
    let messageType = "";

    if (status === "approve") {
      task.status = "Done";
      messageType = "taskApproved";
      taskStatus = "approved";

      task.parent.unavailableMembers = task.parent.unavailableMembers.filter(
        (member) => member !== task.assignee.username
      );
    } else if (status === "reject") {
      messageType = "taskRejected";
      taskStatus = "rejected";
    }

    const newNotification = await notifications.create(
      [
        {
          type: messageType,
          to: task.assignee,
          from: task.parent.leader,
          message: `Your task submission in team ${task.parent.name} in project ${task.grandParent.name} is ${taskStatus} by team leader ${task.parent.leader.username}.`,
        },
      ],
      { session }
    );

    task.assignee.notifications.push(newNotification[0].id);

    await Promise.all([
      task.save({ session }),
      task.parent.save({ session }),
      task.assignee.save({ session }),
    ]);

    io.emit("tasks", task.updatedAt.toString());
    io.emit("notifications", newNotification[0].id);
    io.emit("taskDetails", task.updatedAt.toString());

    updateStatusProgress(task.parent._id, task.grandParent._id);
  } catch (e) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw e;
  }
};

// DELETE

module.exports = {
  setAttachment,
  getTaskDetails,
  setTaskDetails,
  setSubmitTask,
  setSubmittedTaskStatus,
};
