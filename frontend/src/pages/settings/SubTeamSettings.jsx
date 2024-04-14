/* eslint-disable react/prop-types */

import { toast } from "react-toastify";
import EntitySettings from "./EntitySettings";
import ajmalDp from "../../assets/images/ajmalDp.png";
import user1 from "../../assets/images/activities/user1.png";
import user2 from "../../assets/images/activities/user2.png";
import user3 from "../../assets/images/activities/user3.png";
import user4 from "../../assets/images/activities/user4.png";
import { subTeamValidationSchema } from "@/validations/entityValidations";

const existingSubTeamCollaborators = [
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

const teamMembers = [
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

const subTeamData = {
  description: "",
  name: "Sub Team 1",
  guide: "ajmal236",
  leader: "shahin123",
};

const SubTeamSettings = () => {
  const handleUpdateSubTeamDetails = (newSubTeamDetails) => {
    console.log("updated Sub Team: ", newSubTeamDetails);
    toast.success("Sub Team updated successfully");
  };

  const handleAddSubTeamCollaborator = (subTeamCollaborator) => {
    console.log("subTeamCollaborator: ", subTeamCollaborator);
    toast.success(
      `${subTeamCollaborator.username} added as ${subTeamCollaborator.role} successfully`
    );
  };

  return (
    <EntitySettings
      entity="sub team"
      memberParent="team"
      members={teamMembers}
      entityData={subTeamData}
      validationSchema={subTeamValidationSchema}
      existingCollaborators={existingSubTeamCollaborators}
      handleUpdateEntityDetails={handleUpdateSubTeamDetails}
      handleSubmitAddCollaborator={handleAddSubTeamCollaborator}
    />
  );
};

export default SubTeamSettings;
