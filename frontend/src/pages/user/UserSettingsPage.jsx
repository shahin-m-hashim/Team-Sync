import app from "@/lib/firebase";
import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import { getStorage, ref } from "firebase/storage";
import github from "../../assets/images/github.png";
import ImageHandler from "@/components/ImageHandler";
import website from "../../assets/images/website.png";
import { UserContext } from "@/providers/UserProvider";
import linkedIn from "../../assets/images/linkedIn.png";
import DeleteAccount from "@/components/auth/DeleteAccount";
import PrimaryUserForm from "@/components/forms/user/PrimaryUserForm";
import SecondaryUserForm from "@/components/forms/user/SecondaryUserForm";

export default function UserSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [enablePrimaryEdit, setEnablePrimaryEdit] = useState(false);
  const [enableSecondaryEdit, setEnableSecondaryEdit] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to leave?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing]);

  const { userData, updateUserDetails, deleteUserData, setReFetchUser } =
    useContext(UserContext);

  const storage = getStorage(app);
  const storageRef = ref(storage, `users/${userData?._id}/images/profilePic`);

  const updateDp = async (downloadURL) =>
    await updateUserDetails("profilePic", {
      newProfilePic: downloadURL,
    });

  const deleteDp = async () => await deleteUserData("profilePic");

  const ReFetchUserDetails = () => setReFetchUser((prev) => !prev);

  return (
    <>
      {showDeleteModal && (
        <DeleteAccount setShowDeleteModal={setShowDeleteModal} />
      )}
      <Navbar settings={"z-10 fixed top-0 left-0 right-0"} />
      <div className="text-white size-full grid grid-cols-[300px,1fr] pt-14 bg-[#2b2a2a]">
        <div className="relative flex flex-col justify-between px-6 py-5 bg-gray-500 size-full">
          <h2 className="text-2xl">General</h2>
          <ImageHandler
            updateImage={updateDp}
            deleteImage={deleteDp}
            storageRef={storageRef}
            MAX_SIZE={100 * 1024 * 1024}
            setIsEditing={setIsEditing}
            initialImage={userData?.profilePic}
            reFetchDetails={ReFetchUserDetails}
          />
          {!enablePrimaryEdit ? (
            <>
              <span className="text-xl font-semibold text-slate-800">
                {userData?.fname || "Your Full Name"}
              </span>
              <hr />
              <div className="flex justify-between text-sm">
                <span>{userData?.username}</span>
                <span className="pr-5">{userData?.pronoun}</span>
              </div>
              <hr />
              <div className="text-sm">
                {userData?.tag || "Some Random User"}
              </div>
              <hr />
              <div className="text-sm">{userData?.bio || "Your Bio"}</div>
              <hr />
              <h3 className="text-xl font-semibold text text-slate-800">
                Social Links
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex gap-2">
                  <img src={website} width={30} />
                  <a href={userData?.socialLinks?.website}>
                    {userData?.socialLinks?.website || "Website"}
                  </a>
                </div>
                <div className="flex gap-2">
                  <img src={linkedIn} width={30} />
                  <a href={userData?.socialLinks?.linkedIn}>
                    {userData?.socialLinks?.linkedIn || "LinkedIn"}
                  </a>
                </div>
                <div className="flex gap-2">
                  <img src={github} width={30} />
                  <a href={userData?.socialLinks?.github}>
                    {userData?.socialLinks?.github || "Github"}
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
