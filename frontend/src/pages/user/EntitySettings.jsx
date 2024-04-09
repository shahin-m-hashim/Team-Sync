/* eslint-disable react/prop-types */

import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
} from "@/helpers/stringHandler";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import GroupedUsers from "@/components/GroupedUsers";
import CurrentCollaborators from "@/components/list/CurrentCollaborators";
import UpdateEntityDetailsForm from "@/components/forms/UpdateEntityDetailsForm";
import AddEntityCollaboratorForm from "@/components/forms/AddEntityCollaboratorForm";

const EntitySettings = ({
  members,
  entityData,
  entity = "",
  memberParent,
  validationSchema,
  existingCollaborators,
  handleUpdateEntityDetails,
  handleSubmitAddCollaborator,
}) => {
  const [showAddEntityCollaboratorForm, setShowAddEntityCollaboratorForm] =
    useState(false);
  const [showCurrentCollaborators, setShowCurrentCollaborators] =
    useState(false);
  const [showUpdateEntityDetailsForm, setShowUpdateEntityDetailsForm] =
    useState(false);

  return (
    <div className="relative h-full">
      <Navbar settings={"z-10 fixed top-0 left-0 right-0"} />
      <div className="size-full overflow-auto p-12 text-white shadow-md bg-[#2b2a2a]">
        <h1 className="max-w-6xl mx-auto mt-6 text-2xl">
          {capitalizeFirstLetter(entity)} Settings
        </h1>
        <div className="grid max-w-6xl grid-cols-2 mx-auto mt-7 w gap-y-5 gap-x-10">
          {showAddEntityCollaboratorForm ? (
            <AddEntityCollaboratorForm
              entity={entity}
              members={members}
              memberParent={memberParent}
              handleSubmitAddCollaborator={handleSubmitAddCollaborator}
              setShowAddEntityCollaboratorForm={
                setShowAddEntityCollaboratorForm
              }
            />
          ) : (
            <div className="relative p-10 rounded-md bg-slate-700">
              {showCurrentCollaborators && (
                <CurrentCollaborators
                  entity={entity}
                  existingCollaborators={existingCollaborators}
                />
              )}
              <div className="mb-8 space-y-2">
                <h1 className="text-xl font-semibold">General</h1>
                <p className="text-xs text-gray-400">
                  Update your {entity}&apos;s general settings
                </p>
              </div>
              <div
                className={cn(
                  showUpdateEntityDetailsForm ? "mb-3" : " mb-8",
                  "flex gap-3"
                )}
              >
                <div className="flex-1">
                  <label className="block mb-4 text-sm font-medium">
                    {capitalizeFirstLetterOfEachWord(entity)} Leader
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                    {entityData?.leader ||
                      `Your ${capitalizeFirstLetter(entity)} leader`}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block mb-4 text-sm font-medium">
                    {capitalizeFirstLetterOfEachWord(entity)} Guide
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                    {entityData?.guide ||
                      `Your ${capitalizeFirstLetter(entity)} guide`}
                  </div>
                </div>
              </div>
              {showUpdateEntityDetailsForm ? (
                <UpdateEntityDetailsForm
                  entity={entity}
                  entityData={entityData}
                  validationSchema={validationSchema}
                  handleUpdateEntityDetails={handleUpdateEntityDetails}
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
                      {entityData?.name || `Your ${entity} name`}
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="block mb-4 text-sm font-medium">
                      {capitalizeFirstLetterOfEachWord(entity)} Description
                    </label>
                    <div className="w-full h-[4.2rem] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                      {entityData?.description || `Your ${entity} description`}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUpdateEntityDetailsForm(true)}
                    className="mt-8 flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-green-500 focus-visible:outline "
                  >
                    Update {capitalizeFirstLetterOfEachWord(entity)}
                  </button>
                </>
              )}
            </div>
          )}

          <div className="p-10 rounded-md bg-slate-700">
            <div className="mb-8 space-y-2">
              <h1 className="text-xl font-semibold">Collaboration</h1>
              <p className="text-xs text-gray-400">
                View or invite new collaborators into your {entity}
              </p>
            </div>
            <div className="mb-8">
              <label className="block mb-4 text-sm font-medium">
                Total no of collaborators in this {entity}
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                {existingCollaborators.length || 0} collaborators
              </div>
            </div>
            <div className="mb-8">
              <label className="block mb-4 text-sm font-medium">
                {capitalizeFirstLetterOfEachWord(entity)} Collaborators
              </label>
              <GroupedUsers
                limit={10}
                userType="collaborator"
                users={existingCollaborators}
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
                "mb-8 flex w-full justify-center rounded-md disabled:bg-green-400  px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm"
              )}
              disabled={showAddEntityCollaboratorForm}
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
              onClick={() => setShowAddEntityCollaboratorForm(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 px-3 py-1.5 font-semibold text-black rounded-md disabled:bg-blue-300"
            >
              Add New Collaborators
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntitySettings;
