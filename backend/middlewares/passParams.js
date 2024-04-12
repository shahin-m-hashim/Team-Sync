const passProject = (req, res, next) => {
  try {
    const { projectId } = req.params;
    req.project = { projectId };
    next();
  } catch (e) {
    next(e);
  }
};

const passTeam = (req, res, next) => {
  try {
    const { teamId } = req.params;
    req.team = { teamId };
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { passProject, passTeam };
