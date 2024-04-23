/* eslint-disable react/prop-types */

import { socket } from "@/App";
import Loading from "../Loading";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { updateData } from "@/services/db";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";
import defaultDp from "../../assets/images/defaultDp.png";
import InvitationsPopUp from "../popups/InvitationsPopUp";
import noInvitations from "../../assets/images/no activity.png";

const Invitations = ({ invitations, handleInvitation }) => {
  console.log(invitations);

  return (
    <div className="flex flex-col gap-2">
      {invitations?.slice(0, 3).map((invitation) => {
        return (
          <div
            key={invitation?._id}
            className={cn(
              invitation?.isRead ? "bg-[#D9D9D9]" : "bg-[#cae6f9]",
              "text-black gap-5 px-10 py-2 rounded-md flex items-center justify-between"
            )}
          >
            <img
              className="object-cover object-center w-12 rounded-full"
              src={invitation?.from?.profilePic || defaultDp}
            />
            <div className="flex flex-col gap-1">
              <span className="font-medium">
                New invitation from {invitation?.from?.username}
              </span>
              <div className="flex gap-4">
                <span>{invitation?.date}</span>
                <span>{invitation?.time}</span>
              </div>
            </div>

            {invitation?.status === "accepted" && (
              <div className="px-2 text-sm text-white bg-green-600">
                ACCEPTED
              </div>
            )}
            {invitation?.status === "rejected" && (
              <div className="px-2 text-sm text-white bg-red-600">REJECTED</div>
            )}
            {invitation?.status === "expired" && (
              <div className="px-2 text-sm text-white bg-yellow-600">
                EXPIRED
              </div>
            )}

            {invitation?.status === "pending" && (
              <div className="flex gap-5">
                <button
                  onClick={() => handleInvitation(invitation?._id, "accept")}
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green-500 size-10"
                  >
                    <path
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleInvitation(invitation?._id, "reject")}
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-red-500 size-10"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
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
    <span className="flex-1 text-3xl font-light text-center">
      Currently, you have are no invitations !
    </span>
  </div>
);

export default function InvitationsCard() {
  const { setError } = useContext(UserContext);
  const { setReFetchProjects } = useContext(UserContext);

  const [reFetchInvitations, setReFetchInvitations] = useState(false);
  const [showAllInvitations, setShowAllInvitations] = useState(false);

  const invitations = useFetch("invitations", reFetchInvitations);

  const handleInvitation = async (invitation, status) => {
    try {
      if (status === "accept") {
        await updateData("invitation/accept", {
          invitationId: invitation,
        });
      } else {
        await updateData("invitation/reject", {
          invitationId: invitation,
        });
      }

      setReFetchInvitations((prev) => !prev);
      setReFetchProjects((prev) => !prev);
    } catch (e) {
      toast.error(e.response.data.error || "Error handling invitation");
    }
  };

  useEffect(() => {}, [invitations?.data]);

  useEffect(() => {
    socket.on("invitations", (project) => setReFetchInvitations(project));
    return () => socket.off("invitations");
  }, []);

  if (invitations?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (invitations?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return invitations?.data ? (
    <>
      {showAllInvitations && invitations?.data?.length > 0 && (
        <InvitationsPopUp
          invitations={invitations?.data}
          NoInvitations={NoInvitations}
          handleInvitation={handleInvitation}
          setShowAllInvitations={setShowAllInvitations}
        />
      )}
      <div className="flex flex-col justify-evenly bg-[#141414] px-5 py-2 rounded-md">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Project Invitations</div>
          {invitations?.data?.length > 0 && (
            <button
              onClick={() => setShowAllInvitations(true)}
              className="relative pr-6 text-blue-400 underline underline-offset-4"
            >
              View all invitations ?
              {invitations?.data?.filter((invitation) => !invitation?.isRead)
                .length > 0 && (
                <div className="absolute bottom-0 right-0 flex items-center justify-center px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                  {
                    invitations?.data?.filter(
                      (invitation) => !invitation.isRead
                    ).length
                  }
                </div>
              )}
            </button>
          )}
        </div>
        {invitations?.data?.length > 0 ? (
          <Invitations
            invitations={invitations?.data}
            handleInvitation={handleInvitation}
          />
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
