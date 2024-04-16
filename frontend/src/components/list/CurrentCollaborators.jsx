/* eslint-disable react/prop-types */
import { useState } from "react";
import defaultDp from "../../assets/images/defaultDp.png";

const CurrentCollaborators = ({ existingCollaborators }) => {
  const [collaborators, setCollaborators] = useState(existingCollaborators);

  const kickCollaborator = (username) => {
    const updatedCollaborators = collaborators.filter(
      (collaborator) => collaborator.username !== username
    );
    setCollaborators(updatedCollaborators);
  };

  return (
    <div className="absolute left-0 right-0 z-10 h-full px-8 py-4 mb-8 top-3 bg-slate-700">
      <div className=" grid grid-cols-[1fr,170px,100px] px-3 mb-5 font-medium">
        <span>user</span>
        <span className="pl-2">role</span>
        <span className="text-center">action</span>
      </div>
      <div className="h-[89%] overflow-auto ">
        {collaborators?.length !== 0 ? (
          collaborators?.map(
            (collaborator) =>
              collaborator.role !== "Leader" && (
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
                  <div className="text-left">
                    {collaborator?.role || "member"}
                  </div>
                  <button
                    onClick={() => kickCollaborator(collaborator.username)}
                    className="p-1 text-white bg-red-500"
                  >
                    Kick
                  </button>
                </div>
              )
          )
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
