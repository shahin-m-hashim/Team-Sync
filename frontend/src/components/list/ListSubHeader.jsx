/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";

export default function ListSubHeader({ renderList }) {
  return (
    <>
      <div
        id="projectHeader"
        className={cn(
          renderList !== "Task"
            ? "grid-cols-[185px,120px,80px,300px,150px,140px,80px,80px]"
            : "grid-cols-[160px,120px,155px,115px,120px,120px,120px,70px,70px,70px]",
          "grid bg-[#1C1C1C] gap-3 w-full py-3 px-7 text-sm"
        )}
      >
        <span>Name</span>
        <span className={cn(renderList !== "Task" && "pl-2")}>Created</span>
        {renderList !== "Task" ? (
          <span>Icon</span>
        ) : (
          <span className="pl-2">Assignee</span>
        )}
        {renderList !== "Task" ? (
          <span>Progress</span>
        ) : (
          <span>Attachments</span>
        )}
        {renderList !== "Task" ? (
          <span className="pl-12">Status</span>
        ) : (
          <span className="pl-4">Priority</span>
        )}
        {renderList !== "Task" ? (
          <span className="pl-2">Role</span>
        ) : (
          <span className="pl-2">Deadline</span>
        )}
        {renderList === "Task" && (
          <>
            <span className="pl-5">Status</span>
            <span className="pl-1">Submit</span>
          </>
        )}
        <span className={cn(renderList !== "Task" ? "pl-4" : "pl-2")}>
          Settings
        </span>
        <span className={cn(renderList !== "Task" ? "pl-8" : "pl-6")}>
          Delete
        </span>
      </div>
    </>
  );
}
