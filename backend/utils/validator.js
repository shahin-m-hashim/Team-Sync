function isValidLinkedInURL(url) {
  return url.startsWith("https://www.linkedin.com/");
}

function isValidGitHubURL(url) {
  return url.startsWith("https://github.com/");
}

function isValidFirebaseUrl(url) {
  return url.startsWith(
    "https://firebasestorage.googleapis.com/v0/b/s8-main-project.appspot.com"
  );
}

// function isValidTeamSyncURL(url) {
//   return url.startsWith("");
// }

module.exports = {
  isValidLinkedInURL,
  isValidGitHubURL,
  isValidFirebaseUrl,
};
