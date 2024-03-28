const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  otp: {
    type: String,
    unique: true,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 200, // 3 minutes + 20s
    // this ensures consistency with the frontend timer coz of asynchronous mail sending
  },
});

otpSchema.pre("save", async function (next) {
  this.wasNew = this.isNew;
  next();
});

otpSchema.post("save", async function (otpDoc, next) {
  if (this.wasNew)
    console.log(`New OTP ${otpDoc.id} is created for user ${otpDoc.user}`);
  next();
});

module.exports = mongoose.model("OTP", otpSchema);
