const publicRouter = require("express").Router();
const { searchUser } = require("../controllers/publicController");

// GET Requests
publicRouter.get("/search/user", searchUser);

module.exports = publicRouter;
