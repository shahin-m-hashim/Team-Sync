/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import google from "../assets/images/project icons/Google.png";
import facebook from "../assets/images/project icons/Facebook.png";
import instagram from "../assets/images/project icons/Instagram.png";
import youtube from "../assets/images/project icons/Youtube.png";

export const projectContext = createContext();

const ProjectProvider = ({ children }) => {
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
      name: "Project 2",
      createdDate: "01/02/2024",
      icon: facebook,
      progress: 20,
      status: "Pending",
      role: "Member",
    },
    {
      name: "Project 3",
      createdDate: "01/02/2024",
      icon: instagram,
      progress: 100,
      status: "Done",
      role: "Co-Leader",
    },
    {
      name: "Project 4",
      createdDate: "01/02/2024",
      icon: youtube,
      progress: 50,
      status: "Stopped",
      role: "Guide",
    },
  ];

  const [listOnlyAdminProjects, setListOnlyAdminProjects] = useState(false);

  projects = listOnlyAdminProjects
    ? projects.filter((project) => project.role === "Leader")
    : projects;

  return (
    <projectContext.Provider
      value={{ projects, listOnlyAdminProjects, setListOnlyAdminProjects }}
    >
      {children}
    </projectContext.Provider>
  );
};

export default ProjectProvider;
