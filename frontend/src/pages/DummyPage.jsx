import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalSecureItem } from "@/lib/utils";

const DummyPage = () => {
  const navigate = useNavigate();
  const user = getLocalSecureItem("user", "low");

  useEffect(() => {
    if (user?.status === "LOGGED_IN")
      navigate(`/user/${user?.id}/dashboard`, { replace: true });
  });

  return <div className="bg-[#141414] h-full m-1">&nbsp;</div>;
};

export default DummyPage;
