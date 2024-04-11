const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    invitedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    invitationRole: {
      type: String,
      enum: ["leader", "member", "guide"],
      default: "member",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending",
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

invitationSchema.pre("save", async function (next) {
  const now = new Date();
  const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  setTimeout(() => {
    if (this.status === "pending") {
      this.status = "expired";
      this.save();
    }
  }, twentyFourHoursLater - now);
  next();
});

userSchema.post("save", async function (invitationDoc, next) {
  if (this.wasNew)
    console.log(`Invitation ${invitationDoc.id} is saved successfully`);
  next();
});

module.exports = mongoose.model("invitations", invitationSchema);
