/* eslint-disable react/prop-types */

import axios from "axios";
import { useState } from "react";
const baseURL = import.meta.env.VITE_APP_BASE_URL;
import { cn, getLocalSecureItem } from "@/lib/utils";
import invite from "../../../assets/images/invite.png";
import defaultDp from "../../../assets/images/defaultDp.png";

const SendProjectInviteForm = ({
  sendCollaboratorInvite,
  setShowSendProjectInviteForm,
}) => {
  const user = getLocalSecureItem("user", "low");

  const [formData, setFormData] = useState({
    username: "",
    role: "member",
  });

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [showSearchFrom, setShowSearchFrom] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  const handleSendInvite = async (e) => {
    e.preventDefault();
    sendCollaboratorInvite(formData);

    setSearchedUsers([]);
    setShowSearchResults(false);
    setShowSearchFrom(true);
    setFormData({
      username: "",
      role: "member",
    });
  };

  const handleCancel = () => {
    setSearchedUsers([]);
    setShowSearchResults(false);
    setShowSearchFrom(true);
    setFormData({
      username: "",
      role: "member",
    });
    setShowSendProjectInviteForm(false);
  };

  return (
    <div className="relative h-full p-10 rounded-md bg-slate-700">
      <form
        onSubmit={handleSendInvite}
        className="absolute top-0 left-0 right-0 z-10 h-full px-8 py-4 bg-slate-700"
      >
        {showSearchFrom ? (
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
                  (member) => member.username !== user.username
                ) ? (
                  searchedUsers.map((member, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          username: member.username,
                        });
                        setShowSearchFrom(false);
                        setShowSearchResults(false);
                      }}
                      className="flex justify-between items-center w-full bg-slate-600 border-black border-[1px] p-2"
                    >
                      <div className="font-semibold text-yellow-500">
                        {member?.username}
                      </div>
                      <div>
                        {member?.fname?.length > 10 &&
                          member?.fname?.slice(0, 10) + "..."}
                      </div>
                      <div>
                        {member?.tag?.length > 10 &&
                          member?.tag?.slice(0, 10) + "..."}
                      </div>
                      <img
                        src={member?.profilePic || defaultDp}
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
                <div>
                  2. Then assign them a desired role within your project
                </div>
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
        ) : (
          <>
            <div className="my-8">
              <label className="block mt-[-7px] mb-4 text-xl font-medium">
                Inviting collaborator
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                {formData.username}
              </div>
            </div>
            <label className="block mb-2 font-medium">Project Role</label>
            <div className="p-4 mb-4 bg-slate-600">
              <span className="block text-sm">
                Choose a role for inviting user in your project
              </span>
              <div className="flex flex-col gap-5 my-6">
                <div>Leader: Has full control</div>
                <div>Guide: Has view permissions</div>
                <div>Member: Has view and task permissions</div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "member" })}
                  className={cn(
                    "flex w-full justify-center text-black rounded-md px-3 py-1.5 text-sm font-semibold leading-6",
                    formData.role === "member" ? "bg-yellow-500" : "bg-blue-600"
                  )}
                >
                  <span>Member</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "guide" })}
                  className={cn(
                    "flex w-full justify-center text-black rounded-md px-3 py-1.5 text-sm font-semibold leading-6",
                    formData.role === "guide" ? "bg-yellow-500" : "bg-blue-600"
                  )}
                >
                  <span>Guide</span>
                </button>
              </div>
            </div>
            <div className="flex gap-2 px-4">
              <button
                type="submit"
                className="flex w-full items-center gap-2 justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500"
              >
                <img src={invite} />
                <span>Send Invite</span>
              </button>
              <button
                type="button"
                onClick={() => handleCancel()}
                className="flex w-full items-center gap-2 justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500"
              >
                <span>Cancel</span>
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SendProjectInviteForm;
