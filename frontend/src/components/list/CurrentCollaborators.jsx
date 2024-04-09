/* eslint-disable react/prop-types */

const CurrentCollaborators = ({ entity, existingCollaborators = [] }) => {
  return (
    <div className="absolute left-0 right-0 z-10 h-[86.3%] px-8 py-4 mb-8 top-3 bg-slate-700">
      <label className="block mb-5 font-medium">
        All your {entity} collaborators
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
            No collaborators found
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentCollaborators;
