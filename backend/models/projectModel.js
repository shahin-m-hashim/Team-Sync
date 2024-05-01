const mongoose = require("mongoose");

const { isValidFirebaseUrl } = require("../utils/validator");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Project name is required"],
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    icon: {
      type: String,
      validate: {
        validator: (value) => !value || isValidFirebaseUrl(value),
        message: "Invalid Image URL",
      },
      default: "",
    },
    description: {
      type: String,
      maxLength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Project leader is required"],
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    NOM: {
      type: Number,
      default: 0,
    },
    invitations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "invitations",
      },
    ],
    NOI: {
      type: Number,
      default: 0,
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "activities",
      },
    ],
    NOA: {
      type: Number,
      default: 0,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams",
      },
    ],
    NOT: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Not Started", "Pending", "Done", "Stopped"],
      default: "Not Started",
    },
    unavailableMembers: [{ type: String }],
  },
  { timestamps: true }
);

projectSchema.pre("save", async function (next) {
  this.NOT = this.teams?.length || 0;
  this.NOM = this.members?.length || 0;
  this.NOA = this.activities?.length || 0;
  this.NOI = this.invitations?.length || 0;
  next();
});

module.exports = mongoose.model("projects", projectSchema);
