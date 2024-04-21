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
    type: {
      type: String,
      enum: [
        "",
        "teamLeaderChanged",
        "teamAddedToProject",
        "subTeamAddedToTeam",
        "taskAddedToSubTeam",
        "teamUpdatedInProject",
        "subTeamUpdatedInTeam",
        "subTeamLeaderChanged",
        "taskUpdatedInSubTeam",
        "teamCollaboratorAdded",
        "teamDeletedFromProject",
        "subTeamDeletedFromTeam",
        "taskDeletedFromSubTeam",
        "projectCollaboratorLeft",
        "teamCollaboratorRemoved",
        "subTeamCollaboratorAdded",
        "projectCollaboratorJoined",
        "projectCollaboratorRemoved",
        "subTeamCollaboratorRemoved",
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
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

activitySchema.post("save", async function (activityDoc, next) {
  if (this.wasNew)
    console.log(`Activity ${activityDoc.id} is saved successfully`);
  next();
});

module.exports = mongoose.model("activities", activitySchema);
