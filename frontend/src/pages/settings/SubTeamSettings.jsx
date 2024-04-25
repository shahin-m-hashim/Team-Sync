/* eslint-disable react/prop-types */

import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";
import EntitySettings from "./EntitySettings";
import { deleteData, updateData } from "@/services/db";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";
import { subTeamValidationSchema } from "@/validations/entityValidations";
import { socket } from "@/App";

const SubTeamSettings = () => {
  const { setError } = useContext(UserContext);
  const { userId, projectId, teamId, subTeamId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [reFetchSubTeamSettings, setReFetchSubTeamSettings] = useState(false);

  const [showAddSubTeamCollaboratorForm, setShowAddTeamCollaboratorForm] =
    useState(false);

  const [showCurrentSubTeamCollaborators, setShowCurrentSubTeamCollaborators] =
    useState(false);

  const [showUpdateSubTeamDetailsForm, setShowUpdateSubTeamDetailsForm] =
    useState(false);

  const [disableSubTeamUpdateButton, setDisableSubTeamUpdateButton] =
    useState(false);

  const subTeamSettings = useFetch(
    `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/details`,
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
      setDisableSubTeamUpdateButton(true);
      await updateData(
        `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/add`,
        values
      );
      showUpdateSubTeamDetailsForm(false);
      setIsEditing(false);

      setReFetchSubTeamSettings((prev) => !prev);
      toast.success("Collaborator added successfully");
      setDisableSubTeamUpdateButton(false);
    } catch (e) {
      toast.error(e.response.data.error || "Failed to add collaborator");
    }
  };

  const kickSubTeamCollaborator = async (username, role) => {
    try {
      setDisableSubTeamUpdateButton(true);
      await deleteData(
        `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/collaborators/${username}/roles/${role.toLowerCase()}`
      );
      toast.success("Collaborator kicked successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to kick collaborator");
    } finally {
      setDisableSubTeamUpdateButton(false);
    }
  };

  const handleUpdateSubTeamDetails = async (updatedSubTeamDetails) => {
    try {
      setDisableSubTeamUpdateButton(true);
      const { data } = await updateData(
        `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/details`,
        { updatedSubTeamDetails }
      );
      setIsEditing(false);
      setShowUpdateSubTeamDetailsForm(false);
      setReFetchSubTeamSettings((prev) => !prev);
      toast.success(data?.message || "Update successfull");
    } catch (e) {
      toast.error(
        e.response?.data?.error || "An Unknown error occurred. Try again later."
      );
    } finally {
      setDisableSubTeamUpdateButton(false);
    }
  };

  const updateSubTeamIcon = async (downloadURL) => {
    try {
      await updateData(
        `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/icon`,
        {
          updatedSubTeamIcon: downloadURL,
        }
      );
      setReFetchSubTeamSettings((prev) => !prev);
    } catch (e) {
      toast.error(e.response.data.error || "Failed to update team icon");
    }
  };

  const deleteSubTeamIcon = async () => {
    try {
      await deleteData(
        `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/icon`
      );
      setReFetchSubTeamSettings((prev) => !prev);
    } catch (e) {
      toast.error(e.response.data.error || "Failed to delete team icon");
    }
  };

  useEffect(() => {
    socket.on("subTeamDetails", (subTeamDetails) =>
      setReFetchSubTeamSettings(subTeamDetails)
    );

    return () => socket.off("subTeamDetails");
  }, []);

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
        updateEntityIcon={updateSubTeamIcon}
        deleteEntityIcon={deleteSubTeamIcon}
        entitySettings={subTeamSettings?.data}
        validationSchema={subTeamValidationSchema}
        kickCollaborator={kickSubTeamCollaborator}
        setReFetchEntitySettings={setReFetchSubTeamSettings}
        disableEntityUpdateButton={disableSubTeamUpdateButton}
        handleUpdateEntityDetails={handleUpdateSubTeamDetails}
        showCurrentCollaborators={showCurrentSubTeamCollaborators}
        showUpdateEntityDetailsForm={showUpdateSubTeamDetailsForm}
        handleAddEntityCollaborator={handleAddSubTeamCollaborator}
        showAddEntityCollaboratorForm={showAddSubTeamCollaboratorForm}
        setShowCurrentCollaborators={setShowCurrentSubTeamCollaborators}
        setShowUpdateEntityDetailsForm={setShowUpdateSubTeamDetailsForm}
        setShowAddEntityCollaboratorForm={setShowAddTeamCollaboratorForm}
        entityIconPath={`users/${userId}/projects/${projectId}/teams/${teamId}/subteams/${subTeamId}/icon`}
      />
    )
  );
};

export default SubTeamSettings;
