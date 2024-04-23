/* eslint-disable react/prop-types */

import noImg from "@/assets/images/emptyImg.png";
import { capitalizeFirstLetterOfEachWord } from "@/helpers/stringHandler";
import { cn } from "@/lib/utils";

const Activity = ({ id, img, message, isRead, time, date }) => {
  return (
    <div
      key={id}
      className={cn(
        !isRead ? "bg-[#d4e3f3]" : "bg-[#f5f3f3] border-slate-200 border-2",
        "relative min-h-20 border-2 border-gray-200 text-black gap-5 p-2 shadow-md rounded-md items-center grid grid-cols-[50px,1fr,150px]"
      )}
    >
      <img
        className="object-cover object-center rounded-[50%]"
        src={img || noImg}
      />
      <div className="flex flex-col gap-1">
        {!isRead && (
          <span className="font-medium">
            New activity
            <span className="pb-2 text-red-500">{"●"}</span>
          </span>
        )}
        <div>{message}</div>
      </div>
      <div className="absolute flex gap-4 right-2 bottom-1">
        <span>{time}</span>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default function ActivitiesPopUp({
  entity,
  activities,
  handleActivities,
  setShowActivitiesPopUp,
}) {
  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-gray-800 bg-opacity-50">
        <div className="max-w-2xl min-w-72 p-5 bg-white rounded-lg h-[71%]">
          <div className="relative flex items-center mb-4">
            <h1 className="text-xl font-bold text-blue-600">
              {capitalizeFirstLetterOfEachWord(entity)} Activities
            </h1>
            <div className="bg-[#0e2152] pl-2 pr-2 ml-2 rounded-md">
              <p className="p-1 text-xs text-white">{activities?.length}</p>
            </div>
            {activities?.length > 0 &&
              activities?.some((activity) => !activity.isRead) && (
                <button
                  onClick={() => handleActivities()}
                  className="absolute right-14"
                >
                  <p className="text-xs font-medium text-gray-500 links">
                    Mark all as read
                  </p>
                </button>
              )}
            <button
              className="absolute right-0 bottom-2"
              onClick={() => setShowActivitiesPopUp(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-red-500 cursor-pointer size-7 hover:text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="h-[90%] space-y-2 overflow-y-auto">
            {activities?.length > 0 ? (
              activities?.map((activity) => (
                <Activity
                  id={activity?.id}
                  key={activity?.id}
                  img={activity?.image}
                  time={activity?.time}
                  date={activity?.date}
                  isRead={activity?.isRead}
                  message={activity.message}
                />
              ))
            ) : (
              <div>
                <p className="text-center text-red-500">
                  This {entity || "entity"} currently have no activities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
