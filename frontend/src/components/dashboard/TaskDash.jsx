/* eslint-disable react/prop-types */
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";
import DetailCard from "../cards/DetailCard";
import CircularStatusBar from "../CircularStatusBar";
import { cn } from "@/lib/utils";
import CircularProgress from "../CircularProgress";
import { useContext } from "react";
import { subTeamContext } from "@/contexts/subTeamContext";
import { taskContext } from "@/contexts/taskContext";

export default function TaskDash({
  setRenderList,
  renderList,
  setShowAddPopUp,
}) {
  const { subTeams } = useContext(subTeamContext);
  const { statusProgress } = useContext(taskContext);

  const { notStarted, pending, stopped, done } = statusProgress;

  if (notStarted === 0 && pending === 0 && stopped === 0 && done === 0) {
    statusProgress.empty = 0;
  }

  return (
    <>
      <div className="grid grid-cols-[1fr,1fr] text-white">
        <DetailCard
          details={{
            name: "Sub Team 1",
            leader: "Shahin123",
            guide: "Sindhiya",
            nom: 30,
          }}
        />
        <div className="bg-[#141414] m-1 rounded-lg flex p-5 px-10 ">
          <div className="relative flex items-center justify-center text-center">
            <CircularStatusBar statusProgress={statusProgress} width="73%" />
            <span
              className={cn(
                done === 0 ? "text-lg" : "text-xl bottom-[38%]",
                "absolute"
              )}
            >
              {done === 0 ? (
                <span>
                  <span>Nothing </span>
                  <br />
                  <span>To Show !!!</span>
                </span>
              ) : (
                <span>
                  {done} <br /> Complete
                </span>
              )}
            </span>
          </div>
          <CircularProgress list={subTeams} />
        </div>
      </div>
      <div className="bg-[#141414] mx-1 rounded-t-md text-white">
        <ListHeader
          setShowAddPopUp={setShowAddPopUp}
          setRenderList={setRenderList}
          renderList={renderList}
        />
      </div>
      <div
        id="scrollableListBody"
        className="flex flex-col h-svh overflow-auto m-1 mt-0 rounded-b-md bg-[#141414] text-white"
      >
        <ListSubHeader renderList={renderList} />
        <ListBody renderList={renderList} />
      </div>
    </>
  );
}
