/* eslint-disable react/prop-types */

import Loading from "./Loading";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import editImage from "../assets/images/edit.png";
import addImage from "../assets/images/addImage.png";
import { FileContext } from "@/providers/FileProvider";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useRef, useState } from "react";
import ImageHandlerDropUpMenu from "./dropDowns/ImageHandlerDropUpMenu";

export default function ImageHandler({
  size,
  type,
  btnSize,
  position,
  updateImage,
  deleteImage,
  setIsEditing,
  initialImage,
  defaultImage,
  firebasePath,
  MAX_SIZE = 2,
}) {
  const imgInputRef = useRef();
  const imgErrorRef = useRef();

  const { setError } = useContext(UserContext);
  const { file, uploadFile, deleteFile } = useContext(FileContext);

  const [image, setImage] = useState();
  const [imgFile, setImgFile] = useState();
  const [showDropDown, setShowDropDown] = useState(false);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  const handleImageChange = (e) => {
    setIsEditing(true);
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_SIZE * 1024 * 1024) {
      imgErrorRef.current.style.display = "flex";
      return;
    } else {
      imgErrorRef.current.style.display = "none";
    }
    setImgFile(file);
    setShowDropDown(true);
    setHasImageChanged(true);
    setImage(URL.createObjectURL(file));
  };

  const handleCancelImage = () => {
    setIsEditing(false);
    setShowDropDown(false);
    setImage(null);
    imgInputRef.current.value = "";
    imgErrorRef.current.style.display = "none";
    setHasImageChanged(false);
  };

  const handleSaveImage = async () => {
    if (!imgFile) return;

    try {
      toast.info(`${type || "Image"} will be updated shortly...`);
      await uploadFile(imgFile, firebasePath, updateImage);
      toast.success(`${type || "Image"} updated successfully !!!`);
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
        throw error;
      }
    } finally {
      setIsEditing(false);
      setShowDropDown(false);
      setHasImageChanged(false);
      imgInputRef.current.value = "";
      imgErrorRef.current.style.display = "none";
    }
  };

  const handleDeleteImage = async () => {
    setIsEditing(false);
    setShowDropDown(false);
    imgInputRef.current.value = "";
    imgErrorRef.current.style.display = "none";

    try {
      await deleteImage();
      await deleteFile(firebasePath);
      setImage("");
      toast.success(`${type || "Image"} deleted sucessfull !!!`);
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
        toast.error(`${type || "Image"} deletion Failed !!!`);
        console.error(`Error deleting ${type || "image"} :`, error);
      }
    } finally {
      setHasImageChanged(false);
    }
  };

  useEffect(() => {
    if (file.uploadStatus === "completed") {
      setImage(file.uploadedFileURL);
    }
  }, [file.uploadStatus, file.uploadedFileURL]);

  return (
    <>
      <div className="relative flex items-center justify-center">
        {hasImageChanged ? (
          <img
            src={image || defaultImage}
            className={cn(
              size ? size : "size-[150px]",
              "mx-auto rounded-full object-cover object-center"
            )}
          />
        ) : (
          <img
            src={initialImage || defaultImage}
            className={cn(
              size ? size : "size-[150px]",
              "mx-auto rounded-full object-cover object-center"
            )}
          />
        )}
        <span
          ref={imgErrorRef}
          className="absolute hidden p-1 text-xs font-semibold text-red-500 bg-black top-[-10px]"
        >
          Max file size is 2 MB
        </span>
        {file.uploadStatus === "uploading" && <Loading />}
        {initialImage || hasImageChanged ? (
          <div
            className={cn(
              "absolute",
              position ? position : "bottom-4 right-12"
            )}
          >
            <img
              src={editImage}
              onClick={() => setShowDropDown(!showDropDown)}
              className={cn(
                btnSize ? btnSize : "size-10",
                "p-2 bg-slate-800 rounded-full hover:cursor-pointer"
              )}
            />
            {showDropDown && (
              <ImageHandlerDropUpMenu
                image={initialImage}
                imgInputRef={imgInputRef}
                handleSaveImage={handleSaveImage}
                handleDeleteImage={handleDeleteImage}
                handleCancelImage={handleCancelImage}
              />
            )}
          </div>
        ) : (
          <img
            src={addImage}
            onClick={() => imgInputRef.current.click()}
            className={cn(
              btnSize ? btnSize : "size-10",
              position ? position : "bottom-4 right-12",
              "absolute p-1 bg-slate-800 rounded-3xl hover:cursor-pointer"
            )}
          />
        )}
        <input
          type="file"
          accept="image/*"
          ref={imgInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </>
  );
}
