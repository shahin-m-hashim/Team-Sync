/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useState } from "react";
import google from "../assets/images/project icons/Google.png";
import facebook from "../assets/images/project icons/Facebook.png";
import instagram from "../assets/images/project icons/Instagram.png";
import youtube from "../assets/images/project icons/Youtube.png";
import { filterList } from "@/helpers/filterList";
import calcStatusProgress from "@/helpers/calcStatusProgress";

export const teamContext = createContext();

let teams = [
  {
    name: "Sam 1",
    createdDate: "01/02/2024",
    icon: google,
    progress: 0,
    status: "Not Started",
    role: "Leader",
  },
  {
    name: "Alaska 3",
    createdDate: "10/03/2024",
    icon: facebook,
    progress: 20,
    status: "Pending",
    role: "Member",
  },
  {
    name: "Project 4",
    createdDate: "25/01/2024",
    icon: instagram,
    progress: 100,
    status: "Done",
    role: "Co-Leader",
  },
  {
    name: "Team 5",
    createdDate: "18/06/2024",
    icon: youtube,
    progress: 10,
    status: "Pending",
    role: "Leader",
  },
  {
    name: "Shad 2",
    createdDate: "27/01/2024",
    icon: youtube,
    progress: 80,
    status: "Stopped",
    role: "Leader",
  },
  {
    name: "Sam 1",
    createdDate: "01/02/2024",
    icon: google,
    progress: 0,
    status: "Not Started",
    role: "Leader",
  },
  {
    name: "Alaska 3",
    createdDate: "10/03/2024",
    icon: facebook,
    progress: 20,
    status: "Pending",
    role: "Member",
  },
  {
    name: "Project 4",
    createdDate: "25/01/2024",
    icon: instagram,
    progress: 100,
    status: "Done",
    role: "Co-Leader",
  },
  {
    name: "Team 5",
    createdDate: "18/06/2024",
    icon: youtube,
    progress: 10,
    status: "Pending",
    role: "Leader",
  },
  {
    name: "Shad 2",
    createdDate: "27/01/2024",
    icon: youtube,
    progress: 80,
    status: "Stopped",
    role: "Leader",
  },
];

const initialState = teams;

const TeamProvider = ({ children }) => {
  const [teamNameSearchTxt, setTeamNameSearchTxt] = useState("");
  const [teamFilterBtnTxt, setTeamFilterBtnTxt] = useState("Filter");
  const [listOnlyAdminTeams, setListOnlyAdminTeams] = useState(false);

  const resetTeamList = () => {
    filterTeams({
      type: "RESET",
      initialState,
    });
  };

  const [filteredTeams, dispatch] = useReducer(filterList, [...teams]);

  const filterTeams = (action) => dispatch(action);

  teams = listOnlyAdminTeams
    ? filteredTeams.filter((project) => project.role === "Leader")
    : filteredTeams;

  const statusProgress = calcStatusProgress(teams);

  return (
    <teamContext.Provider
      value={{
        teams,
        statusProgress,
        teamFilterBtnTxt,
        listOnlyAdminTeams,
        teamNameSearchTxt,
        filterTeams,
        resetTeamList,
        setTeamFilterBtnTxt,
        setTeamNameSearchTxt,
        setListOnlyAdminTeams,
      }}
    >
      {children}
    </teamContext.Provider>
  );
};

export default TeamProvider;
