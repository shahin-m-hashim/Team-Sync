/* eslint-disable react/prop-types */
import ActivityCard from "@/components/cards/ActivityCard";
import MessageCard from "@/components/cards/MessageCard";
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";
import { useContext } from "react";
import { projectContext } from "@/contexts/projectContext";
import StatusCard from "../cards/StatusCard";

export default function ProjectDash({
  renderList,
  setRenderList,
  setShowAddPopUp,
}) {
  const {
    projects,
    setProjects,
    leaderProjects,
    initialProjects,
    resetProjectList,
    projectFilterBtnTxt,
    projectNameSearchTxt,
    listOnlyAdminProjects,
    setProjectFilterBtnTxt,
    setProjectNameSearchTxt,
    setListOnlyAdminProjects,
  } = useContext(projectContext);

  return (
    <>
      <div className="grid grid-cols-[1.3fr,1fr,330px] text-white">
        <StatusCard list={projects} renderList={renderList} />
        <ActivityCard />
        <MessageCard />
      </div>
      <div className="bg-[#141414] mx-1 rounded-t-md text-white">
        <ListHeader
          setList={setProjects}
          renderList={renderList}
          resetList={resetProjectList}
          leaderList={leaderProjects}
          setRenderList={setRenderList}
          initialList={initialProjects}
          setShowAddPopUp={setShowAddPopUp}
          filterBtnTxt={projectFilterBtnTxt}
          switchList={listOnlyAdminProjects}
          setSwitchList={setListOnlyAdminProjects}
          listNameSearchTxt={projectNameSearchTxt}
          setFilterBtnTxt={setProjectFilterBtnTxt}
          setListNameSearchTxt={setProjectNameSearchTxt}
        />
      </div>
      <div
        id="scrollableListBody"
        className="flex flex-col h-svh overflow-auto m-1 mt-0 rounded-b-md bg-[#141414] text-white"
      >
        <ListSubHeader renderList={renderList} />
        <ListBody
          list={projects}
          renderList={renderList}
          listNameSearchTxt={projectNameSearchTxt}
        />
      </div>
    </>
  );
}
