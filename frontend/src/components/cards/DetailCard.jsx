/* eslint-disable react/prop-types */
import user1 from "../../assets/images/activities/user1.png";
import user2 from "../../assets/images/activities/user2.png";
import user3 from "../../assets/images/activities/user3.png";
import user4 from "../../assets/images/activities/user4.png";
import user5 from "../../assets/images/activities/user5.png";

import invite from "../../assets/images/invite.png";
import report from "../../assets/images/report.png";
import settings from "../../assets/images/settings colored.png";
import groupVoiceCall from "../../assets/images/Call.png";
import groupChat from "../../assets/images/Chat Messages.png";
import groupVideoCall from "../../assets/images/Video Call.png";

export default function DetailCard({ details }) {
  details.membersDp = [user1, user2, user3, user4, user5];

  return (
    <div className="grid grid-cols-2 bg-[#141414] m-1 mr-0 rounded-lg p-3 px-10 ">
      <div className="flex flex-col justify-around">
        <span className="ml-[-3px] text-4xl font-semibold">{details.name}</span>
        <div className="flex items-center gap-3">
          <span>Leader&nbsp;:&nbsp;{details.leader}</span>
          <img src={user1} width={"15%"} alt="leaderDp" />
        </div>
        <div className="flex items-center gap-3">
          <span>Guide&nbsp;:&nbsp;{details.guide}</span>
          <img src={user2} width={"15%"} alt="leaderDp" />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 h-7 p-3 text-xs  border-[1px] border-white rounded-xl">
            <img src={invite} alt="invite" />
            <span>Invite</span>
          </button>
          <button>
            <img src={settings} alt="settings" />
          </button>
          <button>
            <img src={report} alt="report" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-start justify-around">
        <div className="flex items-center">
          <img src={user1} width={"16%"} />
          <img src={user2} width={"16%"} className="ml-[-10px]" />
          <img src={user3} width={"16%"} className="ml-[-10px]" />
          <img src={user4} width={"16%"} className="ml-[-10px]" />
          <img src={user5} width={"16%"} className="ml-[-10px]" />
          <div className="p-2 bg-slate-800 border-white border-2 ml-[-10px] rounded-[50%]">
            +{details.nom - 5}
          </div>
        </div>
        <span className="text-[#9685FF] text-lg">{details.nom} members</span>
        <div className="flex items-center gap-10 ml-[-10px]">
          <img src={groupVoiceCall} />
          <img src={groupChat} />
          <img src={groupVideoCall} />
        </div>
      </div>
    </div>
  );
}
