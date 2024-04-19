const calcOverallProgress = (list) => {
  let totalProgress = 0;
  let progressPercentage = 0;
  list.forEach((item) => (totalProgress += item.progress));
  progressPercentage = totalProgress / list.length;
  return Math.round(progressPercentage);
};

export default calcOverallProgress;
