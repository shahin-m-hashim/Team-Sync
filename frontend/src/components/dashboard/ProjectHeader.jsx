export default function ProjectHeader() {
  return (
    <div>
      <div
        id="projectHeader"
        className="grid grid-cols-[1.5fr,150px,100px,2.5fr,150px,150px,80px,80px] bg-[#1C1C1C] w-full py-3 px-7 text-sm"
      >
        <span>Name</span>
        <span>Created</span>
        <span>Icon</span>
        <span>Progress</span>
        <span className="pl-10">Status</span>
        <span>Role</span>
        <span className="pl-4">Settings</span>
        <span className="pl-8">Delete</span>
      </div>
    </div>
  );
}
