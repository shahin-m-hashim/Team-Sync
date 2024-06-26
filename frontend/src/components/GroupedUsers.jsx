/* eslint-disable react/prop-types */
import defaultDp from "../assets/images/defaultDp.png";

const GroupedUsers = ({
  users,
  limit = 5,
  addType = "add",
  userType = "user",
}) => {
  if (users.length < 1)
    return (
      <>
        <div>No {userType}s exist</div>
        <div>Try {addType}ing some now ? </div>
      </>
    );

  const visibleUsers = users?.slice(0, limit);
  const remainingUsersCount = users?.length - limit;

  return (
    <div className="flex items-center">
      <img
        className="object-cover object-center rounded-[50%] size-12"
        src={visibleUsers[0]?.profilePic || defaultDp}
      />
      {visibleUsers.slice(1, 10).map((user, index) => (
        <img
          key={index}
          className="object-center size-12 ml-[-10px] rounded-[50%] object-cover"
          src={user?.profilePic || defaultDp}
        />
      ))}
      {remainingUsersCount > 0 && (
        <div className="text-sm font-medium bg-black border-2 p-6 border-slate-300 flex justify-center items-center size-12 rounded-[50%] ml-[-10px]">
          {remainingUsersCount}+
        </div>
      )}
    </div>
  );
};

export default GroupedUsers;
