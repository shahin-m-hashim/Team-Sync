const projects = require("../models/projectModel");

isRegisteredUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { userRole } = req.body;
    if (userId && userRole === "ADMIN") {
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

isProjectLeader = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.params;

    const project = await projects.findById(projectId);
    if (!project) throw new Error("UnknownProject");

    if (userId === project.leader.toString()) {
      req.project = req.params;
      next();
    } else throw new Error("ForbiddenAction");
  } catch (e) {
    next(e);
  }
};

module.exports = { isRegisteredUser, isProjectLeader };
