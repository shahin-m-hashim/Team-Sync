import github from "../../assets/images/github.png";
import Navbar from "@/components/navbars/UserNavbar";
import ImageHandler from "@/components/ImageHandler";
import website from "../../assets/images/website.png";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";
import linkedIn from "../../assets/images/linkedIn.png";
import defaultDp from "../../assets/images/defaultDp.png";
import DeleteAccount from "@/components/auth/DeleteAccount";
import PrimaryUserForm from "@/components/forms/user/PrimaryUserForm";
import SecondaryUserForm from "@/components/forms/user/SecondaryUserForm";

export default function UserSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [enablePrimaryEdit, setEnablePrimaryEdit] = useState(false);
  const [enableSecondaryEdit, setEnableSecondaryEdit] = useState(false);

  const { user, updateUserDetails, deleteUserData, setReFetchUser } =
    useContext(UserContext);

  const updateProfilePic = async (downloadURL) => {
    await updateUserDetails("profilePic", {
      newProfilePic: downloadURL,
    });
    setReFetchUser((prev) => !prev);
  };

  const deleteProfilePic = async () => {
    await deleteUserData("profilePic");
    setReFetchUser((prev) => !prev);
  };

  useEffect(() => {
    if (!isEditing) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to leave?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing]);

  return (
    <>
      {showDeleteModal && (
        <DeleteAccount setShowDeleteModal={setShowDeleteModal} />
      )}
      <Navbar settings={"z-10 fixed px-2 top-0 left-0 right-0"} />
      <div className="text-white size-full grid grid-cols-[300px,1fr] pt-12 bg-[#2b2a2a]">
        <div className="relative flex flex-col justify-between px-6 py-5 bg-gray-500 size-full">
          <h2 className="text-2xl">General</h2>
          <ImageHandler
            MAX_SIZE={2}
            type="Profile Picture"
            defaultImage={defaultDp}
            setIsEditing={setIsEditing}
            updateImage={updateProfilePic}
            deleteImage={deleteProfilePic}
            initialImage={user?.profilePic}
            firebasePath={`users/${user?._id}/images/profilePic`}
          />
          {!enablePrimaryEdit ? (
            <>
              <span className="text-xl font-semibold text-slate-800">
                {user?.fname || "Your Full Name"}
              </span>
              <hr />
              <div className="flex justify-between text-sm">
                <span>{user?.username}</span>
                <span className="pr-5">{user?.pronoun}</span>
              </div>
              <hr />
              <div className="text-sm">{user?.tag || "Some Random User"}</div>
              <hr />
              <div className="text-sm">{user?.bio || "Your Bio"}</div>
              <hr />
              <h3 className="text-xl font-semibold text text-slate-800">
                Social Links
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex gap-2">
                  <img src={website} width={30} />
                  <a href={user?.socialLinks?.website}>
                    {user?.socialLinks?.website || "Website"}
                  </a>
                </div>
                <div className="flex gap-2">
                  <img src={linkedIn} width={30} />
                  <a href={user?.socialLinks?.linkedIn}>
                    {user?.socialLinks?.linkedIn || "LinkedIn"}
                  </a>
                </div>
                <div className="flex gap-2">
                  <img src={github} width={30} />
                  <a href={user?.socialLinks?.github}>
                    {user?.socialLinks?.github || "Github"}
                  </a>
                </div>
              </div>
              {!enablePrimaryEdit && (
                <button
                  onClick={() => setEnablePrimaryEdit(true)}
                  className="bg-blue-500 "
                >
                  Edit your profile
                </button>
              )}
            </>
          ) : (
            <PrimaryUserForm
              setIsEditing={setIsEditing}
              setEnablePrimaryEdit={setEnablePrimaryEdit}
            />
          )}
        </div>
        <main className="relative px-10 py-5 bg-gray-600 size-full">
          <span className="text-3xl">YOUR PUBLIC PROFILE</span>
          <SecondaryUserForm
            setIsEditing={setIsEditing}
            enableSecondaryEdit={enableSecondaryEdit}
            setEnableSecondaryEdit={setEnableSecondaryEdit}
          />
          <div className="mt-10 space-y-6">
            <div>
              <h1 className="mb-1 text-lg font-semibold">Delete Account</h1>
              <span className="text-sm">
                Once you delete your account, there is no going back. Please be
                certain.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="p-2 bg-red-600 rounded-sm hover:bg-red-500"
            >
              Delete Your Account
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
