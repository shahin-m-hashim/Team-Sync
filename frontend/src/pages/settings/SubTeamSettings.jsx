/* eslint-disable react/prop-types */

import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";
import EntitySettings from "./EntitySettings";
import { deleteData, updateData } from "@/services/db";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/providers/UserProvider";
import { teamValidationSchema } from "@/validations/entityValidations";

const TeamSettings = () => {
  const { setError } = useContext(UserContext);
  const { userId, projectId, teamId, subTeamId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [reFetchSubTeamSettings, setReFetchSubTeamSettings] = useState(false);

  const [showAddTeamCollaboratorForm, setShowAddTeamCollaboratorForm] =
    useState(false);

  const [showCurrentTeamCollaborators, setShowCurrentTeamCollaborators] =
    useState(false);

  const [showUpdateTeamDetailsForm, setShowUpdateTeamDetailsForm] =
    useState(false);

  const subTeamSettings = useFetch(
    `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/settings`,
    reFetchSubTeamSettings
  );

  useEffect(() => {}, [subTeamSettings?.data, reFetchSubTeamSettings]);

  useEffect(() => {
    if (!isEditing) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to leave?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing]);

  const handleAddSubTeamCollaborator = async (values) => {
    try {
      await updateData(`projects/${projectId}/teams/${teamId}/add`, values);
      showUpdateTeamDetailsForm(false);
      setIsEditing(false);

      setReFetchSubTeamSettings((prev) => !prev);
      toast.success("Collaborator added successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to add collaborator");
    }
  };

  const kickSubTeamCollaborator = async (username, role) => {
    try {
      await deleteData(
        `projects/${projectId}/collaborators/${username}/roles/${role.toLowerCase()}`
      );
      toast.success("Collaborator kicked successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to kick collaborator");
    }
  };

  const handleUpdateSubTeamDetails = async (updatedTeamDetails) => {
    try {
      const { data } = await updateData(
        `projects/${projectId}/teams/${teamId}/details`,
        { updatedTeamDetails }
      );
      setIsEditing(false);
      showUpdateTeamDetailsForm(false);

      reFetchSubTeamSettings((prev) => !prev);
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
      await updateData(`projects/${projectId}/teams/${teamId}/icon`, {
        updatedTeamIcon: downloadURL,
      });
      reFetchSubTeamSettings((prev) => !prev);
    } catch (e) {
      toast.error(e.response.data.error || "Failed to update team icon");
    }
  };

  const deleteTeamIcon = async () => {
    try {
      await deleteData(`projects/${projectId}/teams/${teamId}/icon`);
      reFetchSubTeamSettings((prev) => !prev);
    } catch (e) {
      toast.error(e.response.data.error || "Failed to delete team icon");
    }
  };

  if (subTeamSettings?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (subTeamSettings?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return (
    subTeamSettings && (
      <EntitySettings
        parent="team"
        entity="sub team"
        setIsEditing={setIsEditing}
        updateEntityIcon={updateTeamIcon}
        deleteEntityIcon={deleteTeamIcon}
        entitySettings={subTeamSettings?.data}
        validationSchema={teamValidationSchema}
        kickCollaborator={kickSubTeamCollaborator}
        setReFetchEntitySettings={setReFetchSubTeamSettings}
        handleUpdateEntityDetails={handleUpdateSubTeamDetails}
        showCurrentCollaborators={showCurrentTeamCollaborators}
        showUpdateEntityDetailsForm={showUpdateTeamDetailsForm}
        handleAddEntityCollaborator={handleAddSubTeamCollaborator}
        showAddEntityCollaboratorForm={showAddTeamCollaboratorForm}
        setShowCurrentCollaborators={setShowCurrentTeamCollaborators}
        setShowUpdateEntityDetailsForm={setShowUpdateTeamDetailsForm}
        setShowAddEntityCollaboratorForm={setShowAddTeamCollaboratorForm}
        entityIconPath={`users/${userId}/projects/${projectId}/teams/${teamId}/subteams/${subTeamId}/icon`}
      />
    )
  );
};

export default TeamSettings;
