/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useReducer, useState } from "react";
import google from "../assets/images/project icons/Google.png";
import facebook from "../assets/images/project icons/Facebook.png";
import instagram from "../assets/images/project icons/Instagram.png";
import youtube from "../assets/images/project icons/Youtube.png";
import { listReducer } from "@/helpers/listReducer";

export const projectContext = createContext();

const initialProjects = [
  {
    name: "Project 1",
    createdDate: "01/02/2024",
    icon: google,
    progress: 0,
    status: "Not Started",
    role: "Leader",
  },
  {
    name: "Team 3",
    createdDate: "10/03/2024",
    icon: facebook,
    progress: 20,
    status: "Pending",
    role: "Member",
  },
  {
    name: "Project 4",
    createdDate: "25/01/2024",
    icon: instagram,
    progress: 100,
    status: "Done",
    role: "Co-Leader",
  },
  {
    name: "Team 5",
    createdDate: "18/06/2024",
    icon: youtube,
    progress: 30,
    status: "Stopped",
    role: "Leader",
  },
  {
    name: "Project 2",
    createdDate: "27/01/2024",
    icon: youtube,
    progress: 50,
    status: "Stopped",
    role: "Leader",
  },
  {
    name: "Project 1",
    createdDate: "01/02/2024",
    icon: google,
    progress: 0,
    status: "Not Started",
    role: "Leader",
  },
  {
    name: "Team 3",
    createdDate: "10/03/2024",
    icon: facebook,
    progress: 20,
    status: "Pending",
    role: "Member",
  },
  {
    name: "Project 4",
    createdDate: "25/01/2024",
    icon: instagram,
    progress: 100,
    status: "Done",
    role: "Co-Leader",
  },
  {
    name: "Team 5",
    createdDate: "18/06/2024",
    icon: youtube,
    progress: 50,
    status: "Stopped",
    role: "Leader",
  },
  {
    name: "Project 2",
    createdDate: "27/01/2024",
    icon: youtube,
    progress: 50,
    status: "Pending",
    role: "Leader",
  },
];

const leaderProjects = initialProjects.filter(
  (project) => project.role === "Leader"
);

const ProjectProvider = ({ children }) => {
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

  return (
    <projectContext.Provider
      value={{
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
      }}
    >
      {children}
    </projectContext.Provider>
  );
};

export default ProjectProvider;
