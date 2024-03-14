/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useState } from "react";
import google from "../assets/images/project icons/Google.png";
import facebook from "../assets/images/project icons/Facebook.png";
import instagram from "../assets/images/project icons/Instagram.png";
import youtube from "../assets/images/project icons/Youtube.png";
import { filterProjects } from "@/helpers/filterProjects";

export const projectContext = createContext();

let projects = [
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
    status: "Stopped",
    role: "Leader",
  },
];

const ProjectProvider = ({ children }) => {
  const [searchByName, setSearchByName] = useState(null);
  const [listOnlyAdminProjects, setListOnlyAdminProjects] = useState(false);

  const [filteredProjects, dispatch] = useReducer(filterProjects, [
    ...projects,
  ]);

  const setFilterProjects = (action) => dispatch(action);

  projects = listOnlyAdminProjects
    ? filteredProjects.filter((project) => project.role === "Leader")
    : filteredProjects;

  return (
    <projectContext.Provider
      value={{
        projects,
        listOnlyAdminProjects,
        searchByName,
        setSearchByName,
        setListOnlyAdminProjects,
        setFilterProjects,
      }}
    >
      {children}
    </projectContext.Provider>
  );
};

export default ProjectProvider;
