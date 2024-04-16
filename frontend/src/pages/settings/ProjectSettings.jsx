/* eslint-disable react/prop-types */

import useFetch from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { deleteData, updateData } from "@/services/db";
import { useParams } from "react-router-dom";
import { cn, getLocalSecureItem } from "@/lib/utils";
import GroupedUsers from "@/components/GroupedUsers";
import ImageHandler from "@/components/ImageHandler";
import { useContext, useEffect, useState } from "react";
import UserNavbar from "@/components/navbars/UserNavbar";
import { ErrorContext } from "@/providers/ErrorProvider";
import defaultIcon from "../../assets/images/defaultIcon.png";
import CurrentCollaborators from "@/components/list/CurrentCollaborators";
import SendProjectInviteForm from "@/components/forms/projects/SendProjectInviteForm";
import UpdateProjectDetailsForm from "@/components/forms/projects/UpdateProjectDetailsForm";

const ProjectSettings = () => {
  const { projectId } = useParams();
  const { id } = getLocalSecureItem("user", "low");
  const { setError } = useContext(ErrorContext);
  const [reFetchProjectSettings, setReFetchProjectSettings] = useState(false);

  const projectSettings = useFetch(
    `projects/${projectId}/settings`,
    reFetchProjectSettings
  );

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

  useEffect(() => {}, [projectSettings.data, reFetchProjectSettings]);

  if (projectSettings?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (projectSettings?.error === "serverError") {
    setError("serverError");
    return null;
  }

  const updateProjectIcon = async (downloadURL) => {
    await updateData(`projects/${projectId}/icon`, {
      newProjectIcon: downloadURL,
    });
    setReFetchProjectSettings((prev) => !prev);
  };

  const deleteProjectIcon = async () => {
    await deleteData(`projects/${projectId}/icon`);
    setReFetchProjectSettings((prev) => !prev);
  };

  return (
    <div className="relative h-full">
      <UserNavbar />
      <div className="size-full overflow-auto p-10 text-white shadow-md bg-[#2b2a2a]">
        <h1 className="max-w-6xl mx-auto mt-12 text-2xl">Project Settings</h1>
        <div className="grid max-w-6xl grid-cols-2 mx-auto mt-7 gap-x-10">
          {showSendProjectInviteForm ? (
            <SendProjectInviteForm
              projectId={projectId}
              setReFetchProjectSettings={setReFetchProjectSettings}
              setShowSendProjectInviteForm={setShowSendProjectInviteForm}
            />
          ) : projectSettings?.data ? (
            <div className="relative p-10 rounded-md bg-slate-700">
              {showCurrentCollaborators && (
                <CurrentCollaborators
                  existingCollaborators={projectSettings?.data?.collaborators}
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
                  MAX_SIZE={10}
                  btnSize="size-8"
                  size="size-[100px]"
                  type="Project"
                  setIsEditing={setIsEditing}
                  position="right-0 bottom-0"
                  updateImage={updateProjectIcon}
                  deleteImage={deleteProjectIcon}
                  initialImage={projectSettings?.data?.icon}
                  firebasePath={`users/${id}/projects/${projectId}/images/icon`}
                  defaultImage={defaultIcon || projectSettings?.data?.icon}
                />
              </div>
              {showUpdateProjectDetailsForm ? (
                <UpdateProjectDetailsForm
                  projectId={projectId}
                  setIsEditing={setIsEditing}
                  initialData={projectSettings?.data}
                  setReFetchProjectSettings={setReFetchProjectSettings}
                  setShowUpdateProjectDetailsForm={
                    setShowUpdateProjectDetailsForm
                  }
                />
              ) : (
                <>
                  <div className="mb-8">
                    <label className="block mb-4 text-sm font-medium">
                      Project Name
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                      {projectSettings?.data?.name || "Your project name"}
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="block mb-4 text-sm font-medium">
                      Project Description
                    </label>
                    <div className="w-full h-[6.5rem] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                      {projectSettings?.data?.description ||
                        "Your project description"}
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
          ) : (
            <div className="relative py-[17rem] rounded-md bg-slate-700">
              <Loading />
            </div>
          )}

          {projectSettings?.data ? (
            <div className="p-10 rounded-md bg-slate-700">
              <div className="mb-8 space-y-2">
                <h1 className="text-xl font-semibold">Collaboration</h1>
                <p className="text-xs text-gray-400">
                  View or invite new collaborators into your project
                </p>
              </div>
              <div className="flex gap-3 mb-8">
                <div className="flex-1">
                  <label className="block mb-4 text-sm font-medium">
                    Project Leader
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                    {projectSettings?.data?.leader || "Your project leader"}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block mb-4 text-sm font-medium">
                    Project Guide
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                    {projectSettings?.data?.guide || "Your project guide"}
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
                  users={projectSettings?.data?.collaborators}
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
          ) : (
            <div className="relative py-[17rem] rounded-md bg-slate-700">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
