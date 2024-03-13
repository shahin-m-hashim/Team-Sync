/* eslint-disable react/prop-types */

import settings from "../assets/images/Settings.png";
import deleteIcon from "../assets/images/Delete.png";
import { cn } from "@/lib/utils";

export default function ListItem({
  name,
  createdDate,
  icon,
  progress,
  status,
  role,
}) {
  return (
    <div className="grid items-center my-[1px] border-gray-700 border-b-[1px] grid-cols-[1fr,.5fr,.5fr,1.5fr,.7fr,.7fr,.5fr,.5fr] w-full py-3 px-7 text-sm">
      <span>{name}</span>
      <span className="pl-5">{createdDate}</span>
      <div className="pl-14">
        <img src={icon} alt="project icon" />
      </div>
      <div className="flex items-center pl-1
      ">
        <div className="inline-flex text-xs items-center justify-center bg-[#5030E5] size-10 rounded-[50%]">
          {progress}%
        </div>
        <div className="h-2 w-[250px] rounded-l-none rounded-xl bg-white">
          <div
            className="h-2 rounded-l-none rounded-xl bg-[#61E125]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="pl-16">
        <div
          className={cn(
            {
              "bg-[#069843]": status === "Done",
              "bg-[#e8be34]": status === "Not Started",
              "bg-[#A87BFF]": status === "Pending",
              "bg-[#B10F0F]": status === "Stopped",
            },
            "text-xs inline-flex items-center justify-center text-black h-[25px] w-[80px] font-semibold rounded-xl"
          )}
        >
          <span>{status}</span>
        </div>
      </div>
      <span className="pl-14">{role}</span>
      <button className="pl-14">
        <img src={settings} width={20} alt="settings icon" />
      </button>
      <button className="pl-14">
        <img src={deleteIcon} width={20} alt="delete icon" />
      </button>
    </div>
  );
}
