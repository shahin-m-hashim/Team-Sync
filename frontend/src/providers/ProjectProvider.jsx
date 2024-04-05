/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import useFetch from "@/hooks/useFetch";
import { ErrorContext } from "./ErrorProvider";
import { deleteData, updateData } from "@/services/db";
import { createContext, useContext, useState } from "react";

export const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const { setError } = useContext(ErrorContext);
  const [reFetchProjects, setReFetchProjects] = useState(false);

  const res = useFetch("projects", reFetchProjects);
  //   const projects = [
  //     {
  //       name: "Project 1",
  //       createdDate: "01/02/2024",
  //       icon: "",
  //       progress: 0,
  //       status: "Not Started",
  //       role: "Leader",
  //     },
  //     {
  //       name: "Project 1",
  //       createdDate: "01/02/2024",
  //       icon: "",
  //       progress: 30,
  //       status: "Pending",
  //       role: "Leader",
  //     },
  //     {
  //       name: "Project 2",
  //       createdDate: "10/03/2024",
  //       icon: "",
  //       progress: 100,
  //       status: "Not Started",
  //       role: "Leader",
  //     },
  //     {
  //       name: "Team 1",
  //       createdDate: "23/01/2024",
  //       icon: "",
  //       progress: 53,
  //       status: "Done",
  //       role: "Co-Leader",
  //     },
  //     {
  //       name: "Project 1",
  //       createdDate: "01/02/2024",
  //       icon: "",
  //       progress: 10,
  //       status: "Not Started",
  //       role: "Leader",
  //     },
  //   ];

  const projects = res?.apiData || [];

  const updateProjectDetails = async (url, newData) =>
    await updateData(url, newData);

  const deleteProject = async (url) => await deleteData(url);

  if (res?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (res?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        deleteProject,
        setReFetchProjects,
        updateProjectDetails,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
