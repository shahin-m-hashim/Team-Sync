const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    authenticity: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    role: {
      type: String,
      enum: ["leader", "member", "guide"],
      default: "member",
      required: true,
    },
    message: {
      type: String,
      maxLength: [500, "Message cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired", "kicked"],
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

invitationSchema.post("save", async function (invitationDoc, next) {
  if (this.wasNew)
    console.log(`Invitation ${invitationDoc.id} is saved successfully`);
  next();
});

module.exports = mongoose.model("invitations", invitationSchema);
