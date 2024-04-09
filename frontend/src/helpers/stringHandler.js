const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const capitalizeFirstLetterOfEachWord = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export { capitalizeFirstLetter, capitalizeFirstLetterOfEachWord };
