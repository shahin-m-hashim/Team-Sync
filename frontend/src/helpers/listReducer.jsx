import moment from "moment";

export const listReducer = (state, action) => {
  switch (action.type) {
    case "RESET":
      return action.initialState;
    case "SWITCH":
      return action.payload;
    case "SEARCH": {
      const originalList = action.initialList;
      const searchResults = originalList.filter((item) =>
        item.name.toLowerCase().includes(action.listNameSearchTxt.toLowerCase())
      );
      return searchResults <= 0 ? [] : searchResults;
    }
    case "PROGRESS_ASC":
      return [...state].sort((a, b) => a.progress - b.progress);
    case "PROGRESS_DESC":
      return [...state].sort((a, b) => b.progress - a.progress);
    case "PRIORITY_ASC":
      return [...state].sort((a, b) => comparePriority(a.priority, b.priority));
    case "PRIORITY_DESC":
      return [...state].sort((a, b) => comparePriority(b.priority, a.priority));
    case "NAME_ASC":
      return [...state].sort((a, b) => a.name.localeCompare(b.name));
    case "NAME_DESC":
      return [...state].sort((a, b) => b.name.localeCompare(a.name));
    case "STATUS_ASC":
      return [...state].sort((a, b) => compareStatus(a.status, b.status));
    case "STATUS_DESC":
      return [...state].sort((a, b) => compareStatus(b.status, a.status));
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
    case "DEADLINE_ASC":
      return [...state].sort((a, b) =>
        moment(a.deadlineDate, "DD/MM/YYYY").diff(
          moment(b.deadlineDate, "DD/MM/YYYY")
        )
      );
    case "DEADLINE_DESC":
      return [...state].sort((a, b) =>
        moment(b.deadlineDate, "DD/MM/YYYY").diff(
          moment(a.deadlineDate, "DD/MM/YYYY")
        )
      );
    default:
      return state;
  }
};

const comparePriority = (priorityA, priorityB) => {
  const priorityOrder = { low: 0, medium: 1, high: 2 };
  return (
    priorityOrder[priorityA.toLowerCase()] -
    priorityOrder[priorityB.toLowerCase()]
  );
};

const compareStatus = (statusA, statusB) => {
  const statusOrder = { "not started": 0, pending: 1, stopped: 2, done: 3 };
  return (
    statusOrder[statusA.toLowerCase()] - statusOrder[statusB.toLowerCase()]
  );
};
