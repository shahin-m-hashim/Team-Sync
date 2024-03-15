import moment from "moment";

export const filterList = (state, action) => {
  switch (action.type) {
    case "RESET":
      return action.initialState;
    case "PROGRESS_ASC":
      return [...state].sort((a, b) => a.progress - b.progress);
    case "PROGRESS_DESC":
      return [...state].sort((a, b) => b.progress - a.progress);
    case "NAME_ASC":
      return [...state].sort((a, b) => a.name.localeCompare(b.name));
    case "NAME_DESC":
      return [...state].sort((a, b) => b.name.localeCompare(a.name));
    case "STATUS_ASC":
      return [...state].sort((a, b) => a.status.localeCompare(b.status));
    case "STATUS_DESC":
      return [...state].sort((a, b) => b.status.localeCompare(a.status));
    case "CREATED_ASC":
      return [...state].sort((a, b) =>
        moment(a.createdDate, "DD/MM/YYYY").diff(
          moment(b.createdDate, "DD/MM/YYYY")
        )
      );
    case "CREATED_DESC":
      return [...state].sort((a, b) =>
        moment(b.createdDate, "DD/MM/YYYY").diff(
          moment(a.createdDate, "DD/MM/YYYY")
        )
      );
    default:
      return state;
  }
};
