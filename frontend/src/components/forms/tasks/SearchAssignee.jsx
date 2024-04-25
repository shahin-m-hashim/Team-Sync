/* eslint-disable react/prop-types */

import useFetch from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultDp from "@/assets/images/defaultDp.png";

const SearchAssignee = ({ task, setTask, setShowMembers }) => {
  const { projectId, teamId } = useParams();
  const [searchTxt, setSearchTxt] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);

  const teamMembers = useFetch(`projects/${projectId}/teams/${teamId}/members`);

  useEffect(() => {
    const filtered = teamMembers?.data?.filter((member) =>
      member.username.toLowerCase().includes(searchTxt.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTxt, teamMembers?.data]);

  return !teamMembers?.isLoading ? (
    <div className="absolute top-0 left-[-200px] z-10 h-full p-2 bg-slate-700">
      <input
        type="text"
        onChange={(e) => setSearchTxt(e.target.value)}
        className="w-full px-2 py-2 my-4 bg-blue-500 border-2 rounded-lg border-block placeholder:text-black"
        placeholder="Search assignee"
      />
      <div className="h-[86%] overflow-auto">
        {filteredMembers?.length > 0 ? (
          filteredMembers?.map((member) => (
            <button
              key={member._id}
              onClick={() => {
                setTask({ ...task, assignee: member.username });
                setShowMembers(false);
              }}
              className="flex justify-between items-center w-full bg-slate-600 border-black border-[1px] p-2"
            >
              <div>{member.username}</div>
              <img
                className="object-cover object-center rounded-full size-8"
                src={member.profilePic || defaultDp}
              />
            </button>
          ))
        ) : (
          <div className="w-full p-2 text-center bg-slate-600">
            No member found
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="absolute top-0 left-[-200px] z-10 w-[39%] h-full p-2 bg-slate-700">
      <Loading />
    </div>
  );
};

export default SearchAssignee;
