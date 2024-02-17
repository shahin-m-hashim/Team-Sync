const moment = require("moment/moment");

const requestLoger = (req, res, next) => {
  const details = {
    method: req.method,
    date: moment().format("DD-MM-YYYY"),
    time: moment().format("hh:mm:ss A"),
    path: req.path,
  };
  console.log("Request Details:", details);
  next();
};

module.exports = requestLoger;
