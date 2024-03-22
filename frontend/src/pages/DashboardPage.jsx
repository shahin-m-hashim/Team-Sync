import { useEffect, useState } from "react";
import SideBar from "@/components/dashboard/SideBar";
import AddComponent from "@/components/AddComponent";
import ProjectDash from "@/components/dashboard/ProjectDash";
import ProjectProvider from "@/contexts/projectContext";
import TeamProvider from "@/contexts/teamContext";
import TeamDash from "@/components/dashboard/TeamDash";
import { useNavigate } from "react-router-dom";
import SubTeamDash from "@/components/dashboard/SubTeamDash";
import SubTeamProvider from "@/contexts/subTeamContext";
import TaskProvider from "@/contexts/taskContext";
import TaskDash from "@/components/dashboard/TaskDash";
import Navbar from "@/components/dashboard/Navbar";

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ tab = "Project" }) {
  const navigate = useNavigate();
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [renderList, setRenderList] = useState(tab);

  useEffect(() => {
    const path =
      renderList[0].toLowerCase() + renderList.substring(1).replace(/\s/g, "");
    navigate(`/user/${path}s`);
  }, [renderList, navigate]);

  const props = { renderList, setRenderList, showAddPopUp, setShowAddPopUp };

  const dashBodyMap = {
    Project: ProjectDash,
    Team: TeamDash,
    "Sub Team": SubTeamDash,
    Task: TaskDash,
  };

  const DashBody = dashBodyMap[renderList];

  return (
    <>
      <SideBar />
      <ProjectProvider>
        <TeamProvider>
          <SubTeamProvider>
            <TaskProvider>
              <div className="flex pl-[235px] flex-col h-screen">
                <Navbar />
                {DashBody && <DashBody {...props} />}
              </div>
            </TaskProvider>
          </SubTeamProvider>
        </TeamProvider>
      </ProjectProvider>
      {showAddPopUp && (
        <AddComponent
          renderList={renderList}
          setShowAddPopUp={setShowAddPopUp}
        />
      )}
    </>
  );
}
