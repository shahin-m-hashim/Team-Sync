const mongoose = require("mongoose");

function isValidFirebaseUrl(url) {
  return url.startsWith(
    "https://firebasestorage.googleapis.com/v0/b/s8-main-project.appspot.com"
  );
}

const teamSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      required: [true, "Parent project is required"],
    },
    name: {
      type: String,
      unique: true,
      required: [true, "Project name is required"],
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Leader is required"],
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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
    subTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams",
      },
    ],
    progress: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["notStarted", "pending", "completed", "stopped"],
      default: "notStarted",
    },
  },
  { timestamps: true }
);

teamSchema.pre("save", async function (next) {
  this.guide = this.guide || null;
  const membersCount = this.members.length;
  this.NOM = membersCount + (this.guide ? 2 : 1);
  next();
});

module.exports = mongoose.model("teams", teamSchema);
