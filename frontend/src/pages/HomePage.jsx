import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import rocket from "../assets/images/rocket.png";
import { getLocalSecureItem } from "@/lib/utils";
import PublicNavbar from "@/components/navbars/PublicNavbar";

export default function HomePage() {
  const navigate = useNavigate();
  const [render, setRender] = useState(false);

  useEffect(() => {
    const user = getLocalSecureItem("user", "low");
    if (user?.status === "LOGGED_IN") {
      navigate(`/user/${user?.id}/projects`, { replace: true });
    } else setRender(true);
  }, [navigate]);

  return (
    render && (
      <>
        <PublicNavbar />
        <section className="pt-20 grid h-full grid-cols-1 gap-x-14 my-10 md:my-auto lg:grid-cols-[2fr,1fr] px-7 md:px-28">
          <div className="flex flex-col">
            <div className="inline-block px-3 py-1 mt-10 bg-blue-100 rounded-xl w-fit">
              Welcome to Team Sync
            </div>
            <div className="mt-10 text-[3vw] font-medium">
              Boost Productivity Through <br />
              <span className="underline decoration-yellow-400 underline-offset-4">
                Effortless
              </span>
              &nbsp;Team Management
            </div>
            <div className="flex justify-start mt-10 gap-7">
              <button className="px-4 py-2 text-white rounded-lg bg-slate-900">
                Get Started Today
              </button>
              <button className="px-4 py-2 rounded-lg bg-slate-300">
                See Our Features
              </button>
            </div>
            <div className="flex flex-col justify-start gap-10 mt-10 md:flex-row ">
              <div className="inline-flex flex-col justify-around p-5 min-w-52 rounded-xl bg-slate-300">
                <div className="inline-flex justify-between">
                  <div>[ Rating ]</div>
                  <div className="inline-flex">
                    <div className="text-3xl">4.8</div>
                    <div className="text-2xl text-yellow-500 relative top-[-0.5em]">
                      &#9733;
                    </div>
                  </div>
                </div>
                <hr className="my-3" />
                <div>The perfect team management and collaboration.</div>
              </div>
              <div className="flex items-center justify-center p-5 text-white sm:max-w-full max-w-[32rem] rounded-xl bg-slate-900">
                Revolutionize The Way Your Teams Work Together With Our
                Intuitive Platform. Streamline your teams workflow and
                communication with an intuitive and feature-rich platform that
                revolutionizes the way your teams collaborate.
              </div>
            </div>
          </div>
          <img
            src={rocket}
            alt="rocket"
            className="hidden object-contain object-center pt-8 lg:block"
          />
        </section>
      </>
    )
  );
}
