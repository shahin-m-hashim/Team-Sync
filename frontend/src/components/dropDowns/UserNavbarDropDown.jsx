/* eslint-disable react/prop-types */

import { useContext } from "react";
import { Link } from "react-router-dom";
import { getLocalSecureItem } from "@/lib/utils";
import { UserContext } from "@/providers/UserProvider";

const UserNavbarDropDown = ({ name }) => {
  const user = getLocalSecureItem("user", "low");
  const { setUserStatus } = useContext(UserContext);

  return (
    <div className="absolute z-[51] text-left divide-y divide-black rounded-lg shadow min-w-36 w-max bg-slate-300 right-3 top-8 dark:bg-gray-700 dark:divide-gray-600">
      {name && (
        <div className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
          <div>{name}</div>
        </div>
      )}
      <ul
        className="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownUserAvatarButton"
      >
        <li>
          <Link
            to={`/user/${user?.id}/dashboard`}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to={`/user/${user?.id}/settings/general`}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Settings
          </Link>
        </li>
        <li>
          <Link
            to={`/user/${user?.id}/settings/security`}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Security
          </Link>
        </li>
      </ul>
      <div className="py-2">
        <button
          onClick={() => setUserStatus("LOGGED_OUT")}
          className="w-full px-4 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserNavbarDropDown;
