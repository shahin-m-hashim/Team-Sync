export default function FilterDropDownMenu() {
  return (
    <div className="absolute text-center top-9 right-[-10px] flex flex-col justify-evenly p-2 py-0 rounded-xl min-w-[200px] h-[150px] bg-[#4D4D4D]">
      <div className="flex justify-between">
        <div className="bg-[#171A30] p-1 min-w-20">
          <button>Name</button>
        </div>
        <div className="p-1 text-black flex justify-between bg-[#D9D9D9] min-w-24">
          <button className="bg-[#61E125] min-w-10 text-xs rounded-2xl">
            Asc
          </button>
          <button className="bg-[#F7C217] min-w-10 text-xs rounded-2xl">
            Desc
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="bg-[#171A30] p-1 min-w-20">
          <button>Created</button>
        </div>
        <div className="p-1 text-black flex justify-between bg-[#D9D9D9] min-w-24">
          <button className="bg-[#61E125] min-w-10 text-xs rounded-2xl">
            Asc
          </button>
          <button className="bg-[#F7C217] min-w-10 text-xs rounded-2xl">
            Desc
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="bg-[#171A30] p-1 min-w-20">
          <button>Progress</button>
        </div>
        <div className="p-1 text-black flex justify-between bg-[#D9D9D9] min-w-24">
          <button className="bg-[#61E125] min-w-10 text-xs rounded-2xl">
            Asc
          </button>
          <button className="bg-[#F7C217] min-w-10 text-xs rounded-2xl">
            Desc
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="bg-[#171A30] p-1 min-w-20">
          <button>Status</button>
        </div>
        <div className="p-1 text-black flex justify-between bg-[#D9D9D9] min-w-24">
          <button className="bg-[#61E125] min-w-10 text-xs rounded-2xl">
            Asc
          </button>
          <button className="bg-[#F7C217] min-w-10 text-xs rounded-2xl">
            Desc
          </button>
        </div>
      </div>
    </div>
  );
}
