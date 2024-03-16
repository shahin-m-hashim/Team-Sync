/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";

export default function ListSubHeader({ displayList }) {
  return (
    <>
      <div
        id="projectHeader"
        className={cn(
          displayList !== "Task"
            ? "grid-cols-[1.5fr,150px,100px,2.5fr,150px,150px,80px,80px]"
            : "grid-cols-10",
          "grid bg-[#1C1C1C] w-full py-3 px-7 text-sm"
        )}
      >
        <span>Name</span>
        <span className={cn(displayList === "Task" && "pl-3")}>Created</span>
        {displayList !== "Task" ? <span>Icon</span> : <span>Assignee</span>}
        {displayList !== "Task" ? (
          <span>Progress</span>
        ) : (
          <span>Attachments</span>
        )}
        {displayList !== "Task" ? (
          <span className="pl-10">Status</span>
        ) : (
          <span className="pl-4">Priority</span>
        )}
        {displayList !== "Task" ? (
          <span>Role</span>
        ) : (
          <span className="pl-2">Deadline</span>
        )}
        {displayList === "Task" && (
          <>
            <span className="pl-5">Status</span>
            <span>Submit</span>
          </>
        )}
        <span className={cn(displayList !== "Task" ? "pl-4" : "pl-0")}>
          Settings
        </span>
        <span className={cn(displayList !== "Task" ? "pl-8" : "pl-0")}>
          Delete
        </span>
      </div>
    </>
  );
}
