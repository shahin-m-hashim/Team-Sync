const mongoose = require("mongoose");

const { isValidFirebaseUrl } = require("../utils/validator");

const taskSchema = new mongoose.Schema(
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
      required: [true, "Task team name is required"],
      maxLength: [50, "Task name cannot exceed 50 characters"],
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Assignee is required"],
    },
    attachment: {
      type: String,
      validate: {
        validator: (value) => !value || isValidFirebaseUrl(value),
        message: "Invalid Image URL",
      },
      default: "",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: [true, "Priority is required"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    status: {
      type: String,
      enum: ["Not Started", "Pending", "Done", "Stopped"],
      default: "Not Started",
    },
    submittedTask: {
      type: String,
      validate: {
        validator: (value) => !value || isValidFirebaseUrl(value),
        message: "Invalid file URL",
      },
      default: "",
    },
  },
  { timestamps: true }
);

taskSchema.index({ name: 1, parent: 1, grandParent: 1 }, { unique: true });

taskSchema.pre("save", async function (next) {
  const now = new Date();
  const deadline = new Date(this.deadline);

  setTimeout(async () => {
    this.status = "Stopped";
    await this.save();
  }, deadline - now);

  next();
});

module.exports = mongoose.model("tasks", taskSchema);
