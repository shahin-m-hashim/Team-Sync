/* eslint-disable react/prop-types */

import { useState } from "react";
import { getLocalSecureItem } from "@/lib/utils";
import defaultDp from "../../assets/images/defaultDp.png";

function SelectCollaborator({
  parent,
  parentMembers,
  handleSelectUser,
  setShowAddCollaboratorForm,
}) {
  const user = getLocalSecureItem("user", "low");

  parentMembers = parentMembers?.filter(
    (member) => member.username !== user.username
  );

  const currentUser = getLocalSecureItem("user", "low");

  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchedParentMembers, setSearchedParentMembers] = useState([]);

  const handleSearch = async (e) => {
    const searchTxt = e.target.value;
    try {
      const filteredMembers = parentMembers?.filter((member) =>
        member.username.includes(searchTxt)
      );
      setSearchedParentMembers(filteredMembers);
    } catch (e) {
      console.log(e);
    }
    if (e.target.value === "") {
      setSearchedParentMembers([]);
      setShowSearchResults(false);
    } else {
      setShowSearchResults(true);
    }
  };

  return (
    <>
      <input
        type="text"
        onChange={handleSearch}
        className="w-full px-2 py-2 mt-5 mb-4 bg-blue-500 border-2 rounded-lg border-block placeholder:text-black"
        placeholder={`Search member from ${parent} by their username`}
      />
      <h1 className="mt-2 mb-4">All parent {parent} members</h1>
      <div className="h-[60%] overflow-auto">
        {showSearchResults ? (
          <>
            {searchedParentMembers.length > 0 &&
            searchedParentMembers.some(
              (searchedMember) =>
                searchedMember.username !== currentUser.username
            ) ? (
              searchedParentMembers.map((searchedMember) => (
                <button
                  type="button"
                  key={searchedMember._id}
                  onClick={() => handleSelectUser(searchedMember)}
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
            {parentMembers?.length > 0 ? (
              parentMembers?.map((member) => (
                <button
                  type="button"
                  id={member._id}
                  key={member._id}
                  onClick={() => handleSelectUser(member)}
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
                Currently, there are no members in your parent {parent}
              </div>
            )}
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => setShowAddCollaboratorForm(false)}
        className="flex w-full items-center gap-2 mt-3 justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500"
      >
        Done Adding ? Exit
      </button>
    </>
  );
}

export default SelectCollaborator;
