/* eslint-disable react/prop-types */

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
      <div className="p-6 mb-4 bg-slate-600">
        <div>Choose a role for inviting user in your project</div>
        <div className="flex flex-col gap-5 my-6 text-lg">
          {entity !== "project" && (
            <div className="flex gap-3">
              <input
                id="leader"
                name="role"
                type="radio"
                value="leader"
                checked={selectedRole === "leader"}
                onChange={() => setSelectedRole("leader")}
              />
              <label htmlFor="leader">Leader: Has full control</label>
            </div>
          )}
          <div className="flex gap-3">
            <input
              id="guide"
              name="role"
              type="radio"
              value="guide"
              checked={selectedRole === "guide"}
              onChange={() => setSelectedRole("guide")}
            />
            <label htmlFor="guide">Guide: Has view permissions</label>
          </div>
          <div className="flex gap-3">
            <input
              id="member"
              name="role"
              type="radio"
              value="member"
              checked={selectedRole === "member"}
              onChange={() => setSelectedRole("member")}
            />
            <label htmlFor="member">
              Member: Has view and task permissions
            </label>
          </div>
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
