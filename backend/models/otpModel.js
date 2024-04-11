const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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
    default: () => Date.now(),
    expires: 180, // 3 minutes
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

module.exports = mongoose.model("otps", otpSchema);
