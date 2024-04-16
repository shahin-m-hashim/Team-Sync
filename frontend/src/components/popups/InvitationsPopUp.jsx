/* eslint-disable react/prop-types */
import { useState } from "react";
import defaultDp from "../../assets/images/defaultDp.png";

const Invitation = ({ id, time, date, image, status, message, invitedBy }) => {
  return (
    <div
      key={id}
      className="relative bg-[#D9D9D9] text-black gap-5 px-4 py-2 rounded-md flex items-center justify-around"
    >
      <img
        className="object-cover object-center w-12"
        src={image || defaultDp}
      />
      <div className="flex flex-col gap-1">
        <span className="font-medium">New invitation from {invitedBy}</span>
        <div>{message}</div>
      </div>
      <div className="absolute flex gap-4 right-2 bottom-1">
        <span>{time}</span>
        <span>{date}</span>
      </div>
      {status === "rejected" ? (
        <div>
          <button className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-red-500"
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
      ) : (
        <>
          <div className="px-2 ml-20 text-white bg-green-600">ACCEPTED</div>
          {/* <div className="px-2 text-white bg-red-600">REJECTED</div> */}
          {/* <div className="px-2 text-white bg-yellow-600">EXPIRED</div> */}
        </>
      )}
    </div>
  );
};

export default function InvitationsPopUp({ invitations }) {
  const [NOI, setNOI] = useState("3");
  const [circle, setCircle] = useState("●");
  const [read, setRead] = useState("unread");

  const handleInvitations = () => {
    setNOI("0");
    setCircle("");
    setRead("read");
  };
  const [showPopup, setShowPopup] = useState(true);

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleAccept = () => {
    console.log("Accepted invitation");
    setShowPopup(false);
  };

  const handleReject = () => {
    console.log("Rejected invitation");
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-gray-800 bg-opacity-50">
          <div className="max-w-2xl p-8 bg-white rounded-lg">
            <div className="relative flex items-center mb-5">
              <h1 className="text-xl font-bold text-blue-600">Notifications</h1>
              <div className="bg-[#0e2152] pl-2 pr-2 ml-2 rounded-[4px]">
                <p className="text-[13px] text-white">{NOI}</p>
              </div>
              <div className="absolute right-5">
                <p className="text-[12px] text-gray-500 links">
                  Mark all as read
                </p>
              </div>
            </div>
            <div className={read}>
              <Invitation
                time="10:20 PM"
                img={defaultDp}
                circle={circle}
                date="10/04/2024"
                invitedBy={"Mark"}
                post={"My first tournament today!"}
                action={"reacted to your recent post"}
                message={
                  "You have been invited to join the project Project New as a guide by its leader shahin123."
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
