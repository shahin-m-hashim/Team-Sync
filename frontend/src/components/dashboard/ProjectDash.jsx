/* eslint-disable react/prop-types */
import ActivityCard from "@/components/cards/ActivityCard";
import MessageCard from "@/components/cards/MessageCard";
import StatusCard from "@/components/cards/StatusCard";
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";

export default function ProjectDash({
  setDisplayList,
  displayList,
  setShowAddPopUp,
}) {
  return (
    <div className="grid max-h-[703px] m-0 ml-[235px] grid-rows-[1fr,2fr]">
      <div className="grid mt-11 grid-cols-[1.3fr,1fr,270px] text-white">
        <StatusCard />
        <ActivityCard />
        <MessageCard />
      </div>

      <div className="bg-[#141414] m-1 mt-0 rounded-lg text-white">
        <ListHeader
          setShowAddPopUp={setShowAddPopUp}
          setDisplayList={setDisplayList}
          displayList={displayList}
        />
        <ListSubHeader />
        <ListBody displayList={displayList} />
      </div>
    </div>
  );
}
