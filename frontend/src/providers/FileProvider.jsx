/* eslint-disable react/prop-types */
import {
  ref,
  getStorage,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import app from "@/lib/firebase";
import { useState, createContext } from "react";

const storage = getStorage(app);
export const FileContext = createContext();

const initialFile = {
  uploadProgress: 0,
  uploadedFileURL: "",
  uploadStatus: "idle",
};

const FileProvider = ({ children }) => {
  const [file, setFile] = useState(initialFile);

  const uploadFile = async (type, newFile, path, updateSecondaryDatabase) => {
    if (!newFile) return;
    try {
      const fileRef = ref(storage, path);
      setFile((prevFile) => ({
        ...prevFile,
        uploadStatus: "uploading",
      }));

      const uploadTask = uploadBytesResumable(fileRef, newFile);

      uploadTask.on("state_changed", (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setFile((prevFile) => ({
          ...prevFile,
          uploadProgress: progress,
        }));
      });

      await uploadTask;
      const uploadedFileURL = await getDownloadURL(fileRef);
      type !== "direct" && (await updateSecondaryDatabase(uploadedFileURL));

      setFile({
        uploadedFileURL,
        uploadProgress: 100,
        uploadStatus: "completed",
      });
    } catch (error) {
      setFile((prevFile) => ({
        ...prevFile,
        uploadStatus: "failed",
      }));
      throw error;
    }
    return;
  };

  const deleteFile = async (path) => {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    return;
  };

  return (
    <FileContext.Provider
      value={{
        file,
        setFile,
        uploadFile,
        deleteFile,
        initialFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export default FileProvider;
