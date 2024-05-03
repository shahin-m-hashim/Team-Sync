import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetterOfEachWord } from "@/helpers/stringHandler";

/* eslint-disable react/prop-types */
function EntityDeletedPopUp({ entity, setShowEntityDeletedPopUp }) {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center backdrop-filter backdrop-blur-md">
      <div className="max-w-sm p-4 text-center bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold">
          {capitalizeFirstLetterOfEachWord(entity)} Deleted !!!
        </h2>
        <p className="mb-4 text-gray-700">
          This {entity} has been deleted by its leader.
        </p>
        <button
          className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          onClick={() => {
            navigate(-1, { replace: true });
            setShowEntityDeletedPopUp(false);
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default EntityDeletedPopUp;
