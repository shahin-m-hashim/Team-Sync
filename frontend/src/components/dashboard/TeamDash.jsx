/* eslint-disable react/prop-types */
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";
import DetailCard from "../cards/DetailCard";
import { useEffect, useReducer, useState } from "react";
import StatusCard from "../cards/StatusCard";
import AddComponent from "../AddComponent";
import google from "../../assets/images/project icons/Google.png";
import facebook from "../../assets/images/project icons/Facebook.png";
import instagram from "../../assets/images/project icons/Instagram.png";
import youtube from "../../assets/images/project icons/Youtube.png";
import { listReducer } from "@/helpers/listReducer";

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

export default function TeamDash() {
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

  const handleTeamUpload = async (teamDoc) => {
    console.log(teamDoc);
    // try {
    //   await axios.post(base_url + "auth/signup", projectDoc, {
    //     withCredentials: true,
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const [showTeamAddPopUp, setShowTeamAddPopUp] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[1fr,1fr] text-white">
        <DetailCard
          details={{
            name: "Team 1",
            leader: "Shahin123",
            guide: "Sindhiya",
            nom: 20,
          }}
        />
        <StatusCard list={teams} renderList="Team" />
      </div>
      <div className="bg-[#141414] mx-1 rounded-t-md text-white">
        <ListHeader
          setList={setTeams}
          renderList="Team"
          resetList={resetTeamList}
          leaderList={leaderTeams}
          initialList={initialTeams}
          setShowAddPopUp={setShowTeamAddPopUp}
          filterBtnTxt={teamFilterBtnTxt}
          switchList={listOnlyAdminTeams}
          setSwitchList={setListOnlyAdminTeams}
          listNameSearchTxt={teamNameSearchTxt}
          setFilterBtnTxt={setTeamFilterBtnTxt}
          setListNameSearchTxt={setTeamNameSearchTxt}
        />
      </div>
      <div
        id="scrollableListBody"
        className="flex flex-col h-svh overflow-auto m-1 mt-0 rounded-b-md bg-[#141414] text-white"
      >
        <ListSubHeader renderList={"Team"} />
        <ListBody
          list={teams}
          renderList={"Team"}
          listNameSearchTxt={teamNameSearchTxt}
        />
      </div>
      {showTeamAddPopUp && (
        <AddComponent
          renderList="Team"
          handleUpload={handleTeamUpload}
          setShowAddPopUp={setShowTeamAddPopUp}
          description="Your Team is where you can organize your sub teams, add members and work with them effortlessly."
        />
      )}
    </>
  );
}