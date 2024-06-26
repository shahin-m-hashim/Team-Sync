const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    type: {
      type: String,
      enum: [
        "",
        "taskUpdated",
        "taskDeleted",
        "taskApproved",
        "taskRejected",
        "taskAssigned",
        "taskSubmitted",
        "projectDeleted",
        "kickedFromTeam",
        "teamGuideDemotion",
        "kickedFromProject",
        "kickedFromSubTeam",
        "addedAsTeamMember",
        "projectNameUpdated",
        "teamGuidePromotion",
        "teamLeaderPromotion",
        "projectGuideDemotion",
        "subTeamGuideDemotion",
        "addedAsSubTeamMember",
        "subTeamGuidePromotion",
        "subTeamLeaderPromotion",
        "projectInvitationAccepted",
        "projectInvitationRejected",
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

module.exports = mongoose.model("notifications", notificationSchema);
