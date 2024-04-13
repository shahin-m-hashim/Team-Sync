const mongoose = require("mongoose");
const { isURL } = require("validator");
const { isValidFirebaseUrl } = require("../utils/validator");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "",
        "teamAdded", // project activity
        "teamUpdated", // project activity
        "teamDeleted", // project activity
        "collaboratorJoined", // project activity
        "collaboratorLeft", // project activity
        "collaboratorRemoved", // project activity
        "subTeamAdded", // team activity
        "subTeamUpdated", // team activity
        "subTeamDeleted", // team activity
        "teamLeaderChanged", // team activity
        "teamCollaboratorAdded", // team activity
        "teamCollaboratorRemoved", // team activity
        "subTeamLeaderChanged", // sub team activity
        "subTeamCollaboratorAdded", // sub team activity
        "subTeamCollaboratorRemoved", // sub team activity
      ],
      default: "",
      required: true,
    },
    message: {
      type: String,
      default: "",
      required: true,
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
    link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

activitySchema.post("save", async function (activityDoc, next) {
  if (this.wasNew)
    console.log(`Activity ${activityDoc.id} is saved successfully`);
  next();
});

module.exports = mongoose.model("activities", activitySchema);
