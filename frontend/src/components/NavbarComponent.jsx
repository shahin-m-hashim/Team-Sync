import { Link } from "react-router-dom";

export default function NavbarComponent() {
  return (
    <nav className="flex items-center justify-between py-5 px-7 md:px-28 bg-slate-300">
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
