/* eslint-disable react/prop-types */
import { useContext } from "react";
import { UserContext } from "@/providers/UserProvider";
import defaultDp from "../../assets/images/defaultDp.png";
import noInvitations from "../../assets/images/no activity.png";

export default function InvitationsCard() {
  const { invitations } = useContext(UserContext);

  console.log(invitations);

  const Invitations = () => (
    <div className="flex flex-col gap-2">
      {invitations.map((invitation) => {
        return (
          <div
            key={invitation?.id}
            className="bg-[#D9D9D9] text-black gap-5 p-2 rounded-md flex"
          >
            <img
              className="pl-2 size-14"
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
          </div>
        );
      })}
    </div>
  );

  const NoInvitations = () => (
    <div className="flex items-center gap-10 px-10">
      <img src={noInvitations} />
      <span className="flex-1 text-4xl font-light text-center">
        Currently, you have are no invitations !
      </span>
    </div>
  );

  return (
    <div className="flex flex-col justify-evenly bg-[#141414] px-5 py-2 rounded-md">
      <div className="flex justify-between">
        <span className="font-semibold">Project Invitations</span>
        <button className="text-lg text-blue-400 underline underline-offset-4">
          View all invitations ?
        </button>
      </div>
      {invitations.length ? <Invitations /> : <NoInvitations />}
    </div>
  );
}
