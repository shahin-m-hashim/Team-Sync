/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import { useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import ajmalDp from "../../../assets/images/ajmalDp.png";
import user1 from "../../../assets/images/activities/user1.png";
import user2 from "../../../assets/images/activities/user2.png";
import user3 from "../../../assets/images/activities/user3.png";
import user4 from "../../../assets/images/activities/user4.png";
import SendProjectInviteForm from "@/components/forms/projects/SendProjectInviteForm";
import UpdateProjectDetailsForm from "@/components/forms/projects/UpdateProjectDetailsForm";

// const members = [
//   {
//     username: "ajmal236",
//     dp: ajmalDp,
//   },
//   {
//     username: "shahin128",
//     dp: user1,
//   },
//   {
//     username: "hari5436",
//     dp: user2,
//   },
//   {
//     username: "asma098",
//     dp: user3,
//   },
//   {
//     username: "thomson12",
//     dp: user4,
//   },
//   {
//     username: "ajmal236",
//     dp: ajmalDp,
//   },
//   {
//     username: "shahin128",
//     dp: user1,
//   },
//   {
//     username: "hari5436",
//     dp: user2,
//   },
//   {
//     username: "asma098",
//     dp: user3,
//   },
//   {
//     username: "thomson12",
//     dp: user4,
//   },
//   {
//     username: "ajmal236",
//     dp: ajmalDp,
//   },
//   {
//     username: "shahin128",
//     dp: user1,
//   },
//   {
//     username: "hari5436",
//     dp: user2,
//   },
//   {
//     username: "asma098",
//     dp: user3,
//   },
//   {
//     username: "thomson12",
//     dp: user4,
//   },
// ];

const CurrentCollaborators = ({ existingCollaborators = [] }) => {
  return (
    <div className="absolute left-0 right-0 z-10 h-[85.2%] px-8 py-4 mb-8 top-3 bg-slate-700">
      <label className="block mb-5 font-medium">
        All your project collaborators
      </label>
      <div className="h-full overflow-auto">
        {existingCollaborators.length !== 0 ? (
          existingCollaborators.map((collaborator, index) => (
            <button
              key={index}
              className="flex justify-between items-center w-full bg-slate-600 border-black border-[1px] p-2"
            >
              <img className="size-8" src={collaborator.dp} />
              <div>{collaborator?.username}</div>
              <div>{collaborator?.role || "member"}</div>
            </button>
          ))
        ) : (
          <div className="w-full h-full p-2 text-center bg-slate-600">
            No member found
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectSettings = () => {
  const existingCollaborators = [
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

  const users = [
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

  const projectData = {
    name: "Project 1",
    leader: "shahin123",
    guide: "ajmal236",
    description: "",
  };

  const [showSendProjectInviteForm, setShowSendProjectInviteForm] =
    useState(false);
  const [showCurrentCollaborators, setShowCurrentCollaborators] =
    useState(false);
  const [showUpdateProjectDetailsForm, setShowUpdateProjectDetailsForm] =
    useState(false);

  return (
    <div className="relative h-full">
      <Navbar settings={"z-10 fixed top-0 left-0 right-0"} />
      <div className="size-full overflow-auto p-12 text-white shadow-md bg-[#2b2a2a]">
        <div className="grid max-w-6xl grid-cols-2 mx-auto mt-14 w gap-y-5 gap-x-10">
          {showSendProjectInviteForm ? (
            <SendProjectInviteForm
              users={users}
              setShowSendProjectInviteForm={setShowSendProjectInviteForm}
            />
          ) : (
            <div className="relative p-10 rounded-md bg-slate-700">
              {showCurrentCollaborators && (
                <CurrentCollaborators
                  existingCollaborators={existingCollaborators}
                />
              )}
              <div className="mb-8 space-y-2">
                <h1 className="text-xl font-semibold">General</h1>
                <p className="text-xs text-gray-400">
                  Update your project&apos;s general settings
                </p>
              </div>
              <div
                className={cn(
                  showUpdateProjectDetailsForm ? "mb-3" : " mb-8",
                  "flex gap-3"
                )}
              >
                <div className="flex-1">
                  <label className="block mb-4 text-sm font-medium">
                    Project Leader
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                    {projectData?.leader || "Your project leader"}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block mb-4 text-sm font-medium">
                    Project Guide
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                    {projectData?.guide || "Your project guide"}
                  </div>
                </div>
              </div>
              {showUpdateProjectDetailsForm ? (
                <UpdateProjectDetailsForm
                  setShowUpdateProjectDetailsForm={
                    setShowUpdateProjectDetailsForm
                  }
                  projectData={projectData}
                />
              ) : (
                <>
                  <div className="mb-8">
                    <label className="block mb-4 text-sm font-medium">
                      Project Name
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                      {projectData?.name || "Your project name"}
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="block mb-4 text-sm font-medium">
                      Project Description
                    </label>
                    <div className="w-full h-[4.2rem] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                      {projectData?.description || "Your project description"}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUpdateProjectDetailsForm(true)}
                    className="mt-8 flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-green-500 focus-visible:outline "
                  >
                    Update Project
                  </button>
                </>
              )}
            </div>
          )}

          <div className="p-10 rounded-md bg-slate-700">
            <div className="mb-8 space-y-2">
              <h1 className="text-xl font-semibold">Collaboration</h1>
              <p className="text-xs text-gray-400">
                View or invite new collaborators into your project
              </p>
            </div>
            <div className="mb-8">
              <label className="block mb-4 text-sm font-medium">
                Total no of collaborators in this project
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                {existingCollaborators.length || 0} collaborators
              </div>
            </div>
            <div className="relative flex items-center mb-12">
              <label className="block mb-16 text-sm font-medium">
                Project Collaborators
              </label>
              <div>
                <img
                  className="absolute object-cover object-center left-0 z-[1px] size-12"
                  src={existingCollaborators[0]?.dp}
                />
                <img
                  className="absolute object-cover object-center z-[2px] left-8 size-12"
                  src={existingCollaborators[1]?.dp}
                />
                <img
                  className="absolute object-cover object-center z-[3px] left-16 size-12 "
                  src={existingCollaborators[2]?.dp}
                />
                <img
                  className="absolute object-cover object-center z-[4px] left-24 size-12 "
                  src={existingCollaborators[3]?.dp}
                />
                <img
                  className="absolute object-cover object-center z-[5px] left-32 size-12"
                  src={existingCollaborators[4]?.dp}
                />
                <img
                  className="absolute object-cover object-center z-[6px] left-40 size-12"
                  src={existingCollaborators[5]?.dp}
                />
                <img
                  className="absolute object-cover object-center z-[7px] left-48 size-12"
                  src={existingCollaborators[6]?.dp}
                />
                <img
                  className="absolute object-cover object-center z-[8px] left-56 size-12 "
                  src={existingCollaborators[7]?.dp}
                />
                <img
                  className="absolute object-cover object-center z-[10px] left-64 size-12 "
                  src={existingCollaborators[8]?.dp}
                />
                <img
                  className="absolute object-cover object-center z-[11px] left-72 size-12"
                  src={existingCollaborators[9]?.dp}
                />
                <div className="absolute text-sm font-medium bg-black border-2 p-6 border-slate-300 flex justify-center items-center size-12 rounded-[50%] z-[12px] left-[20rem]">
                  {existingCollaborators.length - 10}+
                </div>
              </div>
            </div>
            <label className="block mb-8 text-sm font-medium">
              Missing something ? Try the options below.
            </label>
            <button
              className={cn(
                showCurrentCollaborators
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600",
                "mb-8 flex w-full justify-center rounded-md disabled:bg-green-400  px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm"
              )}
              disabled={showSendProjectInviteForm}
              onClick={() =>
                setShowCurrentCollaborators(!showCurrentCollaborators)
              }
            >
              <span>
                {!showCurrentCollaborators ? "View" : "Close"} all current
                collaborators and their roles
              </span>
            </button>
            <button
              disabled={showCurrentCollaborators}
              onClick={() => setShowSendProjectInviteForm(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 px-3 py-1.5 font-semibold text-black rounded-md disabled:bg-blue-300"
            >
              Invite New Collaborators
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
