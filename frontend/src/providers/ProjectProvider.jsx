/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import useFetch from "@/hooks/useFetch";
import { ErrorContext } from "./ErrorProvider";
import { createContext, useContext, useState } from "react";
import { addData, deleteData, updateData } from "@/services/db";

export const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const { setError } = useContext(ErrorContext);
  const [reFetchProjects, setReFetchProjects] = useState(false);

  const res = useFetch("projects", reFetchProjects);

  const addProject = async (url, newData) => await addData(url, newData);

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
        projects: res?.apiData,
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
