/* eslint-disable react/prop-types */
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";
import DetailCard from "../cards/DetailCard";
import StatusCard from "../cards/StatusCard";
import AddComponent from "../AddComponent";
import google from "../../assets/images/project icons/Google.png";
import facebook from "../../assets/images/project icons/Facebook.png";
import instagram from "../../assets/images/project icons/Instagram.png";
import youtube from "../../assets/images/project icons/Youtube.png";
import { useEffect, useReducer, useState } from "react";
import { listReducer } from "@/helpers/listReducer";

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

export default function SubTeamDash() {
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

  const handleSubTeamUpload = async (subTeamDoc) => {
    console.log(subTeamDoc);
    // try {
    //   await axios.post(base_url + "auth/signup", subTeamDoc, {
    //     withCredentials: true,
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const [showSubTeamAddPopUp, setShowSubTeamAddPopUp] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[1fr,1fr] text-white">
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
      <div className="bg-[#141414] mx-1 rounded-t-md text-white">
        <ListHeader
          setList={setSubTeams}
          renderList="Sub Team"
          resetList={resetSubTeamList}
          leaderList={leaderSubTeams}
          initialList={initialSubTeams}
          filterBtnTxt={subTeamFilterBtnTxt}
          switchList={listOnlyAdminSubTeams}
          setShowAddPopUp={setShowSubTeamAddPopUp}
          setSwitchList={setListOnlyAdminSubTeams}
          listNameSearchTxt={subTeamNameSearchTxt}
          setFilterBtnTxt={setSubTeamFilterBtnTxt}
          setListNameSearchTxt={setSubTeamNameSearchTxt}
        />
      </div>
      <div
        id="scrollableListBody"
        className="flex flex-col h-svh overflow-auto m-1 mt-0 rounded-b-md bg-[#141414] text-white"
      >
        <ListSubHeader renderList="Sub Team" />
        <ListBody
          list={subTeams}
          renderList="Sub Team"
          listNameSearchTxt={subTeamNameSearchTxt}
        />
      </div>
      {showSubTeamAddPopUp && (
        <AddComponent
          renderList="Sub Team"
          handleUpload={handleSubTeamUpload}
          setShowAddPopUp={setShowSubTeamAddPopUp}
          description="Your Sub Team is where you can create your tasks, add members, assign tasks and work with them effortlessly."
        />
      )}
    </>
  );
}
