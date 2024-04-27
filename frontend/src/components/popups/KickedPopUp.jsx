import { capitalizeFirstLetterOfEachWord } from "@/helpers/stringHandler";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
function KickedPopUp({ entity, setShowKickedFromEntityPopUp }) {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center backdrop-filter backdrop-blur-md">
      <div className="max-w-sm p-4 text-center bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold">
          Removed From {capitalizeFirstLetterOfEachWord(entity)} !!!
        </h2>
        <p className="mb-4 text-gray-700">
          You have been removed from the {entity} by the {entity} leader. You
          are no longer a collaborator and can no more access the {entity}&nbsp;
          resources.
        </p>
        <button
          className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          onClick={() => {
            setShowKickedFromEntityPopUp(false);
            navigate("/", { replace: true });
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default KickedPopUp;
