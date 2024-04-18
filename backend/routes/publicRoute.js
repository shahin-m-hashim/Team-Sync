const { io } = require("../server");
const publicRouter = require("express").Router();
const { searchUser } = require("../controllers/publicController");

// GET Requests
publicRouter.get("/search/user", searchUser);

publicRouter.get("/notify", (req, res) => {
  io.emit("notify", "A new notification");
  res.send("Notified");
});

module.exports = publicRouter;
