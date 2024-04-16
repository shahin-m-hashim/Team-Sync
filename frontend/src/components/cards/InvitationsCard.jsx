/* eslint-disable react/prop-types */
import Loading from "../Loading";
import { useContext, useEffect } from "react";
import defaultDp from "../../assets/images/defaultDp.png";
import noInvitations from "../../assets/images/no activity.png";
import { InvitationsContext } from "@/providers/InvitationsProvider";
import InvitationsPopUp from "../popups/InvitationsPopUp";

const Invitations = ({ invitations }) => {
  console.log(invitations);

  return (
    <div className="flex flex-col gap-2">
      {invitations?.slice(0, 3).map((invitation) => {
        return (
          <div
            key={invitation?.id}
            className="bg-[#D9D9D9] text-black gap-5 px-10 py-2 rounded-md flex items-center justify-between"
          >
            <img
              className="object-cover object-center w-12"
              src={invitation?.image || defaultDp}
            />
            <div className="flex flex-col gap-1">
              <span className="font-medium">
                New invitation from {invitation?.invitedBy}
              </span>
              <div className="flex gap-4">
                <span>{invitation?.date}</span>
                <span>{invitation?.time}</span>
              </div>
            </div>
            {invitations.status !== "rejected" ? (
              <>
                <button className="flex items-center h-6 p-2 text-sm bg-green-500 rounded-md">
                  ACCEPT
                </button>
                <button className="flex items-center h-6 p-2 text-sm bg-red-500 rounded-md">
                  REJECT
                </button>
              </>
            ) : (
              <div className="px-2 bg-red-700">EXPIRED</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const NoInvitations = () => (
  <div className="flex items-center gap-10 px-10">
    <img src={noInvitations} />
    <span className="flex-1 text-4xl font-light text-center">
      Currently, you have are no invitations !
    </span>
  </div>
);

export default function InvitationsCard() {
  let { invitations } = useContext(InvitationsContext);

  useEffect(() => {}, [invitations]);

  return invitations ? (
    <>
      <InvitationsPopUp invitation={invitations[0]} />
      <div className="flex flex-col justify-evenly bg-[#141414] px-5 py-2 rounded-md">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Project Invitations</div>
          <button className="relative pr-6 text-blue-400 underline underline-offset-4">
            View all invitations ?
            {invitations?.length > 0 && (
              <span className="absolute p-1 w-5 right-0 text-xs text-white bg-blue-400 rounded-[50%]">
                {invitations.length}
              </span>
            )}
          </button>
        </div>
        {invitations?.length > 0 ? (
          <Invitations invitations={invitations} />
        ) : (
          <NoInvitations />
        )}
      </div>
    </>
  ) : (
    <div className="relative bg-[#141414]">
      <Loading />
    </div>
  );
}
