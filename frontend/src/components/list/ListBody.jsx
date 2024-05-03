/* eslint-disable react/prop-types */

import { useContext } from "react";
import { toast } from "react-toastify";
import EmptyListBody from "./EmptyListBody";
import noImg from "../../assets/images/noImg.svg";
import SubmitTask from "../forms/tasks/SubmitTask";
import attach from "../../assets/images/Attach.png";
import { cn, getLocalSecureItem } from "@/lib/utils";
import { FileContext } from "@/providers/FileProvider";
import settings from "../../assets/images/Settings.png";
import deleteIcon from "../../assets/images/Delete.png";
import download from "../../assets/images/Download.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "@/helpers/stringHandler";
import viewSubmitted from "../../assets/images/viewSubmitted.png";

function ListItem({
  id,
  name,
  icon,
  role,
  team,
  status,
  parent,
  project,
  assignee,
  priority,
  progress,
  deadline,
  createdAt,
  renderList,
  teamLeader,
  grandParent,
  attachmentURL,
  attachmentPath,
  submittedTask,
  setDeleteLink,
  showDeleteConfirmation,
}) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { downloadFile, deleteFile } = useContext(FileContext);
  const { username } = getLocalSecureItem("user", "low");

  if (teamLeader === userId) role = "Leader";

  const handleDownload = (url, name) => {
    try {
      if (!url) {
        name === "attachment"
          ? toast.error("No attachment found")
          : toast.error("Task not submitted yet");
        return;
      }
      downloadFile(url, name);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = () => {
    const deleteLink =
      renderList === "Project"
        ? `projects/${id}`
        : renderList === "Team"
          ? `projects/${parent}/teams/${id}`
          : `projects/${grandParent}/teams/${parent}/tasks/${id}`;

    if (renderList === "Task") {
      deleteFile(attachmentPath);
      deleteFile(`tasks/${id}`);
    }

    setDeleteLink(deleteLink);
    showDeleteConfirmation(true);
  };

  return (
    <div
      id={id}
      className={cn(
        renderList !== "Task"
          ? "grid-cols-[185px,120px,80px,300px,150px,140px,80px,80px] cursor-pointer"
          : "grid-cols-[160px,120px,155px,115px,120px,120px,120px,70px,70px,70px]",
        "relative grid items-center gap-3  border-gray-700 border-b-[1px] w-full py-3 px-7 text-sm"
      )}
    >
      <div
        onClick={() => {
          if (renderList === "Project") {
            navigate(`projects/${id}?role=${role}`);
          } else if (renderList === "Team") {
            navigate(`teams/${id}?role=${role}`);
          }
        }}
        className={cn(
          renderList === "Task" && "hidden",
          "absolute top-0 bottom-0 left-0 bg-transparent right-60"
        )}
      />
      <span>{name}</span>
      <span>{createdAt}</span>
      {renderList !== "Task" ? (
        <div className="flex items-center pl-1">
          {icon ? (
            <img
              src={icon}
              width={25}
              className="object-cover object-center rounded-full"
            />
          ) : (
            <img
              src={noImg}
              className="object-cover object-center bg-white rounded-full size-6"
            />
          )}
        </div>
      ) : (
        <span className="pl-2">{assignee}</span>
      )}
      {renderList !== "Task" ? (
        <div className="flex items-center">
          <div className="inline-flex text-xs font-semibold items-center justify-center bg-[#5030E5] size-9 rounded-[50%]">
            {progress}%
          </div>
          <div className="h-2 w-[250px] rounded-l-none rounded-xl bg-white">
            <div
              className="h-2 rounded-l-none rounded-xl bg-[#61E125]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <>
          {teamLeader === userId ? (
            <button
              onClick={() => handleDownload(attachmentURL, "attachment")}
              className="pl-7"
            >
              <img src={attach} width={20} />
            </button>
          ) : (
            <button className="pl-6">
              <img
                src={download}
                onClick={() => handleDownload(attachmentURL, "attachment")}
                width={30}
              />
            </button>
          )}
        </>
      )}
      {renderList !== "Task" ? (
        <div className="pl-8">
          <div
            className={cn(
              {
                "bg-[#069843]": status === "Done",
                "bg-[#A87BFF]": status === "Pending",
                "bg-[#B10F0F]": status === "Stopped",
                "bg-[#e8be34]": status === "Not Started",
              },
              "text-xs inline-flex items-center justify-center text-black h-[25px] w-[80px] font-semibold rounded-xl"
            )}
          >
            <span>{capitalizeFirstLetter(status)}</span>
          </div>
        </div>
      ) : (
        <div>
          <div
            className={cn(
              {
                "bg-[#069843]": priority === "Low",
                "bg-[#B10F0F]": priority === "High",
                "bg-[#e8be34]": priority === "Medium",
              },
              "text-xs inline-flex items-center justify-center text-black h-[25px] w-[80px] font-semibold rounded-xl"
            )}
          >
            <span>{priority}</span>
          </div>
        </div>
      )}
      {renderList !== "Task" ? (
        <span className="pl-2">{role}</span>
      ) : (
        <span>{deadline}</span>
      )}

      {renderList === "Task" && (
        <>
          <div className={cn(renderList !== "Task" ? "pl-5" : "pl-0")}>
            <div
              className={cn(
                {
                  "bg-[#069843]": status === "Done",
                  "bg-[#A87BFF]": status === "Pending",
                  "bg-[#B10F0F]": status === "Stopped",
                  "bg-[#e8be34]": status === "Not Started",
                },
                "text-xs inline-flex items-center justify-center text-black h-[25px] w-[80px] font-semibold rounded-xl"
              )}
            >
              <span>{status}</span>
            </div>
          </div>
          {assignee === username ? (
            <SubmitTask
              team={team}
              taskId={id}
              taskName={name}
              project={project}
              submittedTask={submittedTask}
            />
          ) : (
            <button
              className="pl-3"
              onClick={() => handleDownload(submittedTask, "taskSubmission")}
            >
              <img src={viewSubmitted} width={30} />
            </button>
          )}
        </>
      )}
      {role === "Leader" ? (
        <Link
          to={
            renderList === "Project"
              ? `/user/${userId}/projects/${id}/settings/nav/1`
              : renderList === "Team"
                ? `/user/${userId}/projects/${parent}/teams/${id}/settings/nav/1`
                : `/user/${userId}/projects/${grandParent}/teams/${parent}/tasks/${id}/settings/nav/1`
          }
          className={cn(renderList !== "Task" ? "pl-8" : "pl-5")}
        >
          <img src={settings} width={25} />
        </Link>
      ) : (
        <img
          src={settings}
          className={cn(
            renderList !== "Task" ? "pl-8" : "pl-5",
            role === "Leader" ? "cursor-pointer" : "cursor-not-allowed"
          )}
        />
      )}
      <button
        disabled={role !== "Leader"}
        onClick={() => handleDelete()}
        className={cn(
          renderList !== "Task" ? "pl-10" : "pl-8",
          role === "Leader" ? "cursor-pointer" : "cursor-not-allowed"
        )}
      >
        <img src={deleteIcon} width={25} />
      </button>
    </div>
  );
}

export default function ListBody({
  list,
  renderList,
  setDeleteLink,
  listNameSearchTxt,
  showDeleteConfirmation,
}) {
  return list.length > 0 ? (
    list.map((item) => (
      <ListItem
        {...item}
        key={item.id}
        renderList={renderList}
        setDeleteLink={setDeleteLink}
        showDeleteConfirmation={showDeleteConfirmation}
      />
    ))
  ) : (
    <EmptyListBody
      renderList={renderList}
      listNameSearchTxt={listNameSearchTxt}
    />
  );
}
