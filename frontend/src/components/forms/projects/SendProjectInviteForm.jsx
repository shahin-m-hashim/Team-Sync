/* eslint-disable react/prop-types */

import { useState } from "react";
import { toast } from "react-toastify";
import { addData } from "@/services/db";
import { useParams } from "react-router-dom";
import AssignRoleForm from "../AssignRoleForm";
import SearchAndSelectUser from "./SearchAndSelectUser";

const SendProjectInviteForm = ({ setShowSendProjectInviteForm }) => {
  const { projectId } = useParams();

  const [selectedUser, setSelectedUser] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [selectedRole, setSelectedRole] = useState("member");

  const [showSearchForm, setShowSearchFrom] = useState(true);
  const [showAssignRoleForm, setShowAssignRoleForm] = useState(false);

  const sendInvite = async (e) => {
    e.preventDefault();
    try {
      setDisableButton(true);
      await addData(`projects/${projectId}/invite`, {
        username: selectedUser.username,
        role: selectedRole,
      });

      toast.success(
        `${selectedUser.username} invited as ${selectedRole} successfully.`
      );
    } catch (e) {
      toast.error(
        e.response.data.error || "Error inviting user, try again later."
      );
    } finally {
      setSelectedUser("");
      setSelectedRole("member");

      setShowSearchFrom(true);
      setDisableButton(false);
      setShowAssignRoleForm(false);
    }
  };

  const cancelInvite = () => {
    setSelectedUser("");
    setShowSearchFrom(true);
    setSelectedRole("member");
    setShowAssignRoleForm(false);
    setShowSendProjectInviteForm(false);
  };

  return (
    <div className="relative h-full p-10 rounded-md bg-slate-700">
      <form
        onSubmit={sendInvite}
        className="absolute top-0 left-0 right-0 z-10 h-full px-8 py-4 bg-slate-700"
      >
        {showSearchForm && (
          <SearchAndSelectUser
            setSelectedUser={setSelectedUser}
            setShowSearchForm={setShowSearchFrom}
            setShowAssignRoleForm={setShowAssignRoleForm}
            setShowSendProjectInviteForm={setShowSendProjectInviteForm}
          />
        )}
        {showAssignRoleForm && (
          <AssignRoleForm
            entity="project"
            selectedUser={selectedUser}
            selectedRole={selectedRole}
            disableButton={disableButton}
            setSelectedRole={setSelectedRole}
            cancelAddCollaborator={cancelInvite}
            setShowSearchFrom={setShowSearchFrom}
            setShowAssignRoleForm={setShowAssignRoleForm}
          />
        )}
      </form>
    </div>
  );
};

export default SendProjectInviteForm;
