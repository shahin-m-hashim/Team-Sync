/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom";
import { getLocalSecureItem } from "@/lib/utils";
import bye from "../../assets/images/bye brain.png";

export default function EmptyListBody({ renderList, listNameSearchTxt }) {
  const { projectId, teamId } = useParams();
  const teams = getLocalSecureItem("teams", "medium");
  const projects = getLocalSecureItem("projects", "medium");

  const projectRole = projects?.find(
    (project) => project.id === projectId
  )?.role;

  const teamRole = teams?.find((team) => team.id === teamId)?.role;

  return (
    <div className="flex items-center justify-center gap-10 my-auto text-xl text-center">
      <img src={bye} className="w-60" />
      {renderList === "Project" ? (
        <div className="max-w-sm">
          {listNameSearchTxt === "" ? (
            <>
              <div className="mb-2">You currently have no projects</div>
              <div className="text-[#BDBDBD] text-base">
                How about you create one, <br /> or join an existing project ?
              </div>
            </>
          ) : (
            <span>Your Search does not match any project.</span>
          )}
        </div>
      ) : renderList === "Team" ? (
        <div className="max-w-xs">
          {listNameSearchTxt === "" ? (
            projectRole === "Leader" ? (
              <>
                <div className="mb-2">You currently have no teams !!!</div>
                <div className="text-[#BDBDBD] text-base">
                  How about you create one ?
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">
                  There are currently no teams created by the project leader.
                </div>
                <div className="text-[#BDBDBD] text-base">
                  He might create one soon.
                </div>
              </>
            )
          ) : (
            <span>Your Search does not match any team</span>
          )}
        </div>
      ) : (
        <div className="max-w-sm">
          {listNameSearchTxt === "" ? (
            <>
              {teamRole === "Leader" ? (
                <>
                  <div className="mb-2">
                    You haven&apos;t assigned any tasks to the members in this
                    team
                  </div>
                  <div className="text-[#BDBDBD] text-base">
                    How about you assign one ?
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2">
                    The team leader hasn&apos;t yet assigned any tasks in this
                    team.
                  </div>
                  <div className="text-[#BDBDBD] text-base">
                    You will be notified if you are assigned any.
                  </div>
                </>
              )}
            </>
          ) : (
            <span>Your Search does not match any task</span>
          )}
        </div>
      )}
    </div>
  );
}
