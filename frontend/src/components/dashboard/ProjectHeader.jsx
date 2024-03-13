export default function ProjectHeader() {
  return (
    <div>
      <div
        id="projectHeader"
        className="grid grid-cols-[1fr,.5fr,.5fr,1.5fr,.7fr,.7fr,.5fr,.5fr] bg-[#1C1C1C] w-full py-3 px-7 text-sm"
      >
        <span>Name</span>
        <span className="pl-3">Created</span>
        <span className="pl-8">Icon</span>
        <span className="pl-5">Progress</span>
        <span className="pl-20">Status</span>
        <span className="pl-16">Role</span>
        <span className="pl-10">Settings</span>
        <span className="pl-10">Delete</span>
      </div>
    </div>
  );
}
