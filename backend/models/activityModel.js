const mongoose = require("mongoose");
const { isURL } = require("validator");
const { isValidFirebaseUrl } = require("../utils/validator");

const activitySchema = new mongoose.Schema(
  {
    entity: {
      type: String,
      enum: ["project", "team", "subTeam"],
      default: "project",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teams",
    },
    subTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subTeams",
    },
    type: {
      type: String,
      enum: [
        "",
        "teamTaskAdded",
        "teamMemberAdded",
        "teamTaskUpdated",
        "teamTaskDeleted",
        "teamGuideChanged",
        "teamLeaderChanged",
        "teamAddedToProject",
        "teamUpdatedInProject",
        "teamDeletedFromProject",
        "teamCollaboratorRemoved",
        "projectCollaboratorLeft",
        "projectCollaboratorJoined",
        "projectCollaboratorRemoved",
      ],
      default: "",
      required: true,
    },
    image: {
      type: String,
      validate: {
        validator: (value) =>
          !value || (isURL(value) && isValidFirebaseUrl(value)),
        message: "Invalid Image URL",
      },
      default: "",
    },
    message: {
      type: String,
      default: "",
      required: true,
    },
    read_users: [
      {
        readBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        isRead: {
          type: Boolean,
          default: false,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("activities", activitySchema);
