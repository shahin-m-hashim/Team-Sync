/* eslint-disable react/prop-types */

import { getLocalSecureItem } from "@/lib/utils";
import AddEntityListForm from "../AddEntityForm";

export default function AddProjectForm({ setShowProjectAddForm }) {
  const { id } = getLocalSecureItem("user", "low");

  const handleProjectUpload = (projectData) => {
    projectData.admin = id;
    console.log(projectData);
  };

  return (
    <AddEntityListForm
      renderList="Project"
      handleSubmit={handleProjectUpload}
      setShowAddForm={setShowProjectAddForm}
      description="Your project is where you can create your teams, add members and work with them effortlessly."
    />
  );
}
