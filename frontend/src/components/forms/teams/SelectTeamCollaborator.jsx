/* eslint-disable react/prop-types */

import useFetch from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { useParams } from "react-router-dom";
import SelectCollaborator from "../SelectCollaborator";
import { useContext } from "react";
import { UserContext } from "@/providers/UserProvider";

function SelectTeamCollaborator({
  setSelectedUser,
  setShowAssignRoleForm,
  setShowSelectCollaboratorForm,
  setShowAddTeamCollaboratorForm,
}) {
  const { projectId } = useParams();
  const { setError } = useContext(UserContext);

  const projectCollaborators = useFetch(`projects/${projectId}/collaborators`);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowAssignRoleForm(true);
    setShowSelectCollaboratorForm(false);
  };

  if (projectCollaborators?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (projectCollaborators?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return projectCollaborators?.data ? (
    <SelectCollaborator
      parent="project"
      handleSelectUser={handleSelectUser}
      parentMembers={projectCollaborators?.data}
      setShowAddCollaboratorForm={setShowAddTeamCollaboratorForm}
    />
  ) : (
    <Loading />
  );
}

export default SelectTeamCollaborator;
