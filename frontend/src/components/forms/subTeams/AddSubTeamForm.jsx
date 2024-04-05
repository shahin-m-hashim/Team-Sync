/* eslint-disable react/prop-types */

import AddEntityListForm from "../AddEntityListForm";

export default function AddSubTeamForm({ setShowAddSubTeamForm }) {
  const handleSubTeamUpload = (subTeamData) => {
    console.log(subTeamData);
  };

  return (
    <AddEntityListForm
      renderList="SubTeam"
      handleUpload={handleSubTeamUpload}
      setShowAddForm={setShowAddSubTeamForm}
      description="Your Sub Team is where you can create your tasks, add members, assign tasks and work with them effortlessly."
    />
  );
}
