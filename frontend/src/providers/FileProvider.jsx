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
  path: "",
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
        path,
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
      type !== "direct" &&
        (await updateSecondaryDatabase(uploadedFileURL, path));

      setFile({
        path,
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

  const downloadFile = async (fileURL, fileName) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";

    xhr.onload = () => {
      const blob = xhr.response;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = blob.type.includes("text") ? `${fileName}.txt` : fileName;
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    };

    xhr.open("GET", fileURL);
    xhr.send();
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
        downloadFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export default FileProvider;
