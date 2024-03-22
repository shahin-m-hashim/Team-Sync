/* eslint-disable react/prop-types */
import ActivityCard from "@/components/cards/ActivityCard";
import MessageCard from "@/components/cards/MessageCard";
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import StatusCard from "../cards/StatusCard";
import AddComponent from "../AddComponent";
import { useEffect, useReducer, useState } from "react";
import { listReducer } from "@/helpers/listReducer";
import ListSubHeader from "../list/ListSubHeader";

// import axios from "axios";
// const base_url = import.meta.env.VITE_APP_BASE_URL;

const initialProjects = [];

const leaderProjects = initialProjects.filter(
  (project) => project.role === "Leader"
);

export default function ProjectDash() {
  const [projectNameSearchTxt, setProjectNameSearchTxt] = useState("");
  const [projectFilterBtnTxt, setProjectFilterBtnTxt] = useState("Filter");
  const [listOnlyAdminProjects, setListOnlyAdminProjects] = useState(false);

  const resetProjectList = () => {
    setProjectNameSearchTxt("");
    setListOnlyAdminProjects(false);
    setProjectFilterBtnTxt("Filter");
    setProjects({
      type: "RESET",
      initialState: initialProjects,
    });
  };

  const [projects, dispatch] = useReducer(listReducer, initialProjects);
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
        payload: initialProjects,
      });
    }
  }, [listOnlyAdminProjects]);

  const handleProjectUpload = async (projectDoc) => {
    console.log(projectDoc);
    // try {
    //   await axios.post(base_url + "auth/signup", projectDoc, {
    //     withCredentials: true,
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const [showProjectAddPopUp, setShowProjectAddPopUp] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[1.3fr,1fr,330px] text-white">
        <StatusCard list={projects} renderList="Project" />
        <ActivityCard />
        <MessageCard />
      </div>
      <div className="bg-[#141414] mx-1 rounded-t-md text-white">
        <ListHeader
          renderList="Project"
          setList={setProjects}
          resetList={resetProjectList}
          leaderList={leaderProjects}
          initialList={initialProjects}
          setShowAddPopUp={setShowProjectAddPopUp}
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
        <ListSubHeader renderList="Project" />
        <ListBody
          list={projects}
          renderList="Project"
          listNameSearchTxt={projectNameSearchTxt}
        />
      </div>
      {showProjectAddPopUp && (
        <AddComponent
          renderList="Project"
          handleUpload={handleProjectUpload}
          setShowAddPopUp={setShowProjectAddPopUp}
          description="Your project is where you can create your teams, add members and work with them effortlessly."
        />
      )}
    </>
  );
}
