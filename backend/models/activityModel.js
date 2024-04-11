const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
    },
    type: {
      type: String,
      enum: [
        "",
        "teamAdded",
        "taskAdded",
        "taskUpdated",
        "teamUpdated",
        "subTeamAdded",
        "projectUpdated",
        "subTeamUpdated",
        "collaboratorLeft",
        "teamLeaderChanged",
        "collaboratorJoined",
        "subTeamLeaderChanged",
        "addedTeamCollaborator",
        "removedTeamCollaborator",
        "addedProjectCollaborator",
        "addedSubTeamCollaborator",
        "removedProjectCollaborator",
        "removedSubTeamCollaborator",
      ],
      default: "",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.post("save", async function (activityDoc, next) {
  if (this.wasNew)
    console.log(`Activity ${activityDoc.id} is saved successfully`);
  next();
});

module.exports = mongoose.model("activities", activitySchema);
