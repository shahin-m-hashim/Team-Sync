/* eslint-disable react/prop-types */
import DetailCard from "../cards/DetailCard";
import StatusCard from "../cards/StatusCard";
import ListBody from "@/components/list/ListBody";
import { listReducer } from "@/helpers/listReducer";
import AddTeamForm from "../forms/teams/AddTeamForm";
import ListHeader from "@/components/list/ListHeader";
import { useEffect, useReducer, useState } from "react";
import ListSubHeader from "@/components/list/ListSubHeader";
import google from "../../assets/images/project icons/Google.png";
import youtube from "../../assets/images/project icons/Youtube.png";
import facebook from "../../assets/images/project icons/Facebook.png";
import instagram from "../../assets/images/project icons/Instagram.png";

const initialTeams = [
  {
    name: "Team 3",
    createdDate: "01/02/2024",
    icon: google,
    progress: 0,
    status: "Not Started",
    role: "Leader",
  },
  {
    name: "Project 6",
    createdDate: "10/03/2024",
    icon: facebook,
    progress: 40,
    status: "Pending",
    role: "Member",
  },
  {
    name: "Team 4",
    createdDate: "25/01/2024",
    icon: instagram,
    progress: 100,
    status: "Done",
    role: "Co-Leader",
  },
  {
    name: "Project 8",
    createdDate: "18/06/2024",
    icon: youtube,
    progress: 75,
    status: "Pending",
    role: "Leader",
  },
  {
    name: "Team 5",
    createdDate: "27/01/2024",
    icon: facebook,
    progress: 15,
    status: "Done",
    role: "Co-Leader",
  },
  {
    name: "Team 2",
    createdDate: "15/03/2024",
    icon: google,
    progress: 85,
    status: "Pending",
    role: "guide",
  },
  {
    name: "Team 10",
    createdDate: "22/04/2024",
    icon: youtube,
    progress: 35,
    status: "Stopped",
    role: "Leader",
  },
  {
    name: "Team 7",
    createdDate: "7/05/2024",
    icon: facebook,
    progress: 40,
    status: "Not Started",
    role: "guide",
  },
  {
    name: "Team 9",
    createdDate: "27/02/2024",
    icon: youtube,
    progress: 100,
    status: "Done",
    role: "Co-Leader",
  },
  {
    name: "Team 1",
    createdDate: "2/03/2024",
    icon: google,
    progress: 75,
    status: "Pending",
    role: "guide",
  },
];

const leaderTeams = initialTeams.filter((team) => team.role === "Leader");

export default function Teams() {
  const [teamNameSearchTxt, setTeamNameSearchTxt] = useState("");
  const [teamFilterBtnTxt, setTeamFilterBtnTxt] = useState("Filter");
  const [listOnlyAdminTeams, setListOnlyAdminTeams] = useState(false);

  const resetTeamList = () => {
    setTeamNameSearchTxt("");
    setListOnlyAdminTeams(false);
    setTeamFilterBtnTxt("Filter");
    setTeams({
      type: "RESET",
      initialState: initialTeams,
    });
  };

  const [teams, dispatch] = useReducer(listReducer, initialTeams);
  const setTeams = (action) => dispatch(action);

  useEffect(() => {
    setTeamNameSearchTxt("");
    setTeamFilterBtnTxt("Filter");
    if (listOnlyAdminTeams) {
      setTeams({
        type: "SWITCH",
        payload: leaderTeams,
      });
    } else {
      setTeams({
        type: "SWITCH",
        payload: initialTeams,
      });
    }
  }, [listOnlyAdminTeams]);

  const [showAddTeamForm, setShowAddTeamForm] = useState(false);

  return (
    <>
      {showAddTeamForm && (
        <AddTeamForm setShowAddTeamForm={setShowAddTeamForm} />
      )}
      <div className="grid grid-cols-[1fr,1fr] gap-0.5 min-h-[17rem] border-white border-2 border-t-0 text-white">
        <DetailCard
          details={{
            name: "Team 1",
            leader: "Shahin123",
            guide: "Sindhiya",
            nom: 20,
          }}
          renderList="Team"
        />
        <StatusCard list={teams} renderList="Team" />
      </div>
      <div>
        <ListHeader
          setList={setTeams}
          renderList="Team"
          resetList={resetTeamList}
          leaderList={leaderTeams}
          initialList={initialTeams}
          setShowAddForm={setShowAddTeamForm}
          filterBtnTxt={teamFilterBtnTxt}
          switchList={listOnlyAdminTeams}
          setSwitchList={setListOnlyAdminTeams}
          listNameSearchTxt={teamNameSearchTxt}
          setFilterBtnTxt={setTeamFilterBtnTxt}
          setListNameSearchTxt={setTeamNameSearchTxt}
        />
      </div>
      <div className="flex flex-col h-full border-white border-2 rounded-b-md border-t-0 overflow-auto bg-[#141414] text-white">
        <ListSubHeader renderList={"Team"} />
        <div>
          <ListBody
            list={teams}
            renderList={"Team"}
            listNameSearchTxt={teamNameSearchTxt}
          />
        </div>
      </div>
    </>
  );
}
