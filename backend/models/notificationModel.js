const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    type: {
      type: String,
      enum: [
        "",
        "projectUpdated",
        "projectDeleted",
        "teamLeaderDemotion",
        "teamLeaderPromotion",
        "subTeamLeaderDemotion",
        "subTeamLeaderPromotion",
        "projectCollaboratorLeft",
        "addedAsTeamCollaborator",
        "projectInvitationAccepted",
        "projectInvitationRejected",
        "addedAsSubTeamCollaborator",
        "removedYouFromTeamCollaboration",
        "removedYouFromSubTeamCollaboration",
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
