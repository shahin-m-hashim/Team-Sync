const users = require("../models/userModel");

// GET
const findUser = async (searchQuery) => {
  let results = [];

  if (searchQuery) {
    const agg = [
      {
        $search: {
          index: "search_user",
          autocomplete: {
            query: searchQuery,
            path: "username",
            fuzzy: {
              maxEdits: 2,
              prefixLength: 2,
              maxExpansions: 10,
            },
          },
        },
      },
      { $limit: 5 },
      {
        $project: {
          username: 1,
          fname: 1,
          profilePic: 1,
          tag: 1,
        },
      },
    ];

    results = await users.aggregate(agg);
  }

  return results;
};

module.exports = { findUser };
