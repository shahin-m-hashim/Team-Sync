import { useEffect, useState } from "react";

const BreakPoint = () => {
  const [breakpoint, setBreakpoint] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1536) {
        setBreakpoint("2xl");
      } else if (screenWidth >= 1280) {
        setBreakpoint("xl");
      } else if (screenWidth >= 1024) {
        setBreakpoint("lg");
      } else if (screenWidth >= 768) {
        setBreakpoint("md");
      } else {
        setBreakpoint("sm");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute bottom-0 z-[100] left-0 p-1 text-sm text-white bg-slate-900">
      BP = {breakpoint}
    </div>
  );
};

export default BreakPoint;
