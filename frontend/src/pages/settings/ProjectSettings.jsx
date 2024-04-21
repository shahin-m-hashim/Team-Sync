/* eslint-disable react/prop-types */

import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";
import EntitySettings from "./EntitySettings";
import { UserContext } from "@/providers/UserProvider";
import { deleteData, updateData } from "@/services/db";
import { useContext, useEffect, useState } from "react";
import { projectValidationSchema } from "@/validations/entityValidations";

const ProjectSettings = () => {
  const { userId, projectId } = useParams();
  const { setError } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [reFetchProjectSettings, setReFetchProjectSettings] = useState(false);

  const [showSendProjectInviteForm, setShowSendProjectInviteForm] =
    useState(false);

  const [showUpdateProjectDetailsForm, setShowUpdateProjectDetailsForm] =
    useState(false);

  const [showCurrentProjectCollaborators, setShowCurrentProjectCollaborators] =
    useState(false);

  const projectSettings = useFetch(
    `projects/${projectId}/details`,
    reFetchProjectSettings
  );

  useEffect(() => {}, [projectSettings?.data, reFetchProjectSettings]);

  useEffect(() => {
    if (!isEditing) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to leave?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing]);

  const kickProjectCollaborator = async (username, role) => {
    try {
      await deleteData(
        `projects/${projectId}/collaborators/${username}/roles/${role.toLowerCase()}`
      );
      setReFetchProjectSettings((prev) => !prev);
      toast.success("Collaborator kicked successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to kick collaborator");
    }
  };

  const handleUpdateProjectDetails = async (updatedProjectDetails) => {
    try {
      const { data } = await updateData(`projects/${projectId}/details`, {
        updatedProjectDetails,
      });
      setIsEditing(false);
      setShowUpdateProjectDetailsForm(false);

      setReFetchProjectSettings((prev) => !prev);
      toast.success(data?.message || "Update successfull");
    } catch (e) {
      toast.error(
        e.response?.data.error || "An Unknown error occurred. Try again later."
      );
    }
  };

  const updateProjectIcon = async (downloadURL) => {
    await updateData(`projects/${projectId}/icon`, {
      updatedProjectIcon: downloadURL,
    });
    setReFetchProjectSettings((prev) => !prev);
  };

  const deleteProjectIcon = async () => {
    await deleteData(`projects/${projectId}/icon`);
    setReFetchProjectSettings((prev) => !prev);
  };

  if (projectSettings?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (projectSettings?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return (
    projectSettings && (
      <EntitySettings
        entity="project"
        setIsEditing={setIsEditing}
        updateEntityIcon={updateProjectIcon}
        deleteEntityIcon={deleteProjectIcon}
        entitySettings={projectSettings?.data}
        validationSchema={projectValidationSchema}
        kickCollaborator={kickProjectCollaborator}
        setReFetchEntitySettings={setReFetchProjectSettings}
        handleUpdateEntityDetails={handleUpdateProjectDetails}
        showAddEntityCollaboratorForm={showSendProjectInviteForm}
        showCurrentCollaborators={showCurrentProjectCollaborators}
        showUpdateEntityDetailsForm={showUpdateProjectDetailsForm}
        entityIconPath={`users/${userId}/projects/${projectId}/icon`}
        setShowAddEntityCollaboratorForm={setShowSendProjectInviteForm}
        setShowCurrentCollaborators={setShowCurrentProjectCollaborators}
        setShowUpdateEntityDetailsForm={setShowUpdateProjectDetailsForm}
      />
    )
  );
};

export default ProjectSettings;
