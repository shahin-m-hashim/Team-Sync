function calcStatusProgress(collection) {
  const progress = {
    notStarted: 0,
    pending: 0,
    stopped: 0,
    done: 0,
  };

  collection.forEach((doc) => {
    switch (doc.status) {
      case "Not Started":
        progress.notStarted++;
        break;
      case "Pending":
        progress.pending++;
        break;
      case "Stopped":
        progress.stopped++;
        break;
      case "Done":
        progress.done++;
        break;
      default:
        break;
    }
  });

  return progress;
}

export default calcStatusProgress;
