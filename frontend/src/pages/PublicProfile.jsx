import NavbarComponent from "@/components/navbars/PublicNavbar";

export default function PublicProfile() {
  return (
    <div className="h-full px-64 pt-32 pb-20">
      <NavbarComponent />
      <div className="flex flex-col h-full">
        <div className="relative bg-blue-400 top-0 px-[15vw] rounded-t-lg h-60 w-full">
          <img className="rounded-[50%] absolute top-20 left-10 size-[150px] border-4 border-red-500 object-cover object-center" />
        </div>
        <div className="h-full px-10 pt-24 border-2 border-gray-200">
          <div className="grid grid-cols-2">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">Shahin M Hashim</span>
              <span className="text-base">shahin123</span>
              <span className="text-base">Full Stack Developer</span>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
