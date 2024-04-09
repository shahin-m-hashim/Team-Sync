/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import { useState } from "react";
import invite from "../../assets/images/invite.png";

const AddEntityCollaboratorForm = ({
  entity,
  members,
  memberParent,
  handleSubmitAddCollaborator,
  setShowAddEntityCollaboratorForm,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    role: "member",
  });

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [showSearchFrom, setShowSearchFrom] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (e) => {
    const searchTxt = e.target.value;
    const filtered = members.filter((user) =>
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

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    setSearchedUsers([]);
    setShowSearchResults(false);
    setShowSearchFrom(true);
    handleSubmitAddCollaborator(formData);
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
    setShowAddEntityCollaboratorForm(false);
  };

  return (
    <div className="relative p-10 rounded-md bg-slate-700">
      <form
        onSubmit={handleAddCollaborator}
        className="absolute left-0 right-0 z-10 h-[67.5%] px-8 py-4 top-0 bg-slate-700"
      >
        {showSearchFrom ? (
          <>
            <input
              type="text"
              onChange={handleSearch}
              className="w-full px-2 py-2 my-4 bg-blue-500 border-2 rounded-lg border-block placeholder:text-black"
              placeholder="Search user by their username"
            />
            <div className="mt-2 mb-5">
              All members from your {memberParent}
            </div>
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
                      className="flex justify-between items-center w-full bg-slate-600 border-black border-[1px] p-4"
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
              <>
                <div className="h-full overflow-auto">
                  {members.length !== 0 ? (
                    members.map((member, index) => (
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
                        <img
                          className="size-8"
                          src={member.dp}
                          alt="memberDp"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="w-full p-2 text-center bg-slate-600">
                      No user found, try another username
                    </div>
                  )}
                </div>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowAddEntityCollaboratorForm(false)}
              className="flex w-full items-center gap-2 mt-2 justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600"
            >
              Done Adding ? Exit
            </button>
          </>
        ) : (
          <>
            <div className="my-8">
              <label className="block mb-4 text-sm font-medium">
                Adding collaborator
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                {formData.username}
              </div>
            </div>
            <label className="block mb-4 font-medium"> Role</label>
            <div className="p-4 mb-4 bg-slate-600">
              <span className="block text-sm">
                Choose a role for inviting user in your {entity}
              </span>
              <div className="flex flex-col gap-5 my-9">
                <div>Leader: Has full control</div>
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
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex w-full items-center gap-2 justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600"
              >
                <img src={invite} />
                <span>Confirm</span>
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

export default AddEntityCollaboratorForm;
