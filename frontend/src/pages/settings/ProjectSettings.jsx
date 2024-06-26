/* eslint-disable react/prop-types */

import { socket } from "@/App";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import EntitySettings from "./EntitySettings";
import { UserContext } from "@/providers/UserProvider";
import { deleteData, updateData } from "@/services/db";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectValidationSchema } from "@/validations/entityValidations";
import DeleteConfirmation from "@/components/popups/DeletionConfirmation";

const ProjectSettings = () => {
  const navigate = useNavigate();
  const { projectId, nav } = useParams();
  const { setError } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [reFetchProjectSettings, setReFetchProjectSettings] = useState(false);

  const [showDeleteProjectConfirmation, setShowDeleteProjectConfirmation] =
    useState(false);

  const [showSendProjectInviteForm, setShowSendProjectInviteForm] =
    useState(false);

  const [showUpdateProjectDetailsForm, setShowUpdateProjectDetailsForm] =
    useState(false);

  const [showCurrentProjectCollaborators, setShowCurrentProjectCollaborators] =
    useState(false);

  const [disableProjectUpdateButton, setDisableProjectUpdateButton] =
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
      setDisableProjectUpdateButton(true);
      await deleteData(
        `projects/${projectId}/collaborators/${username}/roles/${role.toLowerCase()}`
      );
      toast.success("Project collaborator removed successfully");
      setDisableProjectUpdateButton(false);
    } catch (e) {
      toast.error(e.response.data.error || "Failed to kick collaborator");
    } finally {
      setDisableProjectUpdateButton(false);
    }
  };

  const handleUpdateProjectDetails = async (updatedProjectDetails) => {
    try {
      setDisableProjectUpdateButton(true);
      const { data } = await updateData(`projects/${projectId}/details`, {
        updatedProjectDetails,
      });
      setIsEditing(false);
      setShowUpdateProjectDetailsForm(false);
      toast.success(data?.message || "Update successfull");
    } catch (e) {
      toast.error(
        e.response?.data.error || "An Unknown error occurred. Try again later."
      );
    } finally {
      setDisableProjectUpdateButton(false);
    }
  };

  const updateProjectIcon = async (downloadURL) => {
    await updateData(`projects/${projectId}/icon`, {
      updatedProjectIcon: downloadURL,
    });
  };

  const deleteProjectIcon = async () => {
    await deleteData(`projects/${projectId}/icon`);
  };

  const deleteProject = async () => {
    try {
      await deleteData(`projects/${projectId}`);
      toast.success("Project deleted successfully");
      navigate(-nav, { replace: true });
    } catch (e) {
      toast.error(e.response.data.error || "Failed to delete project.");
    }
  };

  useEffect(() => {
    socket.on("projectDetails", (projectDetails) =>
      setReFetchProjectSettings(projectDetails)
    );

    return () => socket.off("projectDetails");
  }, []);

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
      <>
        {showDeleteProjectConfirmation && (
          <DeleteConfirmation
            entity="project"
            deleteEntity={deleteProject}
            setShowDeleteConfirmation={setShowDeleteProjectConfirmation}
          />
        )}
        <EntitySettings
          entity="project"
          setIsEditing={setIsEditing}
          updateEntityIcon={updateProjectIcon}
          deleteEntityIcon={deleteProjectIcon}
          entitySettings={projectSettings?.data}
          validationSchema={projectValidationSchema}
          kickCollaborator={kickProjectCollaborator}
          entityIconPath={`projects/${projectId}/icon`}
          setReFetchEntitySettings={setReFetchProjectSettings}
          disableEntityUpdateButton={disableProjectUpdateButton}
          handleUpdateEntityDetails={handleUpdateProjectDetails}
          showAddEntityCollaboratorForm={showSendProjectInviteForm}
          showCurrentCollaborators={showCurrentProjectCollaborators}
          showUpdateEntityDetailsForm={showUpdateProjectDetailsForm}
          setShowDeleteConfirmation={setShowDeleteProjectConfirmation}
          setShowAddEntityCollaboratorForm={setShowSendProjectInviteForm}
          setShowCurrentCollaborators={setShowCurrentProjectCollaborators}
          setShowUpdateEntityDetailsForm={setShowUpdateProjectDetailsForm}
        />
      </>
    )
  );
};

export default ProjectSettings;
