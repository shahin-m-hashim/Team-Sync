const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "",
        "teamLeaderDemotion",
        "teamLeaderPromotion",
        "subTeamLeaderDemotion",
        "subTeamLeaderPromotion",
        "addedAsTeamCollaborator",
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
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.post("save", async function (notificationDoc, next) {
  if (this.wasNew)
    console.log(`Notification ${notificationDoc.id} is saved successfully`);
  next();
});

module.exports = mongoose.model("notifications", notificationSchema);
