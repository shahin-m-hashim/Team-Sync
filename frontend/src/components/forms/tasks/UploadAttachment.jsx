/* eslint-disable react/prop-types */

import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { FileContext } from "@/providers/FileProvider";

export default function UploadAttachment({ task, setTask, attachmentRef }) {
  const firebaseId = uuidv4();
  const { userId, projectId, teamId } = useParams();
  const { file, uploadFile } = useContext(FileContext);

  const handleChange = async (e) => {
    const attachment = e.target.files[0];

    if (attachment.size > 3 * 1024 * 1024) {
      attachmentRef.current.innerText = "Max attachment size is 3 MB";
      return;
    }

    await uploadFile(
      "direct",
      attachment,
      `users/${userId}/projects/${projectId}/teams/${teamId}/tasks/${firebaseId}/attachment`
    );

    setTask({
      ...task,
      attachment: file.uploadedFileURL,
    });
    e.target.value = null;
  };

  return (
    <input
      accept="*"
      type="file"
      className="hidden"
      onChange={handleChange}
      onClick={() => (attachmentRef.current.innerText = "")}
    />
  );
}
