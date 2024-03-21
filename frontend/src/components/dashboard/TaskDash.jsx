/* eslint-disable react/prop-types */
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";
import DetailCard from "../cards/DetailCard";
import { useContext } from "react";
import StatusCard from "../cards/StatusCard";
import { taskContext } from "@/contexts/taskContext";

export default function SubTeamDash({
  renderList,
  setRenderList,
  setShowAddPopUp,
}) {
  const {
    tasks,
    setTasks,
    yourTasks,
    initialTasks,
    resetTaskList,
    taskFilterBtnTxt,
    taskNameSearchTxt,
    listOnlyYourTasks,
    setTaskFilterBtnTxt,
    setTaskNameSearchTxt,
    setListOnlyYourTasks,
  } = useContext(taskContext);

  return (
    <>
      <div className="grid grid-cols-[1fr,1fr] text-white">
        <DetailCard
          details={{
            name: "Project 1",
            leader: "Shahin123",
            guide: "Sindhiya",
            nom: 20,
          }}
        />
        <StatusCard list={tasks} renderList={renderList} />
      </div>
      <div className="bg-[#141414] mx-1 rounded-t-md text-white">
        <ListHeader
          setList={setTasks}
          renderList={renderList}
          resetList={resetTaskList}
          leaderList={yourTasks}
          setRenderList={setRenderList}
          initialList={initialTasks}
          setShowAddPopUp={setShowAddPopUp}
          filterBtnTxt={taskFilterBtnTxt}
          switchList={listOnlyYourTasks}
          setSwitchList={setListOnlyYourTasks}
          listNameSearchTxt={taskNameSearchTxt}
          setFilterBtnTxt={setTaskFilterBtnTxt}
          setListNameSearchTxt={setTaskNameSearchTxt}
        />
      </div>
      <div
        id="scrollableListBody"
        className="flex flex-col h-svh overflow-auto m-1 mt-0 rounded-b-md bg-[#141414] text-white"
      >
        <ListSubHeader renderList={renderList} />
        <ListBody
          list={tasks}
          renderList={renderList}
          listNameSearchTxt={taskNameSearchTxt}
        />
      </div>
    </>
  );
}
