import { useRef, useState } from "react";
import defaultDp from "../assets/images/defaultDp.png";
import addDp from "../assets/images/addDp.png";

export default function Test() {
  const [dp, setDp] = useState("");

  const handleDpChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDp(URL.createObjectURL(file));
  };

  const dpInputRef = useRef(null);

  return (
    <div className="relative w-screen h-screen bg-slate-500">
      <div className="max-w-3xl py-10 mx-auto ">
        <img
          src={dp || defaultDp}
          className="mx-auto rounded-[50%] size-[150px] object-cover object-center"
          alt="profile-picture"
        />
        <input
          type="file"
          accept="image/*"
          ref={dpInputRef}
          className="hidden"
          onChange={handleDpChange}
        />
        <button onClick={() => dpInputRef.current.click()}>
          <img
            src={addDp}
            alt="addDp"
            className="absolute p-2 ml-1 bg-slate-800 bottom-10 right-8 rounded-3xl size-10"
          />
        </button>
        <button
          className="p-2 bg-red-500"
          onClick={() => {
            setDp("");
            dpInputRef.current.value = "";
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
