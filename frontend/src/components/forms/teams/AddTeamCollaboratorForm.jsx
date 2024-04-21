/* eslint-disable react/prop-types */

import { useState } from "react";
import { toast } from "react-toastify";
import { addData } from "@/services/db";
import AssignRoleForm from "../AssignRoleForm";
import { useNavigate, useParams } from "react-router-dom";
import SelectTeamCollaborator from "./SelectTeamCollaborator";

function AddTeamCollaboratorForm({ setShowAddTeamCollaboratorForm }) {
  const navigate = useNavigate();
  const { projectId, teamId } = useParams();

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");

  const [showSelectCollaboratorForm, setShowSelectCollaboratorForm] =
    useState(true);

  const [showAssignRoleForm, setShowAssignRoleForm] = useState(false);

  const addTeamCollaborator = async (e) => {
    e.preventDefault();
    try {
      await addData(`projects/${projectId}/teams/${teamId}/add`, {
        username: selectedUser.username,
        role: selectedRole,
      });
      toast.success(
        `${selectedUser.username} added as ${selectedRole} successfully.`
      );

      if (selectedRole === "leader") navigate(`/`, { replace: true });
    } catch (e) {
      toast.error(
        e.response.data.error || "Error inviting user, try again later."
      );
    } finally {
      setSelectedUser("");
      setSelectedRole("member");

      setShowAssignRoleForm(false);
      setShowSelectCollaboratorForm(true);
    }
  };

  const cancelAddTeamCollaborator = () => {
    setSelectedUser("");
    setSelectedRole("member");

    setShowAssignRoleForm(false);
    setShowSelectCollaboratorForm(true);
    setShowAddTeamCollaboratorForm(false);
  };

  return (
    <div className="relative h-full p-10 rounded-md bg-slate-700">
      <form
        onSubmit={addTeamCollaborator}
        className="absolute top-0 left-0 right-0 z-10 h-full px-8 py-5 bg-slate-700"
      >
        {showSelectCollaboratorForm && (
          <SelectTeamCollaborator
            setSelectedUser={setSelectedUser}
            setShowAssignRoleForm={setShowAssignRoleForm}
            setShowSelectCollaboratorForm={setShowSelectCollaboratorForm}
            setShowAddTeamCollaboratorForm={setShowAddTeamCollaboratorForm}
          />
        )}
        {showAssignRoleForm && (
          <AssignRoleForm
            entity="team"
            selectedUser={selectedUser}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            setShowAssignRoleForm={setShowAssignRoleForm}
            cancelAddCollaborator={cancelAddTeamCollaborator}
            setShowSelectCollaboratorForm={setShowSelectCollaboratorForm}
          />
        )}
      </form>
    </div>
  );
}

export default AddTeamCollaboratorForm;
