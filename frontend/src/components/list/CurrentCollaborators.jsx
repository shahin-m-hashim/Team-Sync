/* eslint-disable react/prop-types */

import defaultDp from "../../assets/images/defaultDp.png";

const CurrentCollaborators = ({
  collaborators,
  kickCollaborator,
  setShowCollaborators,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 h-full px-8 py-4 mb-8 rounded-md bg-slate-700">
      <button
        onClick={() => setShowCollaborators(false)}
        className="absolute top-2 right-2 bg-slate-600 p-1 rounded-[50%]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-red-500 cursor-pointer size-7 hover:text-red-600"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className=" grid grid-cols-[1fr,170px,100px] px-3 mb-5 font-medium">
        <span>user</span>
        <span className="pl-2">role</span>
        <span className="text-center">action</span>
      </div>
      <div className="h-[89%] overflow-auto ">
        {collaborators?.length !== 0 ? (
          collaborators?.map((collaborator) => (
            <div
              id={collaborator.username}
              key={collaborator.username}
              className="grid grid-cols-[1fr,170px,100px] w-full bg-slate-600 border-black border-[1px] p-2"
            >
              <div className="flex gap-5">
                <button>
                  <img
                    className="size-8 object-fit object-contain rounded-[50%]"
                    src={collaborator?.profilePic || defaultDp}
                  />
                </button>
                <div>{collaborator?.username}</div>
              </div>
              <div className="text-left">{collaborator?.role || "member"}</div>
              {collaborator?.role === "Leader" ? (
                <div className="text-center">N/A</div>
              ) : (
                <button
                  onClick={() =>
                    kickCollaborator(collaborator?.username, collaborator.role)
                  }
                  className="p-1 text-white bg-red-500"
                >
                  Kick
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="w-full p-2 text-center bg-slate-600">
            No collaborators found
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentCollaborators;
