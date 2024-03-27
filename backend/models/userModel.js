const bcrypt = require("bcrypt");
const moment = require("moment");
const mongoose = require("mongoose");
const { isEmail, isURL, isStrongPassword } = require("validator");

// Define the validator module
const validator = require("validator");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "ADMIN",
  },
  profilePic: {
    type: String,
    validate: {
      validator: (value) => !value || isURL(value),
      message: "Invalid URL",
    },
    maxLength: [255, "URL cannot exceed 255 characters"],
    default: "",
  },
  fname: {
    type: String,
    maxLength: [50, "Maximum length is 50 characters"],
    default: "",
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Username is required"],
    minlength: [5, "Minimum length is 5 characters"],
    maxLength: [20, "Maximum length is 20 characters"],
    match: [
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores",
    ],
  },
  pronoun: {
    type: String,
    maxLength: [20, "Pronoun cannot exceed 20 characters"],
    default: "",
  },
  tag: {
    type: String,
    maxLength: [20, "Tag cannot exceed 20 characters"],
    default: "",
  },
  bio: {
    type: String,
    maxLength: [150, "Bio cannot exceed 150 characters"],
    default: "",
  },
  address: {
    district: {
      type: String,
      maxLength: [50, "District cannot exceed 50 characters"],
      default: "",
    },
    state: {
      type: String,
      maxLength: [50, "State cannot exceed 50 characters"],
      default: "",
    },
    country: {
      type: String,
      maxLength: [50, "Country cannot exceed 50 characters"],
      default: "",
    },
  },
  occupation: {
    type: String,
    maxLength: [50, "Occupation cannot exceed 50 characters"],
    default: "",
  },
  organization: {
    type: String,
    maxLength: [50, "Organization cannot exceed 50 characters"],
    default: "",
  },
  socialLinks: {
    website: {
      type: String,
      validate: {
        validator: (value) => !value || isURL(value),
        message: "Invalid URL",
      },
      maxLength: [255, "URL cannot exceed 255 characters"],
      default: "",
    },
    linkedIn: {
      type: String,
      validate: {
        validator: (value) => !value || isURL(value),
        message: "Invalid URL",
      },
      maxLength: [255, "URL cannot exceed 255 characters"],
      default: "",
    },
    github: {
      type: String,
      validate: {
        validator: (value) => !value || isURL(value),
        message: "Invalid URL",
      },
      maxLength: [255, "URL cannot exceed 255 characters"],
      default: "",
    },
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email is required"],
    validate: [isEmail, "Please enter a valid email"],
  },
  secondaryEmail: {
    type: String,
    unique: true,
    lowercase: true,
    validate: {
      validator: (value) => !value || isEmail(value),
      message: "Please enter a valid email",
    },
    default: "",
  },
  phone: {
    countryCode: {
      type: String,
      match: [/^\+\d{1,4}$/, "Invalid country code"],
      maxlength: [5, "Invalid country code"],
      default: "+91",
    },
    number: {
      type: String,
      maxLength: 15,
      match: [/^\d{10,}$/, "Invalid Phone No."],
      default: "",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: [isStrongPassword, "Please enter a strong password"],
  },
  createdAt: {
    type: String,
    default: () => moment().format("DD-MM-YYYY hh:mm:ss A"),
  },
  used_otps: [
    {
      otp: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6,
      },
      createdAt: {
        type: String,
        default: () => moment().format("DD-MM-YYYY hh:mm:ss A"),
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.wasNew = this.isNew;
  next();
});

userSchema.post("save", async function (userDoc, next) {
  if (this.wasNew) console.log(`User ${userDoc.id} is successfully registered`);
  next();
});

module.exports = mongoose.model("users", userSchema);
