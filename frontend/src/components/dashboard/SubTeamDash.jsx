/* eslint-disable react/prop-types */
import ActivityCard from "@/components/cards/ActivityCard";
import MessageCard from "@/components/cards/MessageCard";
import StatusCard from "@/components/cards/StatusCard";
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";

export default function SubTeamDash({
  setRenderList,
  renderList,
  setShowAddPopUp,
}) {
  return (
    <>
      <div className="grid grid-cols-[1.3fr,1fr,270px] text-white">
        <StatusCard />
        <ActivityCard />
        <MessageCard />
      </div>
      <div className="bg-[#141414] mx-1 rounded-t-md text-white">
        <ListHeader
          setShowAddPopUp={setShowAddPopUp}
          setRenderList={setRenderList}
          renderList={renderList}
        />
      </div>
      <div
        id="scrollableListBody"
        className="flex flex-col h-svh overflow-auto m-1 mt-0 rounded-b-md bg-[#141414] text-white"
      >
        <ListSubHeader renderList={renderList} />
        <ListBody renderList={renderList} />
      </div>
    </>
  );
}
