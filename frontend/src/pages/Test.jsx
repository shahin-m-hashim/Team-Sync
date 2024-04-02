import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Test() {
  const notify = () => toast.success("Wow so easy!");
  return (
    <>
      <button onClick={notify}>Notify</button>
    </>
  );
}
