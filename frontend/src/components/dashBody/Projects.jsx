/* eslint-disable react-hooks/exhaustive-deps */

import { socket } from "@/App";
import Loading from "../Loading";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { addData } from "@/services/db";
import StatusCard from "../cards/StatusCard";
import { useParams } from "react-router-dom";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "../list/ListSubHeader";
import { listReducer } from "@/helpers/listReducer";
import ListHeader from "@/components/list/ListHeader";
import InvitationsCard from "../cards/InvitationsCard";
import { UserContext } from "@/providers/UserProvider";
import AddListEntityForm from "../forms/AddListEntityForm";
import { useContext, useEffect, useReducer, useState } from "react";

export default function Projects() {
  const { userId } = useParams();
  const { setError } = useContext(UserContext);
  const { reFetchProjects, setReFetchProjects } = useContext(UserContext);

  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [projectNameSearchTxt, setProjectNameSearchTxt] = useState("");
  const [projectFilterBtnTxt, setProjectFilterBtnTxt] = useState("Filter");
  const [listOnlyLeaderProjects, setListOnlyLeaderProjects] = useState(false);

  const projects = useFetch("projects", reFetchProjects);
  const leaderProjects = projects?.data?.filter(
    (project) => project.role === "Leader"
  );

  const [initialProjects, dispatch] = useReducer(listReducer, projects?.data);
  const setProjects = (action) => dispatch(action);

  const handleAddProject = async (projectDetails) => {
    try {
      await addData("project", { projectDetails });
      setReFetchProjects((prev) => !prev);
      setShowAddProjectForm(false);
      toast.success("Project added successfully");
    } catch (e) {
      toast.error(
        e.response.data.error || "An unexpected error occurred, try again later"
      );
    }
  };

  const resetProjectList = () => {
    setProjectNameSearchTxt("");
    setListOnlyLeaderProjects(false);
    setProjectFilterBtnTxt("Filter");
    setProjects({
      type: "RESET",
      initialState: projects?.data,
    });
  };

  useEffect(() => {
    setProjectNameSearchTxt("");
    setProjectFilterBtnTxt("Filter");
    if (listOnlyLeaderProjects) {
      setProjects({
        type: "SWITCH",
        payload: projects?.data?.filter((project) => project.role === "Leader"),
      });
    } else {
      setProjects({
        type: "SWITCH",
        payload: projects?.data,
      });
    }
  }, [projects?.data, listOnlyLeaderProjects]);

  useEffect(() => {
    socket.on("projects", (project) => setReFetchProjects(project));
    return () => socket.off("projects");
  }, []);

  if (projects?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (projects?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return (
    <>
      {showAddProjectForm && (
        <AddListEntityForm
          renderList="Project"
          handleAddEntity={handleAddProject}
          setReFetchProjects={setReFetchProjects}
          setShowAddEntityForm={setShowAddProjectForm}
          description="Your project is where you can create your teams, add members and work with them effortlessly."
        />
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
          leaderList={leaderProjects}
          initialList={projects?.data}
          resetList={resetProjectList}
          filterBtnTxt={projectFilterBtnTxt}
          switchList={listOnlyLeaderProjects}
          listNameSearchTxt={projectNameSearchTxt}
          setFilterBtnTxt={setProjectFilterBtnTxt}
          setSwitchList={setListOnlyLeaderProjects}
          setShowAddEntityForm={setShowAddProjectForm}
          setListNameSearchTxt={setProjectNameSearchTxt}
        />
      </div>
      <div className="flex flex-col h-full border-white border-2 rounded-b-md border-t-0 overflow-auto bg-[#141414] text-white">
        <ListSubHeader renderList="Project" />
        {initialProjects ? (
          <ListBody
            userId={userId}
            renderList="Project"
            list={initialProjects}
            listNameSearchTxt={projectNameSearchTxt}
          />
        ) : (
          <div className="relative h-full">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}
