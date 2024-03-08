import progress from "../../assets/images/Progress.png";

export default function StatusCard() {
  return (
    <div
      id="status"
      className="bg-[#141414] m-1 rounded-lg flex p-5 justify-evenly"
    >
      <div className="relative">
        <img src={progress} width="75%" />
        <span className="absolute top-14 left-14 right-14 ">
          Nothing
          <br />
          To Show
        </span>
      </div>
      <div className="flex flex-col gap-5">
        <span className="text-sm font-medium">Overall Status</span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-5">
            <div className="rounded-[50%] bg-[#3CDA7D] size-5"></div>
            <span>Complete</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="rounded-[50%] bg-[#F9BD3B] size-5"></div>
            <span>Not Started</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="rounded-[50%] bg-[#A87BFF] size-5"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="rounded-[50%] bg-[#B10F0F] size-5"></div>
            <span>Stopped</span>
          </div>
        </div>
      </div>
    </div>
  );
}
