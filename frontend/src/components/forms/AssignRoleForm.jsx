/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import invite from "../../assets/images/invite.png";

function AssignRoleForm({
  entity,
  selectedUser,
  selectedRole,
  disableButton,
  setSelectedRole,
  cancelAddCollaborator,
}) {
  return (
    <>
      <div className="my-8">
        <label className="block mt-[-7px] mb-4 text-xl font-medium">
          Inviting collaborator
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
          {selectedUser.username}
        </div>
      </div>
      <label className="block mb-2 font-medium">Project Role</label>
      <div className="p-4 mb-4 bg-slate-600">
        <span className="block text-sm">
          Choose a role for inviting user in your project
        </span>
        <div className="flex flex-col gap-5 my-6">
          <div>Leader: Has full control</div>
          <div>Guide: Has view permissions</div>
          <div>Member: Has view and task permissions</div>
        </div>
        <div className="flex gap-3">
          {entity !== "project" && (
            <button
              type="button"
              onClick={() => setSelectedRole("leader")}
              className={cn(
                "flex w-full justify-center text-black rounded-md px-3 py-1.5 text-sm font-semibold leading-6",
                selectedRole === "leader" ? "bg-yellow-500" : "bg-blue-600"
              )}
            >
              <span>Leader</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setSelectedRole("guide")}
            className={cn(
              selectedRole === "guide" ? "bg-yellow-500" : "bg-blue-600",
              "flex w-full justify-center text-black rounded-md px-3 py-1.5 text-sm font-semibold leading-6"
            )}
          >
            <span>Guide</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("member")}
            className={cn(
              selectedRole === "member" ? "bg-yellow-500" : "bg-blue-600",
              "flex w-full justify-center text-black rounded-md px-3 py-1.5 text-sm font-semibold leading-6"
            )}
          >
            <span>Member</span>
          </button>
        </div>
      </div>
      <div className="flex gap-2 px-4">
        <button
          type="submit"
          disabled={disableButton}
          className="flex w-full items-center gap-2 justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500"
        >
          <img src={invite} />
          {entity === "project" ? (
            <span>Send Invite</span>
          ) : (
            <span>Add Collaborator</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => cancelAddCollaborator()}
          className="flex w-full items-center gap-2 justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500"
        >
          <span>Cancel</span>
        </button>
      </div>
    </>
  );
}

export default AssignRoleForm;
