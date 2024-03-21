/* eslint-disable react/prop-types */
import ListItem from "./ListItem";
import EmptyListBody from "./EmptyListBody";

export default function ListBody({ renderList, list = [], listNameSearchTxt }) {
  return list.length > 0 ? (
    list.map((project, index) => (
      <ListItem key={index} {...project} renderList={renderList} />
    ))
  ) : (
    <EmptyListBody name={renderList} listNameSearchTxt={listNameSearchTxt} />
  );
}
