/* eslint-disable react/prop-types */

import { useState } from "react";
import invite from "../../assets/images/invite.png";
import { cn, getLocalSecureItem } from "@/lib/utils";
import defaultDp from "../../assets/images/defaultDp.png";
import { capitalizeFirstLetter } from "@/helpers/stringHandler";

const AddEntityCollaboratorForm = ({
  entity,
  parent,
  members,
  handleAddEntityCollaborator,
  setShowAddEntityCollaboratorForm,
}) => {
  const user = getLocalSecureItem("user", "low");

  const [formData, setFormData] = useState({
    username: "",
    role: "member",
  });

  const [searchedMembers, setSearchedMembers] = useState([]);
  const [showSearchFrom, setShowSearchFrom] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (e) => {
    const searchTxt = e.target.value;
    const filtered = members.filter((member) =>
      member.username.toLowerCase().includes(searchTxt.toLowerCase())
    );
    if (e.target.value === "") {
      setSearchedMembers([]);
      setShowSearchResults(false);
    } else {
      setSearchedMembers(filtered);
      setShowSearchResults(true);
    }
  };

  const handleCancel = async () => {
    setSearchedMembers([]);
    setShowSearchResults(false);
    setShowSearchFrom(true);
    setShowAddEntityCollaboratorForm(false);
    setFormData({
      username: "",
      role: "member",
    });
  };

  return (
    <div className="relative h-full p-10 rounded-md bg-slate-700">
      <form
        onSubmit={handleAddEntityCollaborator}
        className="absolute top-0 left-0 right-0 z-10 h-full px-8 py-5 bg-slate-700"
      >
        {showSearchFrom ? (
          <>
            <input
              type="text"
              onChange={handleSearch}
              className="w-full px-2 py-2 mt-5 mb-4 bg-blue-500 border-2 rounded-lg border-block placeholder:text-black"
              placeholder={`Search member from ${parent} by their username`}
            />
            <h1 className="mt-2 mb-4">All {parent} members</h1>
            <div className="h-[60%] overflow-auto">
              {showSearchResults ? (
                <>
                  {searchedMembers.length > 0 &&
                  searchedMembers.some(
                    (searchedMember) =>
                      searchedMember.username !== user.username
                  ) ? (
                    searchedMembers.map((searchedMember) => (
                      <button
                        key={searchedMember._id}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            username: searchedMember.username,
                          });
                          setShowSearchFrom(false);
                          setShowSearchResults(false);
                        }}
                        className="flex justify-between items-center w-full bg-slate-600 border-black border-[1px] p-2"
                      >
                        <div className="font-semibold text-yellow-500">
                          {searchedMember?.username}
                        </div>
                        <div>
                          {searchedMember?.fname?.length > 10
                            ? searchedMember?.fname?.slice(0, 10) + "..."
                            : searchedMember?.fname}
                        </div>
                        <div>
                          {searchedMember?.tag?.length > 10
                            ? searchedMember?.tag?.slice(0, 10) + "..."
                            : searchedMember?.tag}
                        </div>
                        <img
                          src={searchedMember?.profilePic || defaultDp}
                          className="object-cover object-center rounded-full size-8"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="w-full p-2 text-center bg-slate-600">
                      No member found, try another username
                    </div>
                  )}
                </>
              ) : (
                <>
                  {members.length > 0 ? (
                    members.map((member) => (
                      <button
                        id={member._id}
                        key={member._id}
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
                          {member?.fname?.length > 10
                            ? member?.fname?.slice(0, 10) + "..."
                            : member?.fname}
                        </div>
                        <div>
                          {member?.tag?.length > 10
                            ? member?.tag?.slice(0, 10) + "..."
                            : member?.tag}
                        </div>
                        <img
                          src={member?.profilePic || defaultDp}
                          className="object-cover object-center rounded-full size-8"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="w-full p-2 text-center bg-slate-600">
                      Currently, there are no collaborators in your {entity}
                    </div>
                  )}
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowAddEntityCollaboratorForm(false)}
              className="flex w-full items-center gap-2 mt-3 justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500"
            >
              Done Adding ? Exit
            </button>
          </>
        ) : (
          <>
            <div className="my-8">
              <label className="block mt-[-7px] mb-4 text-xl font-medium">
                Adding collaborator
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                {formData.username}
              </div>
            </div>
            <label className="block mb-2 font-medium">
              {capitalizeFirstLetter(entity)} Role
            </label>
            <div className="p-4 mb-4 bg-slate-600">
              <span className="block text-sm">
                Choose a role for adding collaborator in your {entity}
              </span>
              <div className="flex flex-col gap-5 my-6">
                <div>Leader: Has full control</div>
                <div>Guide: Has view permissions</div>
                <div>Member: Has view and task permissions</div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "leader" })}
                  className={cn(
                    "flex w-full justify-center text-black rounded-md px-3 py-1.5 text-sm font-semibold leading-6",
                    formData.role === "leader" ? "bg-yellow-500" : "bg-blue-600"
                  )}
                >
                  <span>Leader</span>
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
              </div>
            </div>
            <div className="flex gap-2 px-4">
              <button
                type="submit"
                className="flex w-full items-center gap-2 justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500"
              >
                <img src={invite} alt="Invite" />
                <span>Add Collaborator</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
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

export default AddEntityCollaboratorForm;
