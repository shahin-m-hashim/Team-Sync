const errorHandler = (error, req, res, next) => {
  switch (error.message) {
    case "UnauthorizedAccess":
      return res.status(401).json({
        success: false,
        error: "Unauthorized access !!!",
      });

    case "UserAlreadyExists":
      return res.status(400).json({
        success: false,
        error:
          "A user with the given email or username already exists, please login instead.",
      });

    case "UnknownUser":
      return res.status(404).json({
        success: false,
        error: "User not found, Please sign up first.",
      });

    case "UnknownProject":
      return res.status(404).json({
        success: false,
        error: "Project not found, Please create or join a project first.",
      });

    case "UnknownTeam":
      return res.status(404).json({
        success: false,
        error: "Team not found, Please create a team first.",
      });

    case "UserAlreadyInProjectAsAGuide":
      return res.status(400).json({
        success: false,
        error: "User is already a guide in this project.",
      });

    case "UserAlreadyInProjectAsAMember":
      return res.status(400).json({
        success: false,
        error: "User is already a member in this project.",
      });

    case "UserAlreadyInvited":
      return res.status(400).json({
        success: false,
        error: "This user has already been invited to this project.",
      });

    case "UserAlreadyInTeam":
      return res.status(400).json({
        success: false,
        error: "User is already in the team.",
      });

    case "UnknownSubTeam":
      return res.status(404).json({
        success: false,
        error: "Sub team not found, Please create a sub team first.",
      });

    case "UnknownInvitingUser":
      return res.status(404).json({
        success: false,
        error: "Failed to send invitation, Please try again later.",
      });

    case "UnknownInvitedUser":
      return res.status(404).json({
        success: false,
        error: "User not found, Please check the username and try again.",
      });

    case "UnknownInvitation":
      return res.status(404).json({
        success: false,
        error: "Invitation not found, it may have been deleted.",
      });

    case "UnknownUserFromProject":
      return res.status(404).json({
        success: false,
        error:
          "Failed to add user, he/she might have been removed from the project.",
      });

    case "UnknownUserFromTeam":
      return res.status(404).json({
        success: false,
        error:
          "Failed to add user, he/she might have been removed from the team.",
      });

    case "UnknownUserFromSubTeam":
      return res.status(404).json({
        success: false,
        error:
          "Failed to add user, he/she might have been removed from the sub team.",
      });

    case "InvalidPassword":
      return res.status(401).json({
        success: false,
        error: "Invalid password, Please try again.",
      });

    case "ValidationError":
      const validationErrors = {};
      Object.keys(error.errors).forEach(
        (key) => (validationErrors[key] = error.errors[key].message)
      );
      return res.status(422).json({
        success: false,
        error: "Validations failed.",
        validationErrors,
      });

    case "TokenCreationFailure":
      return res.status(500).json({
        success: false,
        error: "Token creation failed.",
      });

    case "InvalidAccessToken":
      res.clearCookie("accJwt");
      return res.status(401).json({
        success: false,
        error: "Access Denied. Invalid Access token.",
      });

    case "InvalidRefreshToken":
      res.clearCookie("refJwt");
      return res.status(401).json({
        success: false,
        error: "Access Denied. Invalid Refresh token.",
      });

    case "InvalidOtpToken":
      return res.status(401).json({
        success: false,
        error: "Oops, looks like your session has expired.",
      });

    case "InvalidOTP":
      return res.status(401).json({
        success: false,
        error:
          "Oops, looks like the OTP has expired, kindly request a new one.",
      });

    case "AccountDeletionError":
      return res.status(401).json({
        success: false,
        error: "Account deletion failed",
      });

    case "ProjectAlreadyExists":
      return res.status(400).json({
        success: false,
        error: "A project with the given name already exists.",
      });

    case "InvitationHasExpired":
      return res.status(400).json({
        success: false,
        error: "This invitation has expired.",
      });

    case "TeamAlreadyExists":
      return res.status(400).json({
        success: false,
        error: "A team with the given name already exists.",
      });

    case "SubTeamAlreadyExists":
      return res.status(400).json({
        success: false,
        error: "A sub team with the given name already exists.",
      });

    case "ForbiddenAction":
      return res.status(403).json({
        success: false,
        error: "Forbidden. You do not have permission to perform this action.",
      });

    default:
      console.error("Error stack:", error.stack);
      if (
        error.message === "jwt malformed" ||
        error.message === "invalid token"
      ) {
        res.clearCookie("accJwt");
        res.clearCookie("refJwt");
      }
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message || "An unknown error occurred.",
      });
  }
};

module.exports = errorHandler;
