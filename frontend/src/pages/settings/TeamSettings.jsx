/* eslint-disable react/prop-types */

import { socket } from "@/App";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import EntitySettings from "./EntitySettings";
import { deleteData, updateData } from "@/services/db";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { teamValidationSchema } from "@/validations/entityValidations";
import DeleteConfirmation from "@/components/popups/DeletionConfirmation";

const TeamSettings = () => {
  const navigate = useNavigate();
  const { setError } = useContext(UserContext);
  const { nav, projectId, teamId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [reFetchTeamSettings, setReFetchTeamSettings] = useState(false);

  const [showDeleteTeamConfirmation, setShowDeleteTeamConfirmation] =
    useState(false);

  const [showAddTeamCollaboratorForm, setShowAddTeamCollaboratorForm] =
    useState(false);

  const [showCurrentTeamCollaborators, setShowCurrentTeamCollaborators] =
    useState(false);

  const [showUpdateTeamDetailsForm, setShowUpdateTeamDetailsForm] =
    useState(false);

  const [disableTeamUpdateButton, setDisableTeamUpdateButton] = useState(false);

  const teamSettings = useFetch(
    `projects/${projectId}/teams/${teamId}/details`,
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

  const kickTeamCollaborator = async (username, role) => {
    try {
      setDisableTeamUpdateButton(true);
      await deleteData(
        `projects/${projectId}/teams/${teamId}/collaborators/${username}/roles/${role.toLowerCase()}`
      );
      toast.success("Team collaborator removed successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to kick team collaborator");
    } finally {
      setDisableTeamUpdateButton(false);
    }
  };

  const handleUpdateTeamDetails = async (updatedTeamDetails) => {
    try {
      setDisableTeamUpdateButton(true);
      const { data } = await updateData(
        `projects/${projectId}/teams/${teamId}/details`,
        { updatedTeamDetails }
      );
      setIsEditing(false);
      setShowUpdateTeamDetailsForm(false);
      toast.success(data?.message || "Update successfull");
    } catch (e) {
      console.log(e);
      toast.error(
        e.response?.data?.error || "An Unknown error occurred. Try again later."
      );
    } finally {
      setDisableTeamUpdateButton(false);
    }
  };

  const updateTeamIcon = async (downloadURL) => {
    try {
      await updateData(`projects/${projectId}/teams/${teamId}/icon`, {
        updatedTeamIcon: downloadURL,
      });
      setIsEditing(false);
    } catch (e) {
      toast.error(e.response.data.error || "Failed to update team icon");
    }
  };

  const deleteTeamIcon = async () => {
    try {
      await deleteData(`projects/${projectId}/teams/${teamId}/icon`);
    } catch (e) {
      toast.error(e.response.data.error || "Failed to delete team icon");
    }
  };

  const deleteTeam = async () => {
    try {
      await deleteData(`projects/${projectId}/teams/${teamId}`);
      toast.success("Team deleted successfully");
      navigate(-nav, { replace: true });
    } catch (e) {
      toast.error(e.response.data.error || "Failed to delete team");
    }
  };

  useEffect(() => {
    socket.on("teamDetails", (teamDetails) =>
      setReFetchTeamSettings(teamDetails)
    );

    return () => socket.off("teamDetails");
  }, []);

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
      <>
        {showDeleteTeamConfirmation && (
          <DeleteConfirmation
            entity="team"
            deleteEntity={deleteTeam}
            setShowDeleteConfirmation={setShowDeleteTeamConfirmation}
          />
        )}
        <EntitySettings
          entity="team"
          parent="project"
          setIsEditing={setIsEditing}
          updateEntityIcon={updateTeamIcon}
          deleteEntityIcon={deleteTeamIcon}
          entitySettings={teamSettings?.data}
          validationSchema={teamValidationSchema}
          kickCollaborator={kickTeamCollaborator}
          entityIconPath={`teams/${teamId}/icon`}
          setReFetchEntitySettings={setReFetchTeamSettings}
          disableEntityUpdateButton={disableTeamUpdateButton}
          handleUpdateEntityDetails={handleUpdateTeamDetails}
          showCurrentCollaborators={showCurrentTeamCollaborators}
          showUpdateEntityDetailsForm={showUpdateTeamDetailsForm}
          setShowDeleteConfirmation={setShowDeleteTeamConfirmation}
          showAddEntityCollaboratorForm={showAddTeamCollaboratorForm}
          setShowCurrentCollaborators={setShowCurrentTeamCollaborators}
          setShowUpdateEntityDetailsForm={setShowUpdateTeamDetailsForm}
          setShowAddEntityCollaboratorForm={setShowAddTeamCollaboratorForm}
        />
      </>
    )
  );
};

export default TeamSettings;
