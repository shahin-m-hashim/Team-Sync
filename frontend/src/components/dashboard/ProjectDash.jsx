/* eslint-disable react/prop-types */
import StatusCard from "../cards/StatusCard";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "../list/ListSubHeader";
import { listReducer } from "@/helpers/listReducer";
import ListHeader from "@/components/list/ListHeader";
import { useEffect, useReducer, useState } from "react";
import MessageCard from "@/components/cards/MessageCard";
import ActivityCard from "@/components/cards/ActivityCard";
import AddProjectForm from "../forms/projects/AddProjectForm";

export default function ProjectDash() {
  // const { projects } = useContext(ProjectContext);

  const projects = [];

  const leaderProjects = projects.filter(
    (project) => project.role === "Leader"
  );

  const [projectNameSearchTxt, setProjectNameSearchTxt] = useState("");
  const [projectFilterBtnTxt, setProjectFilterBtnTxt] = useState("Filter");
  const [listOnlyAdminProjects, setListOnlyAdminProjects] = useState(false);

  const resetProjectList = () => {
    setProjectNameSearchTxt("");
    setListOnlyAdminProjects(false);
    setProjectFilterBtnTxt("Filter");
    setProjects({
      type: "RESET",
      initialState: projects,
    });
  };

  const [initialProjects, dispatch] = useReducer(listReducer, projects);
  const setProjects = (action) => dispatch(action);

  useEffect(() => {
    setProjectNameSearchTxt("");
    setProjectFilterBtnTxt("Filter");
    if (listOnlyAdminProjects) {
      setProjects({
        type: "SWITCH",
        payload: leaderProjects,
      });
    } else {
      setProjects({
        type: "SWITCH",
        payload: projects,
      });
    }
  }, [listOnlyAdminProjects]);

  const [showProjectAddForm, setShowProjectAddForm] = useState(false);

  return (
    <>
      {showProjectAddForm && (
        <AddProjectForm setShowProjectAddForm={setShowProjectAddForm} />
      )}
      <div className="grid grid-cols-[1fr,1fr,1.3fr] min-h-[17rem] border-white border-2 border-t-0 text-white">
        <ActivityCard />
        <MessageCard />
        <StatusCard list={initialProjects} renderList="Project" />
      </div>
      <div>
        <ListHeader
          renderList="Project"
          setList={setProjects}
          leaderList={leaderProjects}
          resetList={resetProjectList}
          initialList={projects}
          filterBtnTxt={projectFilterBtnTxt}
          switchList={listOnlyAdminProjects}
          setShowAddForm={setShowProjectAddForm}
          setSwitchList={setListOnlyAdminProjects}
          listNameSearchTxt={projectNameSearchTxt}
          setFilterBtnTxt={setProjectFilterBtnTxt}
          setListNameSearchTxt={setProjectNameSearchTxt}
        />
      </div>
      <div className="flex flex-col h-full border-white border-2 rounded-b-md border-t-0 overflow-auto bg-[#141414] text-white">
        <ListSubHeader renderList="Project" />
        <div>
          <ListBody
            list={initialProjects}
            renderList="Project"
            listNameSearchTxt={projectNameSearchTxt}
          />
        </div>
      </div>
    </>
  );
}
