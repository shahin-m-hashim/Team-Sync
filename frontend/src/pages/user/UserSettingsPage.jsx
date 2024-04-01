import { useContext, useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import github from "../../assets/images/github.png";
import ChangeUserDp from "@/components/ChangeUserDp";
import website from "../../assets/images/website.png";
import { UserContext } from "@/providers/UserProvider";
import linkedIn from "../../assets/images/linkedIn.png";
import PrimaryUserForm from "@/components/user/PrimaryUserForm";
import SecondaryUserForm from "@/components/user/SecondaryUserForm";

export default function UserSettingsPage() {
  const { primaryData } = useContext(UserContext);
  const [enablePrimaryEdit, setEnablePrimaryEdit] = useState(false);
  const [enableSecondaryEdit, setEnableSecondaryEdit] = useState(false);

  return (
    <>
      <Navbar settings={"min-h-10 py-2 m-0 z-10 fixed top-0 left-0 right-0"} />
      <div className=" text-white h-svh w-svw overflow-auto grid grid-cols-[300px,1fr] pt-10 bg-[#2b2a2a]">
        <div className="relative flex flex-col justify-between px-6 py-5 bg-gray-500 size-full">
          <h2 className="text-2xl">General</h2>
          <ChangeUserDp />
          {!enablePrimaryEdit ? (
            <>
              <span className="text-xl font-semibold text-slate-800">
                {primaryData?.fname || "Your Full Name"}
              </span>
              <hr />
              <div className="flex justify-between text-sm">
                <span>shahin123</span>
                <span className="pr-5">{primaryData?.pronoun}</span>
              </div>
              <hr />
              <div className="text-sm">
                {primaryData?.tag || "Some Random User"}
              </div>
              <hr />
              <div className="text-sm">
                {primaryData?.bio || "Your Bio"}
              </div>
              <hr />
              <h3 className="text-xl font-semibold text text-slate-800">
                Social Links
              </h3>
              <div className="flex flex-col gap-2 text-base">
                <div className="flex gap-2">
                  <img src={website} width={30} />
                  <a href={primaryData?.socialLinks?.website}>{primaryData?.socialLinks?.website || "Website"}</a>
                </div>
                <div className="flex gap-2">
                  <img src={linkedIn} width={30} />
                  <a href={primaryData?.socialLinks?.linkedIn}>{primaryData?.socialLinks?.linkedIn || "LinkedIn"}</a>
                </div>
                <div className="flex gap-2">
                  <img src={github} width={30} />
                  <a href={primaryData?.socialLinks?.github}>{primaryData?.socialLinks?.github || "Github"}</a>
                </div>
              </div>
              <div className="flex gap-2">
                {!enablePrimaryEdit && (
                  <button
                    onClick={() => setEnablePrimaryEdit(true)}
                    className="px-2 bg-blue-500"
                  >
                    Edit your profile
                  </button>
                )}
              </div>
            </>
          ) : (
            <PrimaryUserForm setEnablePrimaryEdit={setEnablePrimaryEdit} />
          )}
        </div>
        <SecondaryUserForm
          enableSecondaryEdit={enableSecondaryEdit}
          setEnableSecondaryEdit={setEnableSecondaryEdit}
        />
      </div>
    </>
  );
}
