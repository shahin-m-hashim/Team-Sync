/* eslint-disable react/prop-types */

import Loading from "./Loading";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import addDp from "../assets/images/addDp.png";
import editDp from "../assets/images/editDp.png";
import { useContext, useEffect, useRef, useState } from "react";
import defaultDp from "../assets/images/defaultDp.png";
import { FileContext } from "@/providers/FileProvider";
import { ErrorContext } from "@/providers/ErrorProvider";

const DropUpMenu = ({
  userDp,
  dpInputRef,
  handleSaveDp,
  handleDeleteDp,
  handleCancelImage,
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
          onClick={handleCancelImage}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default function ImageHandler({
  position,
  updateImage,
  deleteImage,
  setIsEditing,
  initialImage,
  firebasePath,
  MAX_SIZE = 2 * 1024 * 1024,
}) {
  const { setError } = useContext(ErrorContext);
  const { file, uploadFile, deleteFile } = useContext(FileContext);

  useEffect(() => {
    console.log("updating");
    if (file.uploadStatus === "completed") {
      setImage(file.uploadedFileURL);
    }
  }, [file.uploadStatus, file.uploadedFileURL]);

  const dpInputRef = useRef();
  const dpErrorRef = useRef();

  const [imgFile, setImgFile] = useState();
  const [image, setImage] = useState(initialImage);
  const [showDropDown, setShowDropDown] = useState(false);

  const handleImageChange = (e) => {
    setIsEditing(true);
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_SIZE) {
      dpErrorRef.current.style.display = "flex";
      return;
    } else {
      dpErrorRef.current.style.display = "none";
    }
    setImgFile(file);
    setImage(URL.createObjectURL(file));
    setShowDropDown(true);
  };

  const handleCancelImage = () => {
    setIsEditing(false);
    setShowDropDown(false);
    setImage(initialImage);
    dpInputRef.current.value = "";
    dpErrorRef.current.style.display = "none";
  };

  const handleSaveDp = async () => {
    if (!imgFile) return;

    setIsEditing(false);
    setShowDropDown(false);
    setImage(initialImage);
    dpInputRef.current.value = "";
    dpErrorRef.current.style.display = "none";

    try {
      toast.info("Profile pic will be updated shortly...");
      await uploadFile(imgFile, firebasePath, updateImage);
      toast.success("Update successful!");
    } catch (error) {
      if (error.response?.status === 401) {
        setError("unauthorized");
        await deleteFile(firebasePath);
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.response?.status === 500
      ) {
        setError("serverError");
        await deleteFile(firebasePath);
      } else {
        toast.error("Profile Pic Update failed !!!");
        console.log("Error uploading profile pic:", error);
      }
    }
  };

  const handleDeleteDp = async () => {
    setIsEditing(false);
    setShowDropDown(false);
    dpInputRef.current.value = "";
    dpErrorRef.current.style.display = "none";

    try {
      await deleteImage();
      await deleteFile(firebasePath);
      setImage("");
      toast.success("Deletion sucessfull !!!");
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
        setImage(initialImage);
        toast.error("Deletion Failed !!!");
        console.error("Error deleting file:", error);
      }
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-center">
        <img
          src={image || defaultDp}
          alt="display-picture"
          className="mx-auto rounded-[50%] size-[150px] object-cover object-center"
        />
        <span
          ref={dpErrorRef}
          className="absolute hidden p-1 text-xs font-semibold text-red-500 bg-black top-[-10px]"
        >
          Max file size is 2 MB
        </span>
        {file.uploadStatus === "uploading" && <Loading />}
        {!image ? (
          <img
            src={addDp}
            alt="addDp"
            onClick={() => dpInputRef.current.click()}
            className={cn(
              position ? "right-[-5px] bottom-4" : "bottom-4 right-12",
              "absolute p-1 bg-slate-800 rounded-3xl size-10 hover:cursor-pointer"
            )}
          />
        ) : (
          <div
            className={cn(
              position ? "right-[-5px] bottom-4" : "bottom-4 right-12",
              "absolute"
            )}
          >
            <img
              src={editDp}
              alt="editDp"
              onClick={() => setShowDropDown(!showDropDown)}
              className="p-2 bg-slate-800 rounded-3xl size-10 hover:cursor-pointer"
            />
            {showDropDown && (
              <DropUpMenu
                userDp={initialImage}
                dpInputRef={dpInputRef}
                handleSaveDp={handleSaveDp}
                handleCancelImage={handleCancelImage}
                handleDeleteDp={handleDeleteDp}
              />
            )}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={dpInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </>
  );
}
