import noActivities from "../../assets/images/no activity.png";

export default function ActivityCard() {
  return (
    <div id="activityCard" className="bg-[#141414] my-1 rounded-lg p-3">
      <span>Activity</span>
      <div className="flex items-center object-contain gap-3">
        <img src={noActivities} alt="noActivities" width="35%" />
        <span className="text-xl font-light text-center">
          Currently,&nbsp;
          <br />
          There are no activities
        </span>
      </div>
    </div>
  );
}
