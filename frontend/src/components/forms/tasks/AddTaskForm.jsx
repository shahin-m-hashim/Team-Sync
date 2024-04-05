/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import closeIcon from "@/assets/images/Close.png";
import ajmalDp from "../../../assets/images/ajmalDp.png";
import { useEffect, useRef, useState } from "react";
import attachIcon from "@/assets/images/Attach.png";
import successIcon from "@/assets/images/Success.png";
import user1 from "../../../assets/images/activities/user1.png";
import user2 from "../../../assets/images/activities/user2.png";
import user3 from "../../../assets/images/activities/user3.png";
import user4 from "../../../assets/images/activities/user4.png";

const members = [
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
  {
    username: "ajmal236",
    dp: ajmalDp,
  },
  {
    username: "shahin128",
    dp: user1,
  },
  {
    username: "hari5436",
    dp: user2,
  },
  {
    username: "asma098",
    dp: user3,
  },
  {
    username: "thomson12",
    dp: user4,
  },
];

const initialDoc = {
  name: "",
  role: "Leader",
  created: new Date(),
  assignee: "",
  attachment: null,
  priority: "",
  deadline: "",
  status: "Not Started",
  submittedFile: null,
};

const SelectPriority = ({ doc, setDoc, requiredRef }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      onClick={() => {
        requiredRef.current.innerText = "";
        setShowOptions(!showOptions);
      }}
      className="bg-[#5030E5] relative mt-3 px-3 py-2 rounded-lg w-full hover:cursor-pointer text-start text-[#BDBDBD]"
    >
      <div className="flex items-center justify-between">
        <span>{doc.priority || "Set Priority"}</span>
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
              setDoc({ ...doc, priority: "Low" });
              setShowOptions(false);
            }}
            className="px-3 border-2 border-r-0 border-secondary bg-[#069843]"
          >
            Low
          </button>
          <button
            onClick={() => {
              setDoc({ ...doc, priority: "Medium" });
              setShowOptions(false);
            }}
            className="px-3 border-2 border-secondary bg-[#e8be34]"
          >
            Medium
          </button>
          <button
            onClick={() => {
              setDoc({ ...doc, priority: "High" });
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

const SearchAssignee = ({ doc, setDoc, setShowMembers }) => {
  const [searchTxt, setSearchTxt] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    const filtered = members.filter((member) =>
      member.username.toLowerCase().includes(searchTxt.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTxt]);

  return (
    <div className="absolute top-0 left-[-200px] z-10 h-full p-2 bg-slate-700">
      <input
        type="text"
        onChange={(e) => setSearchTxt(e.target.value)}
        className="w-full px-2 py-2 my-4 bg-blue-500 border-2 rounded-lg border-block placeholder:text-black"
        placeholder="Search assignee"
      />
      <div className="h-[86%] overflow-auto">
        {filteredMembers.length !== 0 ? (
          filteredMembers.map((member, index) => (
            <button
              key={index}
              onClick={() => {
                setDoc({ ...doc, assignee: member.username });
                setShowMembers(false);
              }}
              className="flex justify-between items-center w-full bg-slate-600 border-black border-[1px] p-2"
            >
              <div>{member.username}</div>
              <img className="size-8" src={member.dp} alt="memberDp" />
            </button>
          ))
        ) : (
          <div className="w-full p-2 text-center bg-slate-600">
            No member found
          </div>
        )}
      </div>
    </div>
  );
};

export default function AddTaskForm({ setShowAddTaskForm }) {
  const requiredRef = useRef();
  const [doc, setDoc] = useState(initialDoc);
  const [showMembers, setShowMembers] = useState(false);

  const validateAndUpload = () => {
    if (
      !doc.name ||
      !doc.assignee ||
      !doc.attachment ||
      !doc.priority ||
      !doc.deadline
    ) {
      requiredRef.current.innerText = "All fields are required";
      return;
    } else if (doc.name.length > 20) {
      requiredRef.current.innerText = "Name should be less than 20 characters";
      return;
    }

    console.log(doc);
    setDoc(initialDoc);
    setShowAddTaskForm(false);
  };

  return (
    <div className="absolute inset-0 z-50 size-full backdrop-blur-sm">
      <div
        className={cn(
          showMembers ? "-translate-x-1/3" : "-translate-x-1/2",
          "relative w-[470px] top-1/2 left-1/2 transform -translate-y-1/2 flex items-center gap-y-4 flex-col h-fit bg-[#313338] text-white px-5 py-2"
        )}
      >
        <div className="grid grid-cols-[1fr,25px] w-full">
          <span className="ml-2 text-xl text-center">Customize Your Task</span>
          <button onClick={() => setShowAddTaskForm(false)}>
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <div className="text-[#828282] text-center text-sm">
          Your can assign new tasks to team members, and collaborate seamlessly
          to achieve your project goals.
        </div>
        <div className="bg-[#4D4D4D] h-fit w-full">
          <div className="flex flex-col p-3">
            <span>Task Attachment</span>
            <div className="flex justify-center">
              <label className="rounded-[50%] size-[80px] bg-[rgba(6,6,6,30%)] flex items-center flex-col justify-center gap-2 cursor-pointer">
                <input
                  type="file"
                  accept="*"
                  className="hidden"
                  onClick={() => (requiredRef.current.innerText = "")}
                  onChange={(e) => {
                    setDoc({ ...doc, attachment: e.target.files[0] });
                    e.target.value = null;
                  }}
                />
                <img
                  src={doc.attachment ? successIcon : attachIcon}
                  className={doc.attachment ? "pl-1 w-[70%]" : "w-[30%]"}
                  alt="Attach"
                />
                {!doc.attachment && <span className="text-xs">ATTACH</span>}
              </label>
            </div>
            {doc.attachment && (
              <span className="mt-1 text-xs">
                Wrong attachment file&nbsp;?&nbsp;
                <button
                  className="font-semibold text-red-500"
                  onClick={() => setDoc({ ...doc, attachment: null })}
                >
                  REUPLOAD
                </button>
              </span>
            )}
          </div>
          <hr />
          <div className="flex gap-2">
            <div className="flex flex-col gap-4">
              <div className="p-3">
                <span>Task Name</span>
                <input
                  type="text"
                  value={doc.name}
                  placeholder={`Enter Name`}
                  onClick={() => (requiredRef.current.innerText = "")}
                  onChange={(e) => setDoc({ ...doc, name: e.target.value })}
                  className="bg-[#5030E5] mt-3 px-3 py-2 rounded-lg w-full placeholder:text-[#BDBDBD]"
                />
              </div>
              <div className="p-3">
                <span>Task Assignee</span>
                <button
                  disabled={doc.assignee && true}
                  onClick={() => {
                    requiredRef.current.innerText = "";
                    setShowMembers(!showMembers);
                  }}
                  className="bg-[#5030E5] flex gap-2 items-center mt-3 px-3 py-2 rounded-lg w-full text-left text-[#BDBDBD]"
                >
                  {!doc.assignee ? (
                    <>
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
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      <span>Choose Assignee</span>
                    </>
                  ) : (
                    <span>{doc.assignee}</span>
                  )}
                </button>
                {showMembers && (
                  <SearchAssignee
                    setShowMembers={setShowMembers}
                    doc={doc}
                    setDoc={setDoc}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-3">
                <label htmlFor="select">Task Priority</label>
                <SelectPriority
                  doc={doc}
                  setDoc={setDoc}
                  requiredRef={requiredRef}
                />
              </div>
              <div className="p-3">
                <span>Task Deadline Date</span>
                <input
                  type="date"
                  value={
                    doc.deadline ? doc.deadline.toISOString().split("T")[0] : ""
                  }
                  placeholder={`Enter Name`}
                  onClick={() => (requiredRef.current.innerText = "")}
                  onChange={(e) =>
                    setDoc({ ...doc, deadline: new Date(e.target.value) })
                  }
                  className="bg-[#5030E5] mt-3 px-3 py-2 rounded-lg w-full placeholder:text-[#BDBDBD]"
                />
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => validateAndUpload()}
          className="rounded-lg font-bold w-full px-3 py-2 bg-[#3085e5] text-black"
        >
          Create Your Task
        </button>
        <button
          onClick={() => {
            requiredRef.current.innerText = "";
            setDoc(initialDoc);
          }}
          className="rounded-lg font-bold w-full px-3 py-2 bg-[#2eb242] text-black"
        >
          Reset Form
        </button>
        <span ref={requiredRef} className="text-red-500" />
      </div>
    </div>
  );
}
