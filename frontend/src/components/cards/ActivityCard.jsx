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
        // Add return statement here
        <div
          className="bg-[#D9D9D9] text-black gap-5 p-2 rounded-md flex"
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
    <div className="flex items-center object-contain gap-3">
      <img src={noActivities} alt="noActivities" width="35%" />
      <span className="text-xl font-light text-center">
        Currently,&nbsp;
        <br />
        There are no activities
      </span>
    </div>
  );

  return (
    <div className="flex flex-col bg-[#141414] my-1 rounded-lg p-3 justify-around">
      <span className="font-semibold">Activity</span>
      {activities.length ? <ActivityCards /> : <EmptyActivityCard />}
    </div>
  );
}
