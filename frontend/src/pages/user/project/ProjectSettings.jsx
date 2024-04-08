import Navbar from "@/components/dashboard/Navbar";
import { useEffect, useState } from "react";

import ajmalDp from "../../../assets/images/ajmalDp.png";
import user1 from "../../../assets/images/activities/user1.png";
import user2 from "../../../assets/images/activities/user2.png";
import user3 from "../../../assets/images/activities/user3.png";
import user4 from "../../../assets/images/activities/user4.png";
import invite from "../../../assets/images/invite.png";

const members = [
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
];

const SearchAssignee = () => {
  const [searchTxt, setSearchTxt] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    const filtered = members.filter((member) =>
      member.username.toLowerCase().includes(searchTxt.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTxt]);

  return (
    <div className="absolute top-0 left-[-200px] z-10 h-full p-2 bg-slate-700">
      <input
        type="text"
        onChange={(e) => setSearchTxt(e.target.value)}
        className="w-full px-2 py-2 my-4 bg-blue-500 border-2 rounded-lg border-block placeholder:text-black"
        placeholder="Search assignee"
      />
      <div className="h-[86%] overflow-auto">
        {filteredMembers.length !== 0 ? (
          filteredMembers.map((member, index) => (
            <button
              key={index}
              className="flex justify-between items-center w-full bg-slate-600 border-black border-[1px] p-2"
            >
              <div>{member.username}</div>
              <img className="size-8" src={member.dp} alt="memberDp" />
            </button>
          ))
        ) : (
          <div className="w-full p-2 text-center bg-slate-600">
            No member found
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectSettings = () => {
  return (
    <>
      <Navbar settings={"z-10 fixed top-0 left-0 right-0"} />
      <div className="size-full overflow-auto p-12 text-white shadow-md bg-[#2b2a2a]">
        <h1 className="max-w-6xl mx-auto text-3xl mt-14">Project Settings</h1>
        <div className="grid max-w-6xl grid-cols-2 mx-auto mt-10 w gap-y-5 gap-x-10">
          <div className="relative p-10 rounded-md bg-slate-700">
            <div className="mb-8 space-y-2">
              <h1 className="text-xl font-semibold">General</h1>
              <p className="text-xs text-gray-400">
                Update your account&apos;s general settings
              </p>
            </div>
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium">
                Project Name
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                Your project name
              </div>
            </div>
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium">
                Project Description
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                Your project description
              </div>
            </div>
            <button className="mt-10 flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
              <span>&nbsp;Update Info</span>
            </button>
          </div>
          <div className="relative p-10 rounded-md bg-slate-700">
            <div className="mb-8 space-y-2">
              <h1 className="text-xl font-semibold">Invite User&apos;s</h1>
              <p className="text-xs text-gray-400">
                Update or invite users into your project
              </p>
            </div>
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium">
                Collaboration
              </label>
              <div className="w-full px-3 py-2 bg-gray-300 border border-gray-300 rounded-md text-slate-600 focus:outline-none focus:border-indigo-500">
                Search for users to collaborate
              </div>
            </div>
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium">
                Project Role
              </label>
              <div className="w-full px-3 py-1 border rounded-md">
                Choose a role for inviting user in your project
              </div>
              <div className="flex gap-3">
                <button className="mt-10 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                  <span>&nbsp;Leader</span>
                </button>
                <button className="mt-10 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                  <span>&nbsp;Member</span>
                </button>
                <button className="mt-10 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                  <span>&nbsp;Guide</span>
                </button>
              </div>
            </div>

            <button className="mt-10 flex w-full items-center gap-3 justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <img src={invite}/>
              <span>&nbsp;Send Invite</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectSettings;
