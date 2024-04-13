const mongoose = require("mongoose");
const { isURL } = require("validator");
const { isValidFirebaseUrl } = require("../utils/validator");

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
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending",
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
