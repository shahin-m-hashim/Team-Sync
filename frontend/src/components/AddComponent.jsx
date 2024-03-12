/* eslint-disable react/prop-types */
import uploadIcon from "@/assets/images/uploadIcon.png";
import closeIcon from "@/assets/images/Close.png";

export default function AddComponent({ name, setShowAddPopUp }) {
  const handleFileUpload = (file) => {
    console.log(file);
  };

  return (
    <div className="fixed z-50 size-full backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 flex-col w-[400px] h-[400px] bg-[#313338] text-white py-3 px-5">
        <div className="grid grid-cols-[1fr,25px] w-full">
          <span className="flex justify-center ml-2 text-xl">
            Customize Your {name}
          </span>
          <button onClick={() => setShowAddPopUp(false)}>
            <img src={closeIcon} />
          </button>
        </div>
        <div className="text-[#828282] text-center text-sm">
          {name === "Project" &&
            "Your project is where you can create your teams, add members and work with them effortlessly."}
          {name === "Team" &&
            "Your Team is where you can organize your sub teams, add members and work with them effortlessly."}
          {name === "SubTeam" &&
            "Your Team is where you can create your tasks, add members, assign tasks and work with them effortlessly."}
        </div>
        <div className="bg-[#4D4D4D] size-[380px] mt-3">
          <div className="flex gap-12 p-3">
            <span>Project Icon</span>
            <label className="mt-3 rounded-[50%] size-[80px]  bg-[rgba(6,6,6,30%)] flex items-center flex-col justify-center gap-2 cursor-pointer">
              <input
                type="file"
                id="uploadInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <img src={uploadIcon} width={30} />
              <span className="text-xs">UPLOAD</span>
            </label>
          </div>
          <hr />
          <div className="p-3">
            <span>Project Name</span>
            <input
              className="bg-[#5030E5] mt-3 px-3 py-2 rounded-lg w-full placeholder:text-[#BDBDBD]"
              type="text"
              placeholder="Enter Your Project Name"
            />
          </div>
        </div>
        <button className="rounded-lg font-bold w-full px-3 py-2 bg-[#3085e5] text-black">
          Create Your Project
        </button>
      </div>
    </div>
  );
}
