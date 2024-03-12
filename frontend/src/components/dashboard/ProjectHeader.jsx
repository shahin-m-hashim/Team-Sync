export default function ProjectHeader() {
  return (
    <div>
      <div
        id="projectHeader"
        className="grid grid-cols-[.5fr,.5fr,.5fr,1.5fr,.7fr,.5fr,.5fr,.5fr] bg-[#1C1C1C] w-full py-3 px-7 text-sm"
      >
        <span>Name</span>
        <span>Created</span>
        <span>Icon</span>
        <span>Progress</span>
        <span className="pl-3">Status</span>
        <span className="pl-1">Role</span>
        <span>Settings</span>
        <span>Delete</span>
      </div>
    </div>
  );
}
