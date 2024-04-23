/* eslint-disable react/prop-types */

import { useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import AssignRoleForm from "../AssignRoleForm";
import { addData, updateData } from "@/services/db";
import SelectSubTeamCollaborator from "./SelectSubTeamCollaborator";

function AddSubTeamCollaboratorForm({
  setShowAddSubTeamCollaboratorForm,
  setShowSubTeamLeaderDemotionConfirmation,
}) {
  const { projectId, teamId, subTeamId } = useParams();

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");

  const [showSelectCollaboratorForm, setShowSelectCollaboratorForm] =
    useState(true);

  const [showAssignRoleForm, setShowAssignRoleForm] = useState(false);

  const addSubTeamCollaborator = async (e) => {
    e.preventDefault();
    try {
      if (selectedRole === "guide") {
        await updateData(
          `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/guide`,
          {
            username: selectedUser.username,
          }
        );
      } else if (selectedRole === "member") {
        await addData(
          `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/member`,
          {
            username: selectedUser.username,
          }
        );
      } else {
        setShowSubTeamLeaderDemotionConfirmation({
          show: true,
          username: selectedUser.username,
        });
      }

      if (selectedRole !== "leader") {
        toast.success(
          `${selectedUser.username} added as ${selectedRole} successfully.`
        );
      }
    } catch (e) {
      toast.error(
        e.response?.data?.error || "Error inviting user, try again later."
      );
    } finally {
      setSelectedUser("");
      setSelectedRole("member");

      setShowAssignRoleForm(false);
      setShowSelectCollaboratorForm(true);
    }
  };

  const cancelAddSubTeamCollaborator = () => {
    setSelectedUser("");
    setSelectedRole("member");

    setShowAssignRoleForm(false);
    setShowSelectCollaboratorForm(true);
    setShowAddSubTeamCollaboratorForm(false);
  };

  return (
    <div className="relative h-full p-10 rounded-md bg-slate-700">
      <form
        onSubmit={addSubTeamCollaborator}
        className="absolute top-0 left-0 right-0 z-10 h-full px-8 py-5 bg-slate-700"
      >
        {showSelectCollaboratorForm && (
          <SelectSubTeamCollaborator
            setSelectedUser={setSelectedUser}
            setShowAssignRoleForm={setShowAssignRoleForm}
            setShowSelectCollaboratorForm={setShowSelectCollaboratorForm}
            setShowAddSubTeamCollaboratorForm={
              setShowAddSubTeamCollaboratorForm
            }
          />
        )}
        {showAssignRoleForm && (
          <AssignRoleForm
            entity="sub team"
            selectedUser={selectedUser}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            setShowAssignRoleForm={setShowAssignRoleForm}
            cancelAddCollaborator={cancelAddSubTeamCollaborator}
            setShowSelectCollaboratorForm={setShowSelectCollaboratorForm}
          />
        )}
      </form>
    </div>
  );
}

export default AddSubTeamCollaboratorForm;
