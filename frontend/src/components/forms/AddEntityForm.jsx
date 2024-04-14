/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import closeIcon from "@/assets/images/Close.png";

export default function AddEntityForm({
  error,
  renderList,
  description,
  handleSubmit,
  setShowAddForm,
}) {
  const lengthErrorRef = useRef();
  const requiredErrorRef = useRef();
  const [doc, setDoc] = useState({
    name: "",
    description: "",
  });

  const validateAndSubmit = () => {
    if (!doc.name) {
      requiredErrorRef.current.style.display = "block";
      return;
    } else if (doc.name.length > 25) {
      lengthErrorRef.current.style.display = "block";
      return;
    }
    handleSubmit(doc);
  };

  return (
    <div className="absolute inset-0 z-50 size-full backdrop-blur-sm">
      <div className="relative w-[400px] top-1/2 left-1/2 transform -translate-x-1/2 p-5 -translate-y-1/2 flex items-center gap-y-4 flex-col h-fit bg-[#313338] text-white ">
        <div className="grid grid-cols-[1fr,25px] w-full">
          <span className="ml-2 text-xl text-center">
            Create Your {renderList}
          </span>
          <button onClick={() => setShowAddForm(false)}>
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <div className="text-[#828282] text-center text-sm">{description}</div>
        <div className="bg-[#4D4D4D] w-full">
          <div className="p-3">
            <span>{renderList} Name</span>
            <input
              type="text"
              value={doc.name}
              placeholder={`Enter your ${renderList} name`}
              onClick={() => {
                lengthErrorRef.current.style.display = "none";
                requiredErrorRef.current.style.display = "none";
              }}
              onChange={(e) => setDoc({ ...doc, name: e.target.value })}
              className="bg-[#5030E5] mt-3 px-3 py-2 rounded-lg w-full placeholder:text-[#BDBDBD]"
            />
          </div>
          <hr />
          <div className="p-3">
            <span>{renderList} Description (optional)</span>
            <textarea
              value={doc.description}
              rows={5}
              placeholder={`Enter your ${renderList} description`}
              onChange={(e) => setDoc({ ...doc, description: e.target.value })}
              className="bg-[#5030E5] mt-3 px-3 py-2 rounded-lg w-full placeholder:text-[#BDBDBD]"
            />
          </div>
        </div>
        <div ref={requiredErrorRef} className="hidden text-red-500">
          Name is required
        </div>
        <div ref={lengthErrorRef} className="hidden text-red-500">
          Name should be less than 25 characters
        </div>
        <div className="text-green-500 mt-[-5px]">
          You can add in members later
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          onClick={() => validateAndSubmit()}
          className="rounded-lg  font-bold w-full px-3 py-2 bg-[#3085e5] text-black"
        >
          Create Your {renderList}
        </button>
      </div>
    </div>
  );
}
