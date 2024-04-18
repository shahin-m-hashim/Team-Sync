const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { isEmail, isURL, isStrongPassword } = require("validator");
const {
  isValidFirebaseUrl,
  isValidGitHubURL,
  isValidLinkedInURL,
} = require("../utils/validator");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "ADMIN",
    },
    status: {
      type: String,
      enum: ["", "active", "inActive"],
      default: "",
    },
    profilePic: {
      type: String,
      validate: {
        validator: (value) =>
          !value || (isURL(value) && isValidFirebaseUrl(value)),
        message: "Invalid Image URL",
      },
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
        "Username can only contain letters, numbers, and underscores",
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
          validator: function (value) {
            return (
              !value ||
              isURL(value, {
                protocols: ["https", "ftp"],
                require_valid_protocol: true,
              })
            );
          },
          message: "Invalid website URL",
        },
        maxLength: [255, "URL cannot exceed 255 characters"],
        default: "",
      },
      linkedIn: {
        type: String,
        validate: {
          validator: function (value) {
            return !value || (isURL(value) && isValidLinkedInURL(value));
          },
          message: "Invalid LinkedIn URL",
        },
        maxLength: [255, "URL cannot exceed 255 characters"],
        default: "",
      },
      github: {
        type: String,
        validate: {
          validator: function (value) {
            return !value || (isURL(value) && isValidGitHubURL(value));
          },
          message: "Invalid GitHub URL",
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
      lowercase: true,
      validate: {
        validator: (value) => {
          return value === "" || isEmail(value);
        },
        message: "Please enter a valid email or leave it empty",
      },
      default: "",
    },
    phone: {
      countryCode: {
        type: String,
        match: [/^\+\d{1,4}$/, "Invalid country code"],
        maxlength: [5, "A country code cannot exceed 5 characters"],
        default: "+91",
      },
      number: {
        type: String,
        maxlength: [15, "A phone no. cannot exceed 15 characters"],
        default: "",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: [isStrongPassword, "Please enter a strong password"],
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
      },
    ],
    NOP: {
      type: Number,
      default: 0,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams",
      },
    ],
    NOTe: {
      type: Number,
      default: 0,
    },
    subTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subteams",
      },
    ],
    NOST: {
      type: Number,
      default: 0,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tasks",
      },
    ],
    NOTa: {
      type: Number,
      default: 0,
    },
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    NOC: {
      type: Number,
      default: 0,
    },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notifications",
      },
    ],
    NON: {
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
    last_seen: {
      type: Date,
      default: null,
    },
    used_otps: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 12);

  this.NOTe = this.teams?.length;
  this.NOTa = this.tasks?.length;
  this.NOP = this.projects?.length;
  this.NOST = this.subTeams?.length;
  this.NOC = this.connections?.length;
  this.NOI = this.invitations?.length;
  this.NON = this.notifications?.length;

  this.phone.countryCode = this.phone.countryCode || "+91";
  this.address.country = this.address.country || "IN";
  this.wasNew = this.isNew;
  next();
});

userSchema.post("save", async function (userDoc, next) {
  if (this.wasNew) console.log(`User ${userDoc.id} is saved successfully`);
  next();
});

module.exports = mongoose.model("users", userSchema);
