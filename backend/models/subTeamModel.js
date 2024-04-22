const mongoose = require("mongoose");

const { isValidFirebaseUrl } = require("../utils/validator");

const subTeamSchema = new mongoose.Schema(
  {
    grandParent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      required: [true, "Grand parent project is required"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teams",
      required: [true, "Parent team is required"],
    },
    name: {
      type: String,
      required: [true, "Sub team name is required"],
      maxLength: [50, "Sub team name cannot exceed 50 characters"],
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
      required: [true, "Sub team leader is required"],
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
    tasks: [
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

subTeamSchema.index({ name: 1, parent: 1 }, { unique: true });

subTeamSchema.pre("save", async function (next) {
  this.NOT = this.tasks?.length;
  this.NOM = this.members?.length;
  this.NOA = this.activities?.length;
  next();
});

subTeamSchema.post("save", async function (subTeamDoc, next) {
  if (this.wasNew)
    console.log(`Sub team ${subTeamDoc.id} is saved successfully`);
  next();
});

module.exports = mongoose.model("subteams", subTeamSchema);
