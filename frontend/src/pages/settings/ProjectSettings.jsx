/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import GroupedUsers from "@/components/GroupedUsers";
import ImageHandler from "@/components/ImageHandler";
import ajmalDp from "../../assets/images/ajmalDp.png";
import UserNavbar from "@/components/navbars/UserNavbar";
import user1 from "../../assets/images/activities/user1.png";
import user2 from "../../assets/images/activities/user2.png";
import user3 from "../../assets/images/activities/user3.png";
import user4 from "../../assets/images/activities/user4.png";
import defaultIcon from "../../assets/images/defaultIcon.png";
import CurrentCollaborators from "@/components/list/CurrentCollaborators";
import SendProjectInviteForm from "@/components/forms/projects/SendProjectInviteForm";
import UpdateProjectDetailsForm from "@/components/forms/projects/UpdateProjectDetailsForm";

const existingProjectCollaborators = [
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

const ProjectSettings = () => {
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
    description: "",
    name: "Project 1",
    leader: "shahin123",
    guide: "sindhiya123",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [showSendProjectInviteForm, setShowSendProjectInviteForm] =
    useState(false);
  const [showCurrentCollaborators, setShowCurrentCollaborators] =
    useState(false);
  const [showUpdateProjectDetailsForm, setShowUpdateProjectDetailsForm] =
    useState(false);

  useEffect(() => {
    if (!isEditing) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to leave?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing]);

  return (
    <div className="relative h-full">
      <UserNavbar />
      <div className="size-full overflow-auto p-10 text-white shadow-md bg-[#2b2a2a]">
        <h1 className="max-w-6xl mx-auto mt-12 text-2xl">Project Settings</h1>
        <div className="grid max-w-6xl grid-cols-2 mx-auto mt-7 gap-x-10">
          {showSendProjectInviteForm ? (
            <SendProjectInviteForm
              users={users}
              setShowSendProjectInviteForm={setShowSendProjectInviteForm}
            />
          ) : (
            <div className="relative p-10 rounded-md bg-slate-700">
              {showCurrentCollaborators && (
                <CurrentCollaborators
                  existingCollaborators={existingProjectCollaborators}
                />
              )}
              <div className="mb-8 space-y-2">
                <h1 className="text-xl font-semibold">General</h1>
                <p className="text-xs text-gray-400">
                  Update your project&apos;s general settings
                </p>
              </div>
              <div className="absolute top-5 right-5">
                <ImageHandler
                  firebasePath=""
                  size="size-[120px]"
                  defaultImage={defaultIcon}
                  setIsEditing={setIsEditing}
                  position="right-0 bottom-0"
                />
              </div>
              {showUpdateProjectDetailsForm ? (
                <UpdateProjectDetailsForm
                  setShowUpdateProjectDetailsForm={
                    setShowUpdateProjectDetailsForm
                  }
                  initialData={projectData}
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
                    <div className="w-full h-[6.5rem] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                      {projectData?.description || "Your project description"}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUpdateProjectDetailsForm(true)}
                    className="flex w-full mb-4 justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-green-500 focus-visible:outline"
                  >
                    Update Project
                  </button>
                  <button
                    onClick={() => setShowUpdateProjectDetailsForm(true)}
                    className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500 focus-visible:outline"
                  >
                    Delete Project
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
            <div className="mb-8 flex gap-3">
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
            <div className="mb-8">
              <label className="block mb-4 text-sm font-medium">
                Project Collaborators
              </label>
              <GroupedUsers
                limit={10}
                addType="invit"
                userType="collaborator"
                users={existingProjectCollaborators}
              />
            </div>
            <label className="block mb-8 text-sm font-medium">
              Missing something ? Try the options below.
            </label>
            <button
              className={cn(
                showCurrentCollaborators
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600",
                "mb-4 flex w-full justify-center rounded-md disabled:bg-green-400  px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm"
              )}
              disabled={showSendProjectInviteForm}
              onClick={() =>
                setShowCurrentCollaborators(!showCurrentCollaborators)
              }
            >
              <span>
                {!showCurrentCollaborators ? "Manage" : "Close"} all
                collaborators
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
