import { getLocalSecureItem } from "@/lib/utils";

export default function Test() {
  const handleClick = () => {
    const auth = getLocalSecureItem("auth", "low");
    const user = getLocalSecureItem("primary-user", "medium");
    console.log("Auth:", auth, "\nUser:", user);
  };

  return (
    <div>
      <h1>Test Page</h1>

      <button className="p-3 m-3 bg-blue-300" onClick={() => handleClick()}>
        get value
      </button>
    </div>
  );
}
