/* eslint-disable react/prop-types */
import addDp from "../assets/images/addDp.png";
import editDp from "../assets/images/editDp.png";
import defaultDp from "../assets/images/defaultDp.png";
import { useContext, useRef, useState } from "react";
import { getLocalSecureItem } from "@/lib/utils";

import {
  ref,
  getStorage,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

import app from "@/lib/firebase";
import { UserContext } from "@/providers/UserProvider";
import { toast } from "react-toastify";

const MAX_DP_SIZE = 2 * 1024 * 1024;
// const base_url = import.meta.env.VITE_APP_BASE_URL;

const DropUpMenu = ({
  userDp,
  handleCancelDp,
  dpInputRef,
  handleDeleteDp,
  handleSaveDp,
}) => {
  return (
    <div className="absolute flex flex-col p-1 text-xs bottom-8 left-10 bg-slate-900">
      <div className="flex flex-col space-y-1">
        <button
          type="button"
          className="p-1 bg-blue-500"
          onClick={() => dpInputRef.current.click()}
        >
          Change
        </button>
        {userDp && (
          <button
            type="button"
            onClick={handleDeleteDp}
            className="p-1 bg-red-500"
          >
            Remove
          </button>
        )}
        <button
          type="button"
          onClick={handleSaveDp}
          className="p-1 bg-green-500"
        >
          Save
        </button>
        <button
          type="button"
          className="p-1 bg-red-500"
          onClick={handleCancelDp}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const LoadingSvg = () => (
  <svg
    aria-hidden="true"
    className="absolute text-gray-200 size-10 animate-spin dark:text-gray-600 fill-blue-600"
    viewBox="0 0 100 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      fill="currentColor"
    />
    <path
      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      fill="currentFill"
    />
  </svg>
);

export default function ChangeUserDp({ setError }) {
  const user = getLocalSecureItem("user", "low");
  const { userData, updateUserDetails, deleteUserData, setReFetchUser } =
    useContext(UserContext);

  const dpInputRef = useRef();
  const dpErrorRef = useRef();
  const storage = getStorage(app);
  const storageRef = ref(storage, `users/${user?.id}/images/profilePic`);

  const [dpFile, setDpFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dp, setDp] = useState(userData?.profilePic);
  const [showDropDown, setShowDropDown] = useState(false);

  const handleDpChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_DP_SIZE) {
      dpErrorRef.current.style.display = "flex";
      return;
    } else {
      dpErrorRef.current.style.display = "none";
    }
    setDpFile(file);
    setDp(URL.createObjectURL(file));
    setShowDropDown(true);
  };

  const handleCancelDp = () => {
    setShowDropDown(false);
    setDp(userData.profilePic);
    dpInputRef.current.value = "";
    dpErrorRef.current.style.display = "none";
  };

  const handleSaveDp = async () => {
    if (!dpFile) return;

    setIsLoading(true);
    try {
      await uploadBytes(storageRef, dpFile);
      const downloadURL = await getDownloadURL(storageRef);
      await updateUserDetails("profilePic", {
        newProfilePic: downloadURL,
      });
      toast.success("User dp updated !");
      setReFetchUser((prev) => !prev);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("unauthorized");
        await deleteObject(storageRef);
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.response?.status === 500
      ) {
        setError("serverError");
        await deleteObject(storageRef);
      } else {
        toast.error("Update failed !!!");
        setDp(userData?.profilePic);
        dpInputRef.current.value = "";
        console.error("Error uploading file:", error);
      }
    } finally {
      setIsLoading(false);
      setShowDropDown(false);
      dpErrorRef.current.style.display = "none";
    }
  };

  const handleDeleteDp = async () => {
    setIsLoading(true);
    try {
      await deleteObject(storageRef);
      await deleteUserData("profilePic");
      toast.success("Deletion sucessfull !!!");
      setDp("");
      setReFetchUser((prev) => !prev);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("unauthorized");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.response?.status === 500
      ) {
        setError("serverError");
      } else {
        setDp(userData?.profilePic);
        toast.error("Deletion Failed !!!");
        console.error("Error deleting file:", error);
      }
    } finally {
      setIsLoading(false);
      setShowDropDown(false);
      dpErrorRef.current.style.display = "none";
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <img
          src={dp || defaultDp}
          alt="display-picture"
          className="mx-auto rounded-[50%] size-[150px] object-cover object-center"
        />
        {isLoading && <LoadingSvg />}
      </div>
      <div
        ref={dpErrorRef}
        className="absolute top-[-10px] hidden w-full pointer-events-none"
      >
        <span className="p-1 mx-auto text-xs font-semibold text-red-500 bg-black">
          Max file size is 2 MB
        </span>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={dpInputRef}
        className="hidden"
        onChange={handleDpChange}
      />
      {!dp ? (
        <img
          src={addDp}
          alt="addDp"
          onClick={() => dpInputRef.current.click()}
          className="absolute p-1 bg-slate-800 bottom-4 right-12 rounded-3xl size-10 hover:cursor-pointer"
        />
      ) : (
        <div className="absolute bottom-4 right-12">
          <img
            src={editDp}
            alt="editDp"
            onClick={() => setShowDropDown(!showDropDown)}
            className="p-2 bg-slate-800 rounded-3xl size-10 hover:cursor-pointer"
          />
          {showDropDown && (
            <DropUpMenu
              userDp={userData.profilePic}
              dpInputRef={dpInputRef}
              handleSaveDp={handleSaveDp}
              handleCancelDp={handleCancelDp}
              handleDeleteDp={handleDeleteDp}
            />
          )}
        </div>
      )}
    </div>
  );
}
