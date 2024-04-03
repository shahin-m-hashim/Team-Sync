/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import { UserContext } from "@/providers/UserProvider";
import ContactUserForm from "@/components/user/ContactUserForm";
import SecurityUserForm from "@/components/user/SecurityUserForm";
import ReLoginPage from "../ReLoginPage";
import ServerErrorPage from "../ServerErrorPage";

export default function SecuritySettingsPage() {
  const [error, setError] = useState();
  const { userData } = useContext(UserContext);
  const [enableContactEdit, setEnableContactEdit] = useState(false);
  const [enableSecurityEdit, setEnableSecurityEdit] = useState(false);

  if (error === "unauthorized") {
    localStorage.clear();
    return <ReLoginPage />;
  }

  if (error === "serverError") {
    return <ServerErrorPage />;
  }

  return (
    <>
      <Navbar settings={"min-h-14 m-0 z-10 fixed top-0 left-0 right-0"} />
      <div className="w-svw h-svh overflow-auto pt-28 px-20 text-white shadow-md bg-[#2b2a2a]">
        <h1 className="max-w-6xl mx-auto text-3xl">Sign In And Security</h1>
        <div className="grid max-w-6xl grid-cols-2 mx-auto mt-8 w gap-y-5 gap-x-10">
          <div className="p-10 rounded-md bg-slate-700">
            <div className="mb-8 space-y-2">
              <h1 className="text-xl font-semibold">Primary settings</h1>
              <p className="text-xs text-gray-400">
                Update your account&apos;s security settings
              </p>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Primary Email
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                {userData?.email || "Your primary email"}
              </div>
            </div>
            {enableContactEdit ? (
              <ContactUserForm
                setError={setError}
                enableContactEdit={enableContactEdit}
                setEnableContactEdit={setEnableContactEdit}
              />
            ) : (
              <>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Secondary Email
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                    {userData?.secondaryEmail || "Your secondary email"}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span>Phone Number</span>
                  <div className="flex gap-1">
                    <div className="px-4 py-2 font-semibold text-black bg-blue-300 rounded-md">
                      {userData?.phone?.countryCode || "+91"}
                    </div>
                    <div className="w-full p-2 text-black bg-blue-300 rounded-md">
                      {userData?.phone?.number || "0000000000"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setEnableContactEdit(!enableContactEdit)}
                  className="mt-10 flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                  <span>&nbsp;Update Info</span>
                </button>
              </>
            )}
          </div>
          <div className="p-10 rounded-md bg-slate-700">
            <div className="mb-8 space-y-2">
              <h1 className="text-xl font-semibold">Change Password</h1>
              <p className="text-xs text-gray-400">
                Update your account&apos;s password
              </p>
            </div>
            {enableSecurityEdit ? (
              <SecurityUserForm
                setError={setError}
                setEnableSecurityEdit={setEnableSecurityEdit}
              />
            ) : (
              <>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Current Password
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-300 border border-gray-300 rounded-md text-slate-600 focus:outline-none focus:border-indigo-500">
                    Enter your current password
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    New Password
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-300 border border-gray-300 rounded-md text-slate-600 focus:outline-none focus:border-indigo-500">
                    Enter a new secure password
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Confirm New Password
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-300 border border-gray-300 rounded-md text-slate-600 focus:outline-none focus:border-indigo-500">
                    Enter your new password
                  </div>
                </div>
                <button
                  onClick={() => setEnableSecurityEdit(!enableSecurityEdit)}
                  className="mt-10 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                  <span>&nbsp;Reset Password</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
