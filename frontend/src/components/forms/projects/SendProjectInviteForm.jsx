/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import invite from "../../../assets/images/invite.png";

const SendProjectInviteForm = ({ users, setShowSendProjectInviteForm }) => {
  const [formData, setFormData] = useState({
    username: "",
    role: "member",
  });

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [showSearchFrom, setShowSearchFrom] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (e) => {
    const searchTxt = e.target.value;
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTxt.toLowerCase())
    );
    if (e.target.value === "") {
      setSearchedUsers([]);
      setShowSearchResults(false);
    } else {
      setSearchedUsers(filtered);
      setShowSearchResults(true);
    }
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    setSearchedUsers([]);
    setShowSearchResults(false);
    setShowSearchFrom(true);
    toast.success(
      `${formData.username} invited as ${formData.role} successfully`
    );
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
    <div className="relative p-10 rounded-md bg-slate-700">
      <form
        onSubmit={handleSendInvite}
        className="absolute left-0 right-0 z-10 h-[80%] px-8 py-4 top-0 bg-slate-700"
      >
        {showSearchFrom ? (
          <>
            <input
              type="text"
              onChange={handleSearch}
              className="w-full px-2 py-2 my-8 bg-blue-500 border-2 rounded-lg border-block placeholder:text-black"
              placeholder="Search user by their username"
            />
            {showSearchResults ? (
              <div className="h-full overflow-auto">
                {searchedUsers.length !== 0 ? (
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
                      <div>{member.username}</div>
                      <img className="size-8" src={member.dp} alt="memberDp" />
                    </button>
                  ))
                ) : (
                  <div className="w-full p-2 text-center bg-slate-600">
                    No user found, try another username
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col justify-around h-full px-10 py-5 bg-slate-600">
                <div className="font-semibold text-red-500">
                  Start typing to search for users...
                </div>
                <div>1. Once found,click to select them</div>
                <div>
                  2. Then assign them a desired role within your project
                </div>
                <hr />
                <div className="text-lg font-medium text-red-600">Roles</div>
                <div>Leader: Has full control</div>
                <div>Guide: Has view permissions</div>
                <div>Member: Has view and submission controls</div>
                <button
                  type="button"
                  onClick={() => setShowSendProjectInviteForm(false)}
                  className="flex w-full items-center gap-2 mt-2 justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600"
                >
                  Done Inviting ? Exit Search
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="my-8">
              <label className="block mb-4 text-sm font-medium">
                Inviting collaborator
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                {formData.username}
              </div>
            </div>
            <label className="block mb-4 font-medium">Project Role</label>
            <div className="p-4 mb-4 bg-slate-600">
              <span className="block text-sm">
                Choose a role for inviting user in your project
              </span>
              <div className="flex flex-col gap-5 my-9">
                <div>Leader: Has full control</div>
                <div>Guide: Has view permissions</div>
                <div>Member: Has view and submission controls</div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "member" })}
                  className={cn(
                    "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6",
                    formData.role === "member"
                      ? "bg-yellow-500 text-black"
                      : "bg-blue-600 text-white"
                  )}
                >
                  <span>Member</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "leader" })}
                  className={cn(
                    "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6",
                    formData.role === "leader"
                      ? "bg-yellow-500 text-black"
                      : "bg-blue-600 text-white"
                  )}
                >
                  <span>Leader</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "guide" })}
                  className={cn(
                    "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6",
                    formData.role === "guide"
                      ? "bg-yellow-500 text-black"
                      : "bg-blue-600 text-white"
                  )}
                >
                  <span>Guide</span>
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex w-full items-center gap-2 justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600"
              >
                <img src={invite} />
                <span>Send Invite</span>
              </button>
              <button
                type="button"
                onClick={() => handleCancel()}
                className="flex w-full items-center gap-2 justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600"
              >
                <img src={invite} />
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
