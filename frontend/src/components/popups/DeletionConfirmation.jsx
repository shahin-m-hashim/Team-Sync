/* eslint-disable react/prop-types */

export default function DeleteConfirmation({
  entity,
  deleteEntity,
  setShowDeleteConfirmation,
}) {
  const deletionConfirmationMsg =
    entity === "project"
      ? `Once you delete this ${entity}, all the associated teams, tasks, etc will also be deleted.`
      : entity === "team"
        ? `Once you delete this ${entity}, all the associated tasks will also be deleted.`
        : "Know that this action is irreversible. All the data and overall analytics associated with this task will also be deleted.";

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center backdrop-filter backdrop-blur-md">
      <div className="max-w-sm p-4 text-center bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">
          Are you sure you want to delete this {entity} ?
        </h2>
        <p className="mb-4 text-gray-700">{deletionConfirmationMsg}</p>
        <button
          className="px-4 py-2 mr-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          onClick={() => {
            setShowDeleteConfirmation(false);
            deleteEntity();
          }}
        >
          Yes
        </button>
        <button
          onClick={() => setShowDeleteConfirmation(false)}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          No
        </button>
      </div>
    </div>
  );
}
