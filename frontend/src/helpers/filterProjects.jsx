import moment from "moment";

export const filterProjects = (state, action) => {
  switch (action.type) {
    case "NAME_ASC":
      return [...state].sort((a, b) => a.name.localeCompare(b.name));
    case "NAME_DESC":
      return [...state].sort((a, b) => b.name.localeCompare(a.name));
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
    case "PROGRESS_ASC":
      return [...state].sort((a, b) => a.progress - b.progress);
    case "PROGRESS_DESC":
      return [...state].sort((a, b) => b.progress - a.progress);
    case "STATUS_ASC":
      return [...state].sort((a, b) => a.status.localeCompare(b.status));
    case "STATUS_DESC":
      return [...state].sort((a, b) => b.status.localeCompare(a.status));
    default:
      return state;
  }
};
