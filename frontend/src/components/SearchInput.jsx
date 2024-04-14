/* eslint-disable react/prop-types */
const SearchInput = ({
  setList,
  switchList,
  initialList,
  leaderList,
  renderList,
  listNameSearchTxt,
  setListNameSearchTxt,
}) => {
  return (
    <input
      type="text"
      placeholder={`Search by ${renderList.toLowerCase()} name`}
      value={listNameSearchTxt}
      className="p-4 max-h-8 w-72 text-xs bg-inherit border-[1px] border-white rounded-xl"
      onChange={(e) => {
        setListNameSearchTxt(e.target.value);
        setList({
          type: "SEARCH",
          listNameSearchTxt: e.target.value,
          initialList: switchList ? leaderList : initialList,
        });
      }}
    />
  );
};

export default SearchInput;
