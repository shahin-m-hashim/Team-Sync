/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { socket } from "@/App";
import useFetch from "@/hooks/useFetch";
import { ErrorContext } from "./ErrorProvider";
import { addData, deleteData, updateData } from "@/services/db";
import { createContext, useContext, useEffect, useState } from "react";

export const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const { setError } = useContext(ErrorContext);
  const [reFetchProjects, setReFetchProjects] = useState(false);

  const projects = useFetch("projects", reFetchProjects);

  const addProject = async (url, newData) => await addData(url, newData);

  const updateProjectDetails = async (url, newData) =>
    await updateData(url, newData);

  const deleteProject = async (url) => await deleteData(url);

  useEffect(() => {
    socket.on("project", (project) => setReFetchProjects(project));
    return () => socket.off("project");
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
    <ProjectContext.Provider
      value={{
        projects: projects?.data,
        addProject,
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
