const requestLoger = (req, res, next) => {
  const details = {
    date: new Date().toLocaleDateString("en-GB"),
    time: new Date().toLocaleTimeString(),
    method: req.method,
    path: req.path,
  };
  console.log("Request Details:", details);
  next();
};

module.exports = requestLoger;
