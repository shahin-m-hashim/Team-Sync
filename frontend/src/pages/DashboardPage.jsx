import { useEffect, useState } from "react";
import SideBar from "@/components/dashboard/SideBar";
import Navbar from "@/components/dashboard/Navbar";
import AddComponent from "@/components/AddComponent";
import ProjectDash from "@/components/dashboard/ProjectDash";
import ProjectProvider from "@/contexts/projectContext";
import TeamProvider from "@/contexts/teamContext";
import TeamDash from "@/components/dashboard/TeamDash";
import { useNavigate } from "react-router-dom";
import SubTeamDash from "@/components/dashboard/SubTeamDash";
import SubTeamProvider from "@/contexts/subTeamContext";

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ tab = "Project" }) {
  const navigate = useNavigate();
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [displayList, setDisplayList] = useState(tab);

  useEffect(() => {
    const path =
      displayList[0].toLowerCase() +
      displayList.substring(1).replace(/\s/g, "");
    navigate(`/${path}s`);
  }, [displayList, navigate]);

  return (
    <>
      <SideBar />
      <Navbar />
      <ProjectProvider>
        <TeamProvider>
          <SubTeamProvider>
            {displayList === "Project" && (
              <ProjectDash
                displayList={displayList}
                setDisplayList={setDisplayList}
                showAddPopUp={showAddPopUp}
                setShowAddPopUp={setShowAddPopUp}
              />
            )}
            {displayList === "Team" && (
              <TeamDash
                displayList={displayList}
                setDisplayList={setDisplayList}
                showAddPopUp={showAddPopUp}
                setShowAddPopUp={setShowAddPopUp}
              />
            )}
            {displayList === "Sub Team" && (
              <SubTeamDash
                displayList={displayList}
                setDisplayList={setDisplayList}
                showAddPopUp={showAddPopUp}
                setShowAddPopUp={setShowAddPopUp}
              />
            )}
          </SubTeamProvider>
        </TeamProvider>
      </ProjectProvider>
      {showAddPopUp && (
        <AddComponent
          displayList={displayList}
          setShowAddPopUp={setShowAddPopUp}
        />
      )}
    </>
  );
}
