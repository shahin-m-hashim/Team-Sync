/* eslint-disable react/prop-types */

import useFetch from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { useParams } from "react-router-dom";
import SelectCollaborator from "../SelectCollaborator";
import { useContext } from "react";
import { UserContext } from "@/providers/UserProvider";

function SelectSubTeamCollaborator({
  setSelectedUser,
  setShowAssignRoleForm,
  setShowSelectCollaboratorForm,
  setShowAddSubTeamCollaboratorForm,
}) {
  const { projectId, teamId } = useParams();
  const { setError } = useContext(UserContext);

  const teamMembers = useFetch(`projects/${projectId}/teams/${teamId}/members`);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowAssignRoleForm(true);
    setShowSelectCollaboratorForm(false);
  };

  if (teamMembers?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (teamMembers?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return teamMembers?.data ? (
    <SelectCollaborator
      parent="team"
      parentMembers={teamMembers?.data}
      handleSelectUser={handleSelectUser}
      setShowAddCollaboratorForm={setShowAddSubTeamCollaboratorForm}
    />
  ) : (
    <Loading />
  );
}

export default SelectSubTeamCollaborator;
