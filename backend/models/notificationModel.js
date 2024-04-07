const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["projectInvitation"],
      default: "projectInvitation",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    invitation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invitations",
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("notifications", notificationSchema);

module.exports = Notification;
