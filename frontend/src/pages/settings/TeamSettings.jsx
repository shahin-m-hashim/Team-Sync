/* eslint-disable react/prop-types */

import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";
import EntitySettings from "./EntitySettings";
import { deleteData, updateData } from "@/services/db";
import { useContext, useEffect, useState } from "react";
import { ErrorContext } from "@/providers/ErrorProvider";
import { teamValidationSchema } from "@/validations/entityValidations";

const TeamSettings = () => {
  const { setError } = useContext(ErrorContext);
  const { userId, projectId, teamId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [reFetchTeamSettings, setReFetchTeamSettings] = useState(false);

  const [showAddTeamCollaboratorForm, setShowAddTeamCollaboratorForm] =
    useState(false);

  const [showCurrentTeamCollaborators, setShowCurrentTeamCollaborators] =
    useState(false);

  const [showUpdateTeamDetailsForm, setShowUpdateTeamDetailsForm] =
    useState(false);

  const teamSettings = useFetch(
    `projects/${projectId}/teams/${teamId}/settings`,
    reFetchTeamSettings
  );

  useEffect(() => {}, [teamSettings?.data, reFetchTeamSettings]);

  useEffect(() => {
    if (!isEditing) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to leave?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing]);

  const handleAddTeamCollaborator = async (values) => {
    try {
      await updateData(`projects/${projectId}/teams/${teamId}/add`, values);
      showUpdateTeamDetailsForm(false);
      setIsEditing(false);

      setReFetchTeamSettings((prev) => !prev);
      toast.success("Collaborator added successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to add collaborator");
    }
  };

  const kickTeamCollaborator = async (username, role) => {
    try {
      await deleteData(
        `projects/${projectId}/collaborators/${username}/roles/${role.toLowerCase()}`
      );
      toast.success("Collaborator kicked successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to kick collaborator");
    }
  };

  const handleUpdateTeamDetails = async (updatedTeamDetails) => {
    try {
      const { data } = await updateData(
        `projects/${projectId}/teams/${teamId}/details`,
        { updatedTeamDetails }
      );
      setIsEditing(false);
      setShowUpdateTeamDetailsForm(false);

      setReFetchTeamSettings((prev) => !prev);
      toast.success(data?.message || "Update successfull");
    } catch (e) {
      console.log(e);
      toast.error(
        e.response?.data?.error || "An Unknown error occurred. Try again later."
      );
    }
  };

  const updateTeamIcon = async (downloadURL) => {
    try {
      const { data } = await updateData(
        `projects/${projectId}/teams/${teamId}/icon`,
        {
          updatedTeamIcon: downloadURL,
        }
      );
      setIsEditing(false);
      setReFetchTeamSettings((prev) => !prev);
      toast.success(data?.message || "Update successfull");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to update team icon");
    }
  };

  const deleteTeamIcon = async () => {
    try {
      await deleteData(`projects/${projectId}/teams/${teamId}/icon`);
      setReFetchTeamSettings((prev) => !prev);
    } catch (e) {
      toast.error(e.response.data.error || "Failed to delete team icon");
    }
  };

  if (teamSettings?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (teamSettings?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return (
    teamSettings && (
      <EntitySettings
        entity="team"
        parent="project"
        setIsEditing={setIsEditing}
        updateEntityIcon={updateTeamIcon}
        deleteEntityIcon={deleteTeamIcon}
        entitySettings={teamSettings?.data}
        validationSchema={teamValidationSchema}
        kickCollaborator={kickTeamCollaborator}
        setReFetchEntitySettings={setReFetchTeamSettings}
        handleUpdateEntityDetails={handleUpdateTeamDetails}
        showCurrentCollaborators={showCurrentTeamCollaborators}
        showUpdateEntityDetailsForm={showUpdateTeamDetailsForm}
        handleAddEntityCollaborator={handleAddTeamCollaborator}
        showAddEntityCollaboratorForm={showAddTeamCollaboratorForm}
        setShowCurrentCollaborators={setShowCurrentTeamCollaborators}
        setShowUpdateEntityDetailsForm={setShowUpdateTeamDetailsForm}
        setShowAddEntityCollaboratorForm={setShowAddTeamCollaboratorForm}
        entityIconPath={`users/${userId}/projects/${projectId}/teams/${teamId}/icon`}
      />
    )
  );
};

export default TeamSettings;
