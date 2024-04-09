/* eslint-disable react/prop-types */

import { toast } from "react-toastify";
import EntitySettings from "./EntitySettings";
import ajmalDp from "../../assets/images/ajmalDp.png";
import user1 from "../../assets/images/activities/user1.png";
import user2 from "../../assets/images/activities/user2.png";
import user3 from "../../assets/images/activities/user3.png";
import user4 from "../../assets/images/activities/user4.png";
import { teamValidationSchema } from "@/validations/entityValidations";

const projectMembers = [
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
];

const existingTeamCollaborators = [
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
];

const teamData = {
  description: "",
  name: "Team 1",
  guide: "ajmal236",
  leader: "shahin123",
};

const TeamSettings = () => {
  const handleAddTeamCollaborator = (teamCollaborator) => {
    console.log("teamCollaborator: ", teamCollaborator);
    toast.success(
      `${teamCollaborator.username} added as ${teamCollaborator.role} successfully`
    );
  };

  const handleUpdateTeamDetails = (newTeamDetails) => {
    console.log("updatedTeam: ", newTeamDetails);
    toast.success("Team updated successfully");
  };

  return (
    <EntitySettings
      entity="team"
      entityData={teamData}
      memberParent="project"
      members={projectMembers}
      validationSchema={teamValidationSchema}
      existingCollaborators={existingTeamCollaborators}
      handleUpdateEntityDetails={handleUpdateTeamDetails}
      handleSubmitAddCollaborator={handleAddTeamCollaborator}
    />
  );
};

export default TeamSettings;
