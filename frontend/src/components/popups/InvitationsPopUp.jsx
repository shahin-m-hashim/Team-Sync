/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import defaultDp from "../../assets/images/defaultDp.png";

const Invitation = ({
  id,
  time,
  date,
  from,
  isRead,
  status,
  message,
  handleInvitation,
}) => {
  return (
    <div
      id={id}
      className={cn(
        !isRead ? "bg-[#d4e3f3]" : "bg-[#f5f3f3] border-slate-100 border-2",
        "relative text-black gap-5 p-2 shadow-md rounded-md items-center grid grid-cols-[50px,1fr,150px]"
      )}
    >
      <img
        className="object-cover object-center rounded-[50%]"
        src={from.profilePic || defaultDp}
      />
      <div className="flex flex-col gap-1">
        <span className="font-medium">
          New invitation from&nbsp;
          <span className="text-lg font-semibold text-blue-700">
            {from.username}
          </span>
          <span className="pb-2 text-red-500">&nbsp;{!isRead && "●"}</span>
        </span>
        <div>{message}</div>
      </div>
      <div className="absolute flex gap-4 right-2 bottom-1">
        <span>{time}</span>
        <span>{date}</span>
      </div>
      <>
        {status === "accepted" && (
          <div className="px-2 mx-auto mb-4 text-sm text-white bg-green-600">
            ACCEPTED
          </div>
        )}
        {status === "rejected" && (
          <div className="px-2 mx-auto mb-4 text-sm text-white bg-red-600">
            REJECTED
          </div>
        )}
        {status === "expired" && (
          <div className="px-2 mx-auto mb-4 text-sm text-white bg-yellow-600">
            EXPIRED
          </div>
        )}
        {status === "pending" && (
          <div className="flex gap-2 mb-4">
            <button
              className="px-2 text-white bg-green-600 rounded-md"
              onClick={() => handleInvitation(id, "accept")}
            >
              Accept
            </button>
            <button
              className="px-2 text-white bg-red-600 rounded-md"
              onClick={() => handleInvitation(id, "reject")}
            >
              Reject
            </button>
          </div>
        )}
      </>
    </div>
  );
};

export default function InvitationsPopUp({
  invitations,
  handleInvitation,
  setShowAllInvitations,
}) {
  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-gray-800 bg-opacity-50">
        <div className="max-w-2xl min-w-72 p-5 bg-white rounded-lg h-[80%]">
          <div className="relative flex items-center mb-4">
            <h1 className="text-xl font-bold text-blue-600">Invitations</h1>
            <div className="bg-[#0e2152] pl-2 pr-2 ml-2 rounded-[4px]">
              <p className="p-1 text-xs text-white">
                {invitations.length || 0}
              </p>
            </div>
            <button
              className="absolute right-0 bottom-2"
              onClick={() => setShowAllInvitations(false)}
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
            {invitations?.length > 0 ? (
              invitations?.map((invitation) => (
                <Invitation
                  id={invitation._id}
                  key={invitation._id}
                  time={invitation.time}
                  date={invitation.date}
                  from={invitation.from}
                  isRead={invitation.isRead}
                  status={invitation.status}
                  message={invitation.message}
                  handleInvitation={handleInvitation}
                />
              ))
            ) : (
              <div>
                <p className="text-center text-red-500">No invitations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
