function calculateStatus(statuses) {
  if (statuses.every((status) => status === "Not Started")) {
    return "Not Started";
  }

  if (statuses.every((status) => status === "Done")) {
    return "Done";
  }

  if (statuses.every((status) => status === "Stopped")) {
    return "Stopped";
  }

  return "Pending";
}

module.exports = { calculateStatus };
