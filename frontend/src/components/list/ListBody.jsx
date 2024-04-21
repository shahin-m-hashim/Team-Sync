/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import EmptyListBody from "./EmptyListBody";
import noImg from "../../assets/images/noImg.svg";
import attach from "../../assets/images/Attach.png";
import settings from "../../assets/images/Settings.png";
import deleteIcon from "../../assets/images/Delete.png";
import submitIcon from "../../assets/images/submitTask.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "@/helpers/stringHandler";

function ListItem({
  id,
  name,
  icon,
  role,
  status,
  parent,
  assignee,
  priority,
  progress,
  createdAt,
  renderList,
  grandParent,
  deadlineDate,
}) {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <div
      id={id}
      className={cn(
        renderList !== "Task"
          ? "grid-cols-[185px,120px,80px,300px,150px,140px,80px,80px]"
          : "grid-cols-[160px,120px,155px,115px,120px,120px,120px,70px,70px,70px]",
        "relative cursor-pointer grid items-center gap-3  border-gray-700 border-b-[1px] w-full py-3 px-7 text-sm"
      )}
    >
      <div
        onClick={() => {
          if (renderList === "Project") {
            navigate(`projects/${id}?role=${role}`);
          } else if (renderList === "Team") {
            navigate(`teams/${id}?role=${role}`);
          } else {
            navigate(`subteams/${id}?role=${role}`);
          }
        }}
        className="absolute top-0 bottom-0 left-0 bg-transparent right-60"
      />
      <span>{name}</span>
      <span>{createdAt}</span>
      {renderList !== "Task" ? (
        <div className="flex items-center pl-1">
          {icon ? (
            <img src={icon} width={25} className="object-cover object-center" />
          ) : (
            <img src={noImg} className="ml-1 bg-white size-5" />
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
        <button className="pl-7">
          <img src={attach} width={20} />
        </button>
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
        <span>{deadlineDate}</span>
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
          <button className="pl-3">
            <img src={submitIcon} width={30} />
          </button>
        </>
      )}
      {role === "Leader" ? (
        <Link
          to={
            renderList === "Project"
              ? `/user/${userId}/projects/${id}/settings`
              : renderList === "Team"
                ? `/user/${userId}/projects/${parent}/teams/${id}/settings`
                : `/user/${userId}/projects/${grandParent}/teams/${parent}/subteams/${id}/settings`
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

export default function ListBody({ list, renderList, listNameSearchTxt }) {
  return list.length > 0 ? (
    list.map((item) => (
      <ListItem {...item} key={item.id} renderList={renderList} />
    ))
  ) : (
    <EmptyListBody name={renderList} listNameSearchTxt={listNameSearchTxt} />
  );
}
