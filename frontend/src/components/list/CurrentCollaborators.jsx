/* eslint-disable react/prop-types */

const CurrentCollaborators = ({ existingCollaborators = [] }) => {
  return (
    <div className="absolute left-0 right-0 z-10 h-[89.1%] px-8 py-4 mb-8 top-3 bg-slate-700">
      <div className=" grid grid-cols-[1fr,170px,100px] px-3 mb-5 font-medium">
        <span>user</span>
        <span className="pl-2">role</span>
        <span className="text-center">action</span>
      </div>
      <div className="h-full overflow-auto">
        {existingCollaborators.length !== 0 ? (
          existingCollaborators.map((collaborator, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr,170px,100px] w-full bg-slate-600 border-black border-[1px] p-2"
            >
              <div className="flex gap-5">
                <button>
                  <img className="size-8" src={collaborator.dp} />
                </button>
                <div>{collaborator?.username}</div>
              </div>
              <div className="text-left">{collaborator?.role || "member"}</div>
              <button className="bg-red-500 p-1 text-white ">Kick</button>
            </div>
          ))
        ) : (
          <div className="w-full h-full p-2 text-center bg-slate-600">
            No collaborators found
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentCollaborators;
