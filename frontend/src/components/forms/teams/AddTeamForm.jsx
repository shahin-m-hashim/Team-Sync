/* eslint-disable react/prop-types */

import AddEntityListForm from "../AddEntityForm";

export default function AddTeamForm({ setShowAddTeamForm }) {
  const handleTeamUpload = (TeamData) => {
    console.log(TeamData);
  };

  return (
    <AddEntityListForm
      renderList="Team"
      handleUpload={handleTeamUpload}
      setShowAddForm={setShowAddTeamForm}
      description="Your Team is where you can organize your sub teams, add members and work with them effortlessly."
    />
  );
}
