const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    type: {
      type: String,
      enum: [
        "",
        "projectUpdated",
        "projectDeleted",
        "kickedFromTeam",
        "kickedFromProject",
        "kickedFromSubTeam",
        "teamLeaderDemotion",
        "teamLeaderPromotion",
        "subTeamLeaderDemotion",
        "subTeamLeaderPromotion",
        "projectCollaboratorLeft",
        "addedAsTeamCollaborator",
        "projectInvitationAccepted",
        "projectInvitationRejected",
        "addedAsSubTeamCollaborator",
      ],
      default: "",
      required: true,
    },
    message: {
      type: String,
      required: true,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

notificationSchema.post("save", async function (notificationDoc, next) {
  if (this.wasNew)
    console.log(`Notification ${notificationDoc.id} is saved successfully`);
  next();
});

module.exports = mongoose.model("notifications", notificationSchema);
