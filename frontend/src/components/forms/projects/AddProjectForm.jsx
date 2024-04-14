/* eslint-disable react/prop-types */

import { useContext, useState } from "react";
import AddEntityListForm from "../AddEntityForm";
import { UserContext } from "@/providers/UserProvider";
import { ProjectContext } from "@/providers/ProjectProvider";

export default function AddProjectForm({ setShowProjectAddForm }) {
  const [error, setError] = useState("");
  const { userData } = useContext(UserContext);
  const { addProject, setReFetchProjects } = useContext(ProjectContext);

  const handleProjectUpload = async (projectData) => {
    try {
      await addProject("project", {
        role: userData.role,
        projectDetails: projectData,
      });
      setReFetchProjects((prev) => !prev);
      setShowProjectAddForm(false);
    } catch (e) {
      setError(e.response.data.error);
    }
  };

  return (
    <AddEntityListForm
      error={error}
      renderList="Project"
      handleSubmit={handleProjectUpload}
      setShowAddForm={setShowProjectAddForm}
      description="Your project is where you can create your teams, add members and work with them effortlessly."
    />
  );
}
