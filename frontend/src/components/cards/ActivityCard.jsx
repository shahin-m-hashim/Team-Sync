import noActivities from "../../assets/images/no activity.png";

import user1 from "../../assets/images/activities/user1.png";
import user2 from "../../assets/images/activities/user2.png";
import user3 from "../../assets/images/activities/user3.png";

export default function ActivityCard() {
  const activities = [
    {
      userId: 321,
      dp: user1,
      description: "Ellie Joined Project 1",
      date: "04 April, 2024",
      time: "04:00 PM",
    },
    {
      userId: 322,
      dp: user2,
      description: "Adam joined Project 2",
      date: "04 April, 2024",
      time: "04:00 PM",
    },
    {
      userId: 323,
      dp: user3,
      description: "Jack joined project 3",
      date: "04 April, 2024",
      time: "04:00 PM",
    },
  ];

  const ActivityCards = () =>
    activities.map((activity) => {
      const { dp, description, date, time } = activity;
      return (
        <div
          className="bg-[#D9D9D9] text-black gap-5 p-1 rounded-md flex"
          key={activity.userId}
        >
          <img className="pl-2" src={dp} alt="user" />
          <div>
            <span className="font-medium">{description}</span>
            <div>
              <span>{date}</span>
              <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <span>{time}</span>
            </div>
          </div>
        </div>
      );
    });

  const EmptyActivityCard = () => (
    <div className="flex items-center object-contain gap-3 px-5">
      <img
        src={noActivities}
        className="flex-1"
        alt="noActivities"
        width="30%"
      />
      <span className="flex-1 text-xl font-light text-center">
        Currently,&nbsp;
        <br />
        There are no activities
      </span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#141414] p-3 border-white  rounded-md gap-2 justify-around">
      <span className="mb-3 font-semibold">Activity</span>
      {activities.length ? (
        <div className="mt-[-12px] flex flex-col gap-2">
          <ActivityCards />
        </div>
      ) : (
        <EmptyActivityCard />
      )}
    </div>
  );
}
