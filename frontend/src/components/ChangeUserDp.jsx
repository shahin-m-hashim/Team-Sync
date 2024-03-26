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
import axios from "axios";
import { authContext } from "@/providers/AuthProvider";

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

export default function ChangeUserDp() {
  const { authorize } = useContext(authContext);
  const { userId, userDp = "" } = getLocalSecureItem("primary-user", "medium");

  const dpInputRef = useRef();
  const dpErrorRef = useRef();
  const storage = getStorage(app);
  const storageRef = ref(storage, `users/${userId}/images/${userDp.name}`);

  const [dp, setDp] = useState(userDp);
  const [showLoading, setShowLoading] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  const handleDpChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_DP_SIZE) {
      dpErrorRef.current.style.display = "block";
      return;
    }
    setDp(URL.createObjectURL(file));
  };

  const handleCancelDp = () => {
    setDp(userDp);
    dpInputRef.current.value = "";
    setShowDropDown(false);
  };

  const handleSaveDp = async () => {
    if (!dp) return;
    setShowLoading(true);

    try {
      await uploadBytes(storageRef, dp);
      const downloadURL = await getDownloadURL(storageRef);
      await axios.post("/user/uploadDp", {
        userId,
        profilePicture: downloadURL,
      });
      await authorize();
      setDp(downloadURL); // Assuming the server returns the updated dp URL
    } catch (error) {
      setDp("");
      dpInputRef.current.value = "";
      await deleteObject(storageRef);
      alert("Error setting your Dp, try again later");
      console.error("Error uploading file:", error);
    } finally {
      setShowDropDown(false);
      setShowLoading(false);
    }
  };

  const handleDeleteDp = async () => {
    setShowLoading(true);
    try {
      await deleteObject(storageRef);
      await axios.post("/user/uploadDp", { userId, profilePicture: "" });
      await authorize();
      setDp(""); // Clear the dp
    } catch (error) {
      dpInputRef.current.value = "";
      alert("Error deleting your Dp, try again later");
      console.error("Error deleting file:", error);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <div className="text-white h-screen w-screen overflow-auto grid grid-cols-[300px,1fr] pt-14 bg-[#2b2a2a]">
      <div className="flex flex-col gap-4 px-10 py-5 bg-gray-500 size-full">
        <div className="relative">
          <div className="flex items-center justify-center">
            <img
              src={dp || defaultDp}
              alt="display-picture"
              className="mx-auto rounded-[50%] size-[150px] object-cover object-center"
            />
            {showLoading && <LoadingSvg />}
          </div>
          <div
            ref={dpErrorRef}
            className="absolute hidden top-[-20px] bg-black left-[40px] text-xs p-2 font-semibold m-2 text-red-500"
          >
            Max file size is 2MB
          </div>
          <input
            type="file"
            accept="image/*"
            ref={dpInputRef}
            className="hidden"
            onChange={handleDpChange}
          />
          {!dp ? (
            <button onClick={() => dpInputRef.current.click()}>
              <img
                src={addDp}
                alt="addDp"
                className="absolute p-2 ml-1 bg-slate-800 bottom-10 right-8 rounded-3xl size-10"
              />
            </button>
          ) : (
            <div className="absolute bottom-4 right-8">
              <img
                src={editDp}
                alt="editDp"
                onClick={() => setShowDropDown(!showDropDown)}
                className="p-2 ml-1 bg-slate-800 rounded-3xl size-10"
              />
              {showDropDown && (
                <DropUpMenu
                  userDp={userDp}
                  dpInputRef={dpInputRef}
                  handleSaveDp={handleSaveDp}
                  handleCancelDp={handleCancelDp}
                  handleDeleteDp={handleDeleteDp}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <main className="flex flex-col gap-8 px-10 py-4 bg-gray-600 size-full " />
    </div>
  );
}
