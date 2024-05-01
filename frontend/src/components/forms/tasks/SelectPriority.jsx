/* eslint-disable react/prop-types */

import { useState } from "react";

const SelectPriority = ({ task, setTask, taskInputsErrorRef }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      onClick={() => {
        if (taskInputsErrorRef) {
          taskInputsErrorRef.current.innerText = "";
        }
        setShowOptions(!showOptions);
      }}
      className="bg-[#5030E5] relative mt-3 px-3 py-2 rounded-lg w-full hover:cursor-pointer text-start text-[#BDBDBD]"
    >
      <div className="flex items-center justify-between">
        <span>{task.priority || "Set Priority"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {showOptions && (
        <div className="absolute right-0 flex text-black top-12 w-fit justify-evenly">
          <button
            onClick={() => {
              setTask({ ...task, priority: "Low" });
              setShowOptions(false);
            }}
            className="px-3 border-2 border-r-0 border-secondary bg-[#069843]"
          >
            Low
          </button>
          <button
            onClick={() => {
              setTask({ ...task, priority: "Medium" });
              setShowOptions(false);
            }}
            className="px-3 border-2 border-secondary bg-[#e8be34]"
          >
            Medium
          </button>
          <button
            onClick={() => {
              setTask({ ...task, priority: "High" });
              setShowOptions(false);
            }}
            className="px-3 border-2 border-l-0 border-secondary bg-[#B10F0F]"
          >
            High
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectPriority;
