/* eslint-disable react/prop-types */

import { useState } from "react";
import Loading from "@/components/Loading";
import ImageHandler from "@/components/ImageHandler";
import GroupedUsers from "@/components/GroupedUsers";
import UserNavbar from "@/components/navbars/UserNavbar";
import defaultIcon from "../../assets/images/defaultIcon.png";
import LeaderDemotion from "@/components/popups/LeaderDemotion";
import CurrentCollaborators from "@/components/CurrentCollaborators";
import { capitalizeFirstLetterOfEachWord } from "@/helpers/stringHandler";
import UpdateEntityDetailsForm from "@/components/forms/UpdateEntityDetailsForm";
import SendProjectInviteForm from "@/components/forms/projects/SendProjectInviteForm";
import AddTeamCollaboratorForm from "@/components/forms/teams/AddTeamCollaboratorForm";

const EntitySettings = ({
  entity,
  setIsEditing,
  entitySettings,
  entityIconPath,
  updateEntityIcon,
  deleteEntityIcon,
  validationSchema,
  kickCollaborator,
  showCurrentCollaborators,
  disableEntityUpdateButton,
  handleUpdateEntityDetails,
  setShowCurrentCollaborators,
  showUpdateEntityDetailsForm,
  showAddEntityCollaboratorForm,
  setShowUpdateEntityDetailsForm,
  setShowAddEntityCollaboratorForm,
}) => {
  const leader = entitySettings?.collaborators?.find(
    (collaborator) => collaborator.role === "Leader"
  );
  const guide = entitySettings?.collaborators?.find(
    (collaborator) => collaborator.role === "Guide"
  );

  const [
    showEntityLeaderDemotionConfirmation,
    setShowEntityLeaderDemotionConfirmation,
  ] = useState(false);

  return (
    <>
      {showEntityLeaderDemotionConfirmation && (
        <LeaderDemotion
          entity={entity}
          hideAddEntityForm={setShowAddEntityCollaboratorForm}
          username={showEntityLeaderDemotionConfirmation.username || ""}
          setShowEntityLeaderDemotion={setShowEntityLeaderDemotionConfirmation}
        />
      )}
      <div className="relative h-full">
        <UserNavbar />
        <div className="size-full overflow-auto p-10 text-white shadow-md bg-[#2b2a2a]">
          <h1 className="max-w-6xl mx-auto mt-12 text-2xl">
            {capitalizeFirstLetterOfEachWord(entity)} Settings
          </h1>
          <div className="grid max-w-6xl grid-cols-2 mx-auto mt-7 gap-x-10">
            {entitySettings ? (
              <div className="relative p-10 rounded-md bg-slate-700">
                <div className="mb-8 space-y-2">
                  <h1 className="text-xl font-semibold">General</h1>
                  <p className="text-xs text-gray-400">
                    Update your {entity}&apos;s general settings
                  </p>
                </div>
                <div className="absolute top-5 right-5">
                  <ImageHandler
                    MAX_SIZE={10}
                    btnSize="size-8"
                    size="size-[100px]"
                    type={`${entity} Icon`}
                    setIsEditing={setIsEditing}
                    position="right-0 bottom-0"
                    firebasePath={entityIconPath}
                    updateImage={updateEntityIcon}
                    deleteImage={deleteEntityIcon}
                    initialImage={entitySettings?.icon}
                    defaultImage={defaultIcon || entitySettings?.icon}
                  />
                </div>
                {showUpdateEntityDetailsForm ? (
                  <UpdateEntityDetailsForm
                    entity={entity}
                    setIsEditing={setIsEditing}
                    validationSchema={validationSchema}
                    disableEntityUpdateButton={disableEntityUpdateButton}
                    handleUpdateEntityDetails={handleUpdateEntityDetails}
                    initialData={{
                      name: entitySettings.name,
                      description: entitySettings.description,
                    }}
                    setShowUpdateEntityDetailsForm={
                      setShowUpdateEntityDetailsForm
                    }
                  />
                ) : (
                  <>
                    <div className="mb-8">
                      <label className="block mb-4 text-sm font-medium">
                        {capitalizeFirstLetterOfEachWord(entity)} Name
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                        {entitySettings?.name || `Your ${entity} name`}
                      </div>
                    </div>
                    <div className="mb-8">
                      <label className="block mb-4 text-sm font-medium">
                        {capitalizeFirstLetterOfEachWord(entity)} Description
                      </label>
                      <div className="w-full h-[6.5rem] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                        {entitySettings?.description ||
                          `Your ${entity} description`}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUpdateEntityDetailsForm(true)}
                      className="flex w-full mb-4 justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-green-500 focus-visible:outline"
                    >
                      Update {capitalizeFirstLetterOfEachWord(entity)}
                    </button>
                    <button
                      onClick={() => setShowUpdateEntityDetailsForm(true)}
                      className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500 focus-visible:outline"
                    >
                      Delete {capitalizeFirstLetterOfEachWord(entity)}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="relative py-[17rem] rounded-md bg-slate-700">
                <Loading />
              </div>
            )}

            {entitySettings ? (
              showAddEntityCollaboratorForm ? (
                <>
                  {entity === "project" && (
                    <SendProjectInviteForm
                      setShowSendProjectInviteForm={
                        setShowAddEntityCollaboratorForm
                      }
                    />
                  )}
                  {entity === "team" && (
                    <AddTeamCollaboratorForm
                      setShowAddTeamCollaboratorForm={
                        setShowAddEntityCollaboratorForm
                      }
                      setShowTeamLeaderDemotionConfirmation={
                        setShowEntityLeaderDemotionConfirmation
                      }
                    />
                  )}
                </>
              ) : (
                <div className="relative p-10 rounded-md bg-slate-700">
                  {showCurrentCollaborators && (
                    <CurrentCollaborators
                      kickCollaborator={kickCollaborator}
                      collaborators={entitySettings?.collaborators}
                      disableEntityUpdateButton={disableEntityUpdateButton}
                      setShowCurrentCollaborators={setShowCurrentCollaborators}
                    />
                  )}
                  <div className="mb-8 space-y-2">
                    <h1 className="text-xl font-semibold">Collaboration</h1>
                    <p className="text-xs text-gray-400">
                      View or {entity !== "Project" ? "add" : "invite"} new
                      collaborators into your {entity}
                    </p>
                  </div>
                  <div className="flex gap-3 mb-8">
                    <div className="flex-1">
                      <label className="block mb-4 text-sm font-medium">
                        {capitalizeFirstLetterOfEachWord(entity)} Leader
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                        {leader?.username || `Your ${entity} leader`}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block mb-4 text-sm font-medium">
                        {capitalizeFirstLetterOfEachWord(entity)} Guide
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                        {guide?.username || `Your ${entity} guide`}
                      </div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="block mb-4 text-sm font-medium">
                      {capitalizeFirstLetterOfEachWord(entity)} Collaborators
                    </label>
                    <GroupedUsers
                      limit={10}
                      addType="invit"
                      userType="collaborator"
                      users={entitySettings?.collaborators}
                    />
                  </div>
                  <label className="block mb-8 text-sm font-medium">
                    Missing something ? Try the options below.
                  </label>
                  <button
                    className="mb-4 flex w-full justify-center bg-green-500 hover:bg-green-600 rounded-md disabled:bg-green-400  px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm"
                    disabled={showCurrentCollaborators}
                    onClick={() => setShowCurrentCollaborators(true)}
                  >
                    <span>Manage all collaborators</span>
                  </button>
                  <button
                    disabled={showCurrentCollaborators}
                    onClick={() => setShowAddEntityCollaboratorForm(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 px-3 py-1.5 font-semibold text-black rounded-md disabled:bg-blue-300"
                  >
                    {entity !== "project" ? "Add" : "Invite"} New Collaborators
                  </button>
                </div>
              )
            ) : (
              <div className="relative py-[17rem] rounded-md bg-slate-700">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EntitySettings;
