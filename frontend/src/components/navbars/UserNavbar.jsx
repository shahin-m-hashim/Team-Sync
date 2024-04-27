/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import TaskUploads from "../TaskUploads";
import { useContext, useState } from "react";
import Notifications from "../Notifications";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/providers/UserProvider";
import defaultDp from "../../assets/images/defaultDp.png";
import UserNavbarDropDown from "../dropDowns/UserNavbarDropDown";

export default function UserNavbar({ settings }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showTaskUploadsPopUp, setShowTaskUploadsPopUp] = useState(false);
  const [showNotificationsPopUp, setShowNotificationsPopUp] = useState(false);

  return (
    <>
      <div
        className={cn(
          settings ? settings : "z-10 fixed top-0 left-0 right-0 px-48 py-3",
          "min-h-12 bg-[#141414] flex justify-between items-center"
        )}
      >
        <button
          onClick={() => navigate(`/user/${user._id}/dashboard`)}
          className="text-[#9685FF] font-semibold"
        >
          TeamSync
        </button>
        <div className="inline-flex items-center gap-6">
          <TaskUploads
            showTaskUploadsPopUp={showTaskUploadsPopUp}
            setShowTaskUploadsPopUp={setShowTaskUploadsPopUp}
          />
          <Notifications
            showNotificationsPopUp={showNotificationsPopUp}
            setShowNotificationsPopUp={setShowNotificationsPopUp}
          />
          <div
            className="relative cursor-pointer"
            onClick={() => setShowDropDown(!showDropDown)}
          >
            <img
              src={user?.profilePic || defaultDp}
              className="size-7 rounded-[50%] object-cover object-center"
            />
            {showDropDown && <UserNavbarDropDown name={user?.fname} />}
          </div>
        </div>
      </div>
    </>
  );
}
