/* eslint-disable react/prop-types */
import DetailCard from "../cards/DetailCard";
import StatusCard from "../cards/StatusCard";
import ListBody from "@/components/list/ListBody";
import { listReducer } from "@/helpers/listReducer";
import ListHeader from "@/components/list/ListHeader";
import { useEffect, useReducer, useState } from "react";
import ListSubHeader from "@/components/list/ListSubHeader";
import AddSubTeamForm from "../forms/subTeams/AddSubTeamForm";
import google from "../../assets/images/project icons/Google.png";
import youtube from "../../assets/images/project icons/Youtube.png";
import facebook from "../../assets/images/project icons/Facebook.png";
import instagram from "../../assets/images/project icons/Instagram.png";

const initialSubTeams = [
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

const leaderSubTeams = initialSubTeams.filter(
  (subTeam) => subTeam.role === "Leader"
);

export default function SubTeams() {
  const [subTeamNameSearchTxt, setSubTeamNameSearchTxt] = useState("");
  const [subTeamFilterBtnTxt, setSubTeamFilterBtnTxt] = useState("Filter");
  const [listOnlyAdminSubTeams, setListOnlyAdminSubTeams] = useState(false);

  const resetSubTeamList = () => {
    setSubTeamNameSearchTxt("");
    setListOnlyAdminSubTeams(false);
    setSubTeamFilterBtnTxt("Filter");
    setSubTeams({
      type: "RESET",
      initialState: initialSubTeams,
    });
  };

  const [subTeams, dispatch] = useReducer(listReducer, [...initialSubTeams]);
  const setSubTeams = (action) => dispatch(action);

  useEffect(() => {
    setSubTeamNameSearchTxt("");
    setSubTeamFilterBtnTxt("Filter");
    if (listOnlyAdminSubTeams) {
      setSubTeams({
        type: "SWITCH",
        payload: leaderSubTeams,
      });
    } else {
      setSubTeams({
        type: "SWITCH",
        payload: initialSubTeams,
      });
    }
  }, [listOnlyAdminSubTeams]);

  const [showAddSubTeamForm, setShowAddSubTeamForm] = useState(false);

  return (
    <>
      {showAddSubTeamForm && (
        <AddSubTeamForm setShowAddSubTeamForm={setShowAddSubTeamForm} />
      )}
      <div className="grid grid-cols-[1fr,1fr] gap-0.5 min-h-[17rem] border-white border-2 border-t-0 text-white">
        <DetailCard
          details={{
            name: "Project 1",
            leader: "Shahin123",
            guide: "Sindhiya",
            nom: 20,
          }}
        />
        <StatusCard list={subTeams} renderList="Sub Team" />
      </div>
      <div>
        <ListHeader
          setList={setSubTeams}
          renderList="Sub Team"
          resetList={resetSubTeamList}
          leaderList={leaderSubTeams}
          initialList={initialSubTeams}
          filterBtnTxt={subTeamFilterBtnTxt}
          switchList={listOnlyAdminSubTeams}
          setShowAddForm={setShowAddSubTeamForm}
          setSwitchList={setListOnlyAdminSubTeams}
          listNameSearchTxt={subTeamNameSearchTxt}
          setFilterBtnTxt={setSubTeamFilterBtnTxt}
          setListNameSearchTxt={setSubTeamNameSearchTxt}
        />
      </div>
      <div className="flex flex-col h-full border-white border-2 rounded-b-md border-t-0 overflow-auto bg-[#141414] text-white">
        <ListSubHeader renderList="Sub Team" />
        <ListBody
          list={subTeams}
          renderList="Sub Team"
          listNameSearchTxt={subTeamNameSearchTxt}
        />
      </div>
    </>
  );
}
