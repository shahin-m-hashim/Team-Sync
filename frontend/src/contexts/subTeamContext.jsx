/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useState } from "react";
import google from "../assets/images/project icons/Google.png";
import facebook from "../assets/images/project icons/Facebook.png";
import instagram from "../assets/images/project icons/Instagram.png";
import youtube from "../assets/images/project icons/Youtube.png";
import { filterList } from "@/helpers/filterList";

export const subTeamContext = createContext();

let subTeams = [
  {
    name: "Project 1",
    createdDate: "01/02/2024",
    icon: google,
    progress: 0,
    status: "Not Started",
    role: "Leader",
  },
  {
    name: "Sub Team 3",
    createdDate: "10/03/2024",
    icon: facebook,
    progress: 20,
    status: "Pending",
    role: "Member",
  },
  {
    name: "Sub Team 4",
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
    progress: 50,
    status: "Stopped",
    role: "Leader",
  },
  {
    name: "BACKEND",
    createdDate: "27/01/2024",
    icon: youtube,
    progress: 50,
    status: "Stopped",
    role: "Leader",
  },
];

const initialState = subTeams;

const SubTeamProvider = ({ children }) => {
  const [subTeamNameSearchTxt, setSubTeamNameSearchTxt] = useState("");
  const [subTeamFilterBtnTxt, setSubTeamFilterBtnTxt] = useState("Filter");
  const [listOnlyAdminSubTeams, setListOnlyAdminSubTeams] = useState(false);

  const resetSubTeamList = () => {
    filterSubTeams({
      type: "RESET",
      initialState,
    });
  };

  const [filteredSubTeams, dispatch] = useReducer(filterList, [...subTeams]);

  const filterSubTeams = (action) => dispatch(action);

  subTeams = listOnlyAdminSubTeams
    ? filteredSubTeams.filter((project) => project.role === "Leader")
    : filteredSubTeams;

  return (
    <subTeamContext.Provider
      value={{
        subTeams,
        listOnlyAdminSubTeams,
        subTeamNameSearchTxt,
        subTeamFilterBtnTxt,
        filterSubTeams,
        resetSubTeamList,
        setSubTeamFilterBtnTxt,
        setSubTeamNameSearchTxt,
        setListOnlyAdminSubTeams,
      }}
    >
      {children}
    </subTeamContext.Provider>
  );
};

export default SubTeamProvider;
