/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { getLocalSecureItem } from "@/lib/utils";
const baseURL = import.meta.env.VITE_APP_BASE_URL;
import defaultDp from "../../../assets/images/defaultDp.png";

function SearchAndSelectUser({
  setSelectedUser,
  setShowSearchForm,
  setShowAssignRoleForm,
  setShowSendProjectInviteForm,
}) {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const currentUser = getLocalSecureItem("user", "low");

  const handleSearch = async (e) => {
    const searchTxt = e.target.value;
    try {
      const results = await axios.get(
        `${baseURL}/search/user?username=${searchTxt}`
      );
      setSearchedUsers(results?.data);
    } catch (e) {
      console.log(e);
    }
    if (e.target.value === "") {
      setSearchedUsers([]);
      setShowSearchResults(false);
    } else {
      setShowSearchResults(true);
    }
  };

  const handleSelectUser = (user) => {
    setShowSearchResults(false);
    setSelectedUser(user);
    setShowSearchForm(false);
    setShowAssignRoleForm(true);
  };

  return (
    <>
      <input
        type="text"
        onChange={handleSearch}
        className="w-full px-2 py-2 mt-5 mb-4 bg-blue-500 border-2 rounded-lg border-block placeholder:text-black"
        placeholder="Search user by their username"
      />
      {showSearchResults ? (
        <div className="h-[80%] overflow-auto">
          {searchedUsers.length > 0 &&
          searchedUsers.some(
            (user) => user.username !== currentUser.username
          ) ? (
            searchedUsers.map((user) => (
              <button
                id={user._id}
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className="flex justify-between items-center w-full bg-slate-600 border-black border-[1px] p-2"
              >
                <div className="font-semibold text-yellow-500">
                  {user?.username}
                </div>
                <div>
                  {user?.fname?.length > 10 &&
                    user?.fname?.slice(0, 10) + "..."}
                </div>
                <div>
                  {user?.tag?.length > 10 && user?.tag?.slice(0, 10) + "..."}
                </div>
                <img
                  src={user?.profilePic || defaultDp}
                  className="object-cover object-center rounded-full size-8"
                />
              </button>
            ))
          ) : (
            <div className="w-full p-2 text-center bg-slate-600">
              No user found, try another username
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-around h-[80%] p-5 bg-slate-600">
          <div className="font-semibold text-red-500">
            Start typing to search for users...
          </div>
          <div>1. Once found, click to select them</div>
          <div>2. Then assign them a desired role within your project</div>
          <hr />
          <div className="text-lg font-medium text-red-600">Roles</div>
          <div>Leader: Has full control</div>
          <div>Guide: Has view permissions</div>
          <div>Member: Has view and task permissions</div>
          <button
            type="button"
            onClick={() => setShowSendProjectInviteForm(false)}
            className="flex w-full items-center gap-2 mt-2 justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500"
          >
            Done Inviting ? Exit Search
          </button>
        </div>
      )}
    </>
  );
}

export default SearchAndSelectUser;
