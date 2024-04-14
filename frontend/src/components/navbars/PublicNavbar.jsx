import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between py-3 min-h-10 px-7 md:px-28 bg-slate-300">
      <span className="text-lg font-bold">TeamSync</span>
      <div className="inline-flex items-center gap-5 ">
        <Link to="/login" className="block font-medium ">
          Login
        </Link>
        <Link to="/signup" className="block font-medium ">
          Signup
        </Link>
      </div>
    </nav>
  );
}
