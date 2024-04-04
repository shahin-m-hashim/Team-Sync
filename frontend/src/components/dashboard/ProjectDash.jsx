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

const initialProjects = [
  // {
  //   name: "Project 1",
  //   createdDate: "01/02/2024",
  //   icon: "",
  //   progress: 0,
  //   status: "Not Started",
  //   role: "Leader",
  // },
];

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
      <div className="grid grid-cols-[1fr,1fr,1.3fr] min-h-[17rem] border-white border-2 border-t-0 text-white">
        <ActivityCard />
        <MessageCard />
        <StatusCard list={projects} renderList="Project" />
      </div>
      <div>
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
      <div className="flex flex-col h-full border-white border-2 rounded-b-md border-t-0 overflow-auto bg-[#141414] text-white">
        <ListSubHeader renderList="Project" />
        <div>
          <ListBody
            list={projects}
            renderList="Project"
            listNameSearchTxt={projectNameSearchTxt}
          />
        </div>
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
