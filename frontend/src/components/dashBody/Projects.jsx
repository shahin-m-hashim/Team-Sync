/* eslint-disable react-hooks/exhaustive-deps */

import Loading from "../Loading";
import StatusCard from "../cards/StatusCard";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "../list/ListSubHeader";
import { listReducer } from "@/helpers/listReducer";
import ListHeader from "@/components/list/ListHeader";
import InvitationsCard from "../cards/InvitationsCard";
import { ProjectContext } from "@/providers/ProjectProvider";
import AddProjectForm from "../forms/projects/AddProjectForm";
import { useContext, useEffect, useReducer, useState } from "react";

export default function Projects() {
  const { projects } = useContext(ProjectContext);
  const [showProjectAddForm, setShowProjectAddForm] = useState(false);
  const [projectNameSearchTxt, setProjectNameSearchTxt] = useState("");
  const [projectFilterBtnTxt, setProjectFilterBtnTxt] = useState("Filter");
  const [listOnlyAdminProjects, setListOnlyAdminProjects] = useState(false);

  const leaderProjects = projects?.filter(
    (project) => project.role === "Leader"
  );

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
  }, [projects, listOnlyAdminProjects]);

  return (
    <>
      {showProjectAddForm && (
        <AddProjectForm setShowProjectAddForm={setShowProjectAddForm} />
      )}
      <div className="grid grid-cols-2 gap-[2px] text-white border-2 border-t-0 border-white min-h-72">
        <InvitationsCard />
        {initialProjects ? (
          <StatusCard list={initialProjects} renderList="Project" />
        ) : (
          <div className="relative bg-[#141414]">
            <Loading />
          </div>
        )}
      </div>
      <div>
        <ListHeader
          renderList="Project"
          setList={setProjects}
          initialList={projects}
          leaderList={leaderProjects}
          resetList={resetProjectList}
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
        {initialProjects ? (
          <div>
            <ListBody
              renderList="Project"
              list={initialProjects || []}
              listNameSearchTxt={projectNameSearchTxt}
            />
          </div>
        ) : (
          <div className="relative h-full">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}
