function calcStatusCount(list) {
  const statusCount = {
    notStarted: 0,
    pending: 0,
    stopped: 0,
    done: 0,
  };

  list.forEach((doc) => {
    switch (doc.status) {
      case "Not Started":
        statusCount.notStarted++;
        break;
      case "Pending":
        statusCount.pending++;
        break;
      case "Stopped":
        statusCount.stopped++;
        break;
      case "Done":
        statusCount.done++;
        break;
      default:
        break;
    }
  });

  return statusCount;
}

export default calcStatusCount;
