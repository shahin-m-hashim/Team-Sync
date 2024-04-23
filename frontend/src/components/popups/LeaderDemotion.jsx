/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { updateData } from "@/services/db";
import { useNavigate, useParams } from "react-router-dom";
import { capitalizeFirstLetterOfEachWord } from "@/helpers/stringHandler";

/* eslint-disable react/prop-types */
function LeaderDemotion({
  entity,
  username,
  hideAddEntityForm,
  setShowEntityLeaderDemotion,
}) {
  const navigate = useNavigate();
  const { projectId, teamId, subTeamId } = useParams();

  useEffect(() => {
    hideAddEntityForm(false);
  }, []);

  const handleConfirm = async () => {
    setShowEntityLeaderDemotion(false);

    if (entity === "team") {
      await updateData(`projects/${projectId}/teams/${teamId}/leader`, {
        username,
      });
    } else {
      await updateData(
        `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/leader`,
        {
          username,
        }
      );
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center backdrop-filter backdrop-blur-sm">
      <div className="max-w-sm p-4 text-center bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold">
          {capitalizeFirstLetterOfEachWord(entity)} Leader Demotion !!!
        </h2>
        <p className="mb-4 text-gray-700">
          You will be demoted from the leader of this {entity} to a
          collaborator. You will no longer have access to this {entity}, add
          members, update settings and perform other leader actions.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
            onClick={() => handleConfirm()}
          >
            Are you sure ?
          </button>
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={() => {
              setShowEntityLeaderDemotion(false);
              hideAddEntityForm(true);
            }}
          >
            Cancel ?
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaderDemotion;
