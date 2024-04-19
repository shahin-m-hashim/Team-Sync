const mongoose = require("mongoose");

const { isValidFirebaseUrl } = require("../utils/validator");

const teamSchema = new mongoose.Schema(
  {
    parent: {
      ref: "projects",
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Parent project is required"],
    },
    name: {
      type: String,
      required: [true, "Team name is required"],
      maxLength: [50, "Team Name cannot exceed 50 characters"],
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Team Leader is required"],
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    description: {
      type: String,
      maxLength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    icon: {
      type: String,
      validate: {
        validator: (value) => !value || isValidFirebaseUrl(value),
        message: "Invalid Image URL",
      },
      default: "",
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
    unavailableMembers: [{ type: String }],
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
    subTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams",
      },
    ],
    NOS: {
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
  },
  { timestamps: true }
);

teamSchema.index({ name: 1, parent: 1 }, { unique: true });

teamSchema.pre("save", async function (next) {
  this.NOM = this.members?.length;
  this.NOS = this.subTeams?.length;
  this.NOA = this.activities?.length;
  next();
});

teamSchema.post("save", async function (teamDoc, next) {
  if (this.wasNew) console.log(`Team ${teamDoc.id} is saved successfully`);
  next();
});

module.exports = mongoose.model("teams", teamSchema);
